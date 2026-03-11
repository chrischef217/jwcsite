// Cloudflare Pages Function for Page Hero Media Item Actions
export async function onRequest(context) {
    const { request, env, params } = context;
    const method = request.method;
    const pageName = params.page;
    const mediaId = params.id;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const kvKey = `hero_${pageName}`;

    try {
        // DELETE - Delete media item
        if (method === 'DELETE') {
            const mediaJson = await env.KV.get(kvKey);
            const media = mediaJson ? JSON.parse(mediaJson) : [];
            
            const filtered = media.filter(item => item.id !== mediaId);
            await env.KV.put(kvKey, JSON.stringify(filtered));
            
            return new Response(JSON.stringify({ 
                success: true,
                deleted: mediaId
            }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Page Hero Media API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
