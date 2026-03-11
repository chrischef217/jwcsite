// Cloudflare Pages Function - Slider Settings
export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        const data = await env.KV.get('slider_settings');
        return new Response(data || JSON.stringify({ interval: 5, text: '' }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
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
        await env.KV.put('slider_settings', JSON.stringify(data));
        
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
