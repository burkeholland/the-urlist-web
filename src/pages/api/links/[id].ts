import type { APIRoute } from 'astro';
import { client } from '../../../utils/db';

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

export const PATCH: APIRoute = async ({ request, params }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { url, title, description } = body;
    
    // Check if link exists first
    const checkResult = await client.query('SELECT id FROM links WHERE id = $1', [id]);
    if (checkResult.rowCount === 0) {
      return new Response(JSON.stringify({ error: 'Link not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the link
    const result = await client.query(
      'UPDATE links SET url = $1, title = $2, description = $3 WHERE id = $4 RETURNING *',
      [url, title, description, id]
    );
    
    // Handle case where result.rows might be null or empty
    if (!result.rows || result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Failed to update link' }), {
        status: 500,
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