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
    
    try {
        await env.KV.delete(id);
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
