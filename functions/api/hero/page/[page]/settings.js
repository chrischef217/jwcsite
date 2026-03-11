// Cloudflare Pages Function for Page Hero Settings
export async function onRequest(context) {
    const { request, env, params } = context;
    const method = request.method;
    const pageName = params.page;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const kvKey = `hero_${pageName}_settings`;

    try {
        // GET - Get settings
        if (method === 'GET') {
            const settingsJson = await env.KV.get(kvKey);
            const settings = settingsJson ? JSON.parse(settingsJson) : {};
            
            return new Response(JSON.stringify(settings), {
                headers: corsHeaders
            });
        }

        // POST - Save settings
        if (method === 'POST') {
            const settings = await request.json();
            await env.KV.put(kvKey, JSON.stringify(settings));
            
            return new Response(JSON.stringify({ 
                success: true,
                settings 
            }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Page Hero Settings API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
