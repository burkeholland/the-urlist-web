
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

    // Fetch metadata with proper redirect handling
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        redirect: 'follow',
        follow: 20, // Allow up to 20 redirects
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; The-Urlist-Bot/1.0)'
        }
      });
      clearTimeout(timeout);
      
      const html = await response.text();
      const finalUrl = response.url || url; // Use final redirect URL for scraping
      const metadata = await scraper({ html, url: finalUrl });

      console.log(`Metadata scraped for ${url} -> ${finalUrl}:`, {
        title: metadata.title,
        description: metadata.description?.substring(0, 100),
        image: metadata.image
      });

      const result = await client.query(
        'INSERT INTO links (title, description, url, image, list_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          metadata.title || url,
          metadata.description || '',
          url, // Store original URL
          metadata.image || '',
          list_id
        ]
      );

      return new Response(JSON.stringify(result.rows[0]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (fetchError: any) {
      clearTimeout(timeout);
      console.error(`Failed to fetch metadata for ${url}:`, fetchError.message);
      
      // If metadata fetching fails, still create the link with basic info
      const result = await client.query(
        'INSERT INTO links (title, description, url, image, list_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          url, // Use URL as title fallback
          '',
          url,
          '',
          list_id
        ]
      );

      return new Response(JSON.stringify(result.rows[0]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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
    if (!listId) {
      return new Response(JSON.stringify({ error: 'list_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // Order by position if present, else by created_at
    const result = await client.query(
      'SELECT * FROM links WHERE list_id = $1 ORDER BY COALESCE(position, 999999), created_at ASC',
      [Number(listId)]
    );
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