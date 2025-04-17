import type { APIRoute } from 'astro';
import { client } from '../../../utils/db';
import fetch from 'node-fetch';
import metascraper from 'metascraper';
import metascraperTitle from 'metascraper-title';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';

const scraper = metascraper([
  metascraperTitle(),
  metascraperDescription(),
  metascraperImage()
]);

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    await client.query('DELETE FROM links WHERE id = $1', [id]);
    
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { url, title, description } = body;
    
    let updatedData: Record<string, any> = {};
    
    // If URL is updated, fetch new metadata
    if (url) {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const metadata = await scraper({ html, url });
        
        updatedData = {
          url,
          title: title || metadata.title || url,
          description: description || metadata.description || '',
          image: metadata.image || ''
        };
      } catch (error) {
        console.error('Error fetching metadata:', error);
        updatedData = { url, title, description };
      }
    } else {
      // If only title or description is updated
      updatedData = { title, description };
    }
    
    // Filter out undefined values
    Object.keys(updatedData).forEach(key => 
      updatedData[key] === undefined && delete updatedData[key]
    );
    
    if (Object.keys(updatedData).length === 0) {
      return new Response(JSON.stringify({ error: 'No valid fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Build the SQL query dynamically based on what fields were provided
    const fields = Object.keys(updatedData);
    const values = Object.values(updatedData);
    
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE links SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
    
    const result = await client.query(query, [...values, id]);
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Link not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(result.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error updating link:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};