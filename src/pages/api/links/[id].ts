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
    
    // Build the query dynamically based on what fields are provided
    let updateFields = [];
    const queryParams = [id]; // Start with the ID as the first parameter
    let paramCounter = 2; // Start from 2 since id is $1
    
    if ('title' in body) {
      updateFields.push(`title = $${paramCounter++}`);
      queryParams.push(body.title);
    }
    
    if ('description' in body) {
      updateFields.push(`description = $${paramCounter++}`);
      queryParams.push(body.description);
    }
    
    if ('url' in body) {
      updateFields.push(`url = $${paramCounter++}`);
      queryParams.push(body.url);
    }
    
    if ('position' in body) {
      updateFields.push(`position = $${paramCounter++}`);
      queryParams.push(body.position);
    }
    
    if (updateFields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const query = `UPDATE links SET ${updateFields.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await client.query(query, queryParams);
    
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};