// Cloudflare Pages Function - KV Storage API
export async function onRequestGet(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    try {
        if (id) {
            const data = await env.KV.get(id);
            return new Response(data || JSON.stringify({ error: 'Not found' }), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        } else {
            const list = await env.KV.list({ prefix: 'hero_' });
            const items = await Promise.all(
                list.keys.map(async (key) => {
                    const data = await env.KV.get(key.name);
                    return JSON.parse(data);
                })
            );
            return new Response(JSON.stringify(items), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    
    try {
        const data = await request.json();
        const id = 'hero_' + Date.now();
        await env.KV.put(id, JSON.stringify({ id, ...data }));
        
        return new Response(JSON.stringify({ success: true, id }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function onRequestDelete(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    console.log('[DELETE] Attempting to delete ID:', id);
    
    if (!id) {
        return new Response(JSON.stringify({ error: 'ID parameter is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
    
    try {
        // Check if item exists first
        const existing = await env.KV.get(id);
        console.log('[DELETE] Existing item:', existing ? 'Found' : 'Not found');
        
        if (!existing) {
            return new Response(JSON.stringify({ error: 'Item not found', id }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
        
        // Delete from KV
        await env.KV.delete(id);
        console.log('[DELETE] Successfully deleted:', id);
        
        return new Response(JSON.stringify({ success: true, id, deleted: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        console.error('[DELETE] Error:', error.message);
        return new Response(JSON.stringify({ error: error.message, id }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function onRequestOptions(context) {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400'
        }
    });
}

export async function onRequestPut(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    try {
        const existingData = await env.KV.get(id);
        if (!existingData) {
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
            });
        }
        
        const updates = await request.json();
        const data = { ...JSON.parse(existingData), ...updates };
        await env.KV.put(id, JSON.stringify(data));
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}
