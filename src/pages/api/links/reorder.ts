import type { APIRoute } from 'astro';
import { client } from '../../../utils/db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { links } = body;

    if (!Array.isArray(links) || links.length === 0) {
      return new Response(JSON.stringify({ error: 'No links provided for reordering' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Start a transaction to ensure all updates happen atomically
    await client.query('BEGIN');

    for (let i = 0; i < links.length; i++) {
      const { id, position } = links[i];
      
      if (!id || typeof position !== 'number') {
        await client.query('ROLLBACK');
        return new Response(JSON.stringify({ error: `Invalid data at index ${i}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Update the position of each link
      await client.query('UPDATE links SET position = $1 WHERE id = $2', [position, id]);
    }

    // Commit the transaction
    await client.query('COMMIT');

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    // If there's an error, rollback the transaction
    await client.query('ROLLBACK').catch(() => {});

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};