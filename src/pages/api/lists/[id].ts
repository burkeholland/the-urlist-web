import type { APIRoute } from 'astro';
import { client } from '../../../utils/db';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const result = await client.query('SELECT * FROM lists WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'List not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(result.rows[0]), {
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

export const DELETE: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    
    // First delete all links in the list
    await client.query('DELETE FROM links WHERE list_id = $1', [id]);
    
    // Then delete the list itself
    await client.query('DELETE FROM lists WHERE id = $1', [id]);
    
    return new Response(null, { status: 204 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};