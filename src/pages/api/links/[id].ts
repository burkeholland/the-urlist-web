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

// PATCH: Update a link (including group assignment)
export const PATCH: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();
    const fields = [];
    const values = [];
    let idx = 1;
    if (body.url !== undefined) { fields.push(`url = $${idx++}`); values.push(body.url); }
    if (body.title !== undefined) { fields.push(`title = $${idx++}`); values.push(body.title); }
    if (body.description !== undefined) { fields.push(`description = $${idx++}`); values.push(body.description); }
    if (body.group_id !== undefined) { fields.push(`group_id = $${idx++}`); values.push(body.group_id); }
    if (fields.length === 0) {
      return new Response(JSON.stringify({ error: 'No fields to update' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    values.push(id);
    const result = await client.query(
      `UPDATE links SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
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