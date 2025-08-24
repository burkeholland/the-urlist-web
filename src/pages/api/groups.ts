import type { APIRoute } from 'astro';
import { client } from '../../utils/db';

// Create a new group in a list
export const POST: APIRoute = async ({ request }) => {
    try {
        const { list_id, name, position } = await request.json();
        if (!list_id || !name) {
            return new Response(JSON.stringify({ error: 'list_id and name are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const result = await client.query(
            'INSERT INTO link_groups (list_id, name, position) VALUES ($1, $2, $3) RETURNING *',
            [list_id, name, position || 0]
        );
        return new Response(JSON.stringify(result.rows[0]), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// Get all groups for a list
export const GET: APIRoute = async ({ url }) => {
    try {
        const listId = url.searchParams.get('list_id');
        if (!listId) {
            return new Response(JSON.stringify({ error: 'list_id is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const result = await client.query(
            'SELECT * FROM link_groups WHERE list_id = $1 ORDER BY position, created_at',
            [Number(listId)]
        );
        return new Response(JSON.stringify(result.rows), {
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
