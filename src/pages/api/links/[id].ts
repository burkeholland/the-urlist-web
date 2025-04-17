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
    
    // Build the update query dynamically based on the provided fields
    const updates = [];
    const values = [];
    let paramCounter = 1;
    
    if (url !== undefined) {
      updates.push(`url = $${paramCounter}`);
      values.push(url);
      paramCounter++;
    }
    
    if (title !== undefined) {
      updates.push(`title = $${paramCounter}`);
      values.push(title);
      paramCounter++;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramCounter}`);
      values.push(description);
      paramCounter++;
    }
    
    // Add the ID as the last parameter
    values.push(id);
    
    const query = `
      UPDATE links 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCounter} 
      RETURNING *
    `;
    
    const result = await client.query(query, values);
    
    // If no rows were affected, the link doesn't exist
    if (result.rowCount === 0) {
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};