import type { APIRoute } from 'astro';
import { client } from '../../../utils/db';

// PATCH: Rename a group
export const PATCH: APIRoute = async ({ params, request }) => {
    try {
        const { id } = params;
        const { name } = await request.json();
        if (!name) {
            return new Response(JSON.stringify({ error: 'name is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const result = await client.query(
            'UPDATE link_groups SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        if (result.rows.length === 0) {
            return new Response(JSON.stringify({ error: 'Group not found' }), {
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
