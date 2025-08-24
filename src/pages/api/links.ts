
import type { APIRoute } from 'astro';
import { client } from '../../utils/db';
import fetch from 'node-fetch';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import { sanitizeUrl } from '../../utils/validation';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    let { url, list_id } = body;
    url = sanitizeUrl(url);

    // Fetch metadata
    const response = await fetch(url);
    const html = await response.text();
    const metadata = await scraper({ html, url });

    const result = await client.query(
      'INSERT INTO links (title, description, url, image, list_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [
        metadata.title || url,
        metadata.description || '',
        url,
        metadata.image || '',
        list_id
      ]
    );

    return new Response(JSON.stringify(result.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error creating link:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const listId = url.searchParams.get('list_id');
    const groupId = url.searchParams.get('group_id');
    if (!listId) {
      return new Response(JSON.stringify({ error: 'list_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    let query = 'SELECT * FROM links WHERE list_id = $1';
    const params: any[] = [Number(listId)];
    if (groupId !== null && groupId !== undefined) {
      query += ' AND group_id = $2';
      params.push(Number(groupId));
    }
    query += ' ORDER BY COALESCE(position, 999999), created_at ASC';
    const result = await client.query(query, params);
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error fetching links:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    let { orderedIds, list_id } = body;
    if (!Array.isArray(orderedIds)) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Accept list_id as string or number
    list_id = Number(list_id);
    if (isNaN(list_id)) {
      return new Response(JSON.stringify({ error: 'Invalid list_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Update each link's position in the DB
    for (let i = 0; i < orderedIds.length; i++) {
      await client.query(
        'UPDATE links SET position = $1 WHERE id = $2 AND list_id = $3',
        [i + 1, orderedIds[i], list_id]
      );
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};