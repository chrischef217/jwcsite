// Cloudflare Pages Function for Page Hero Sliders
export async function onRequest(context) {
    const { request, env, params } = context;
    const url = new URL(request.url);
    const method = request.method;
    const pageName = params.page; // about, products, contact

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const kvKey = `hero_${pageName}`;
    const kvSettingsKey = `hero_${pageName}_settings`;

    try {
        // GET - Get page hero slider
        if (method === 'GET') {
            const mediaJson = await env.KV.get(kvKey);
            const settingsJson = await env.KV.get(kvSettingsKey);
            
            return new Response(JSON.stringify({
                media: mediaJson ? JSON.parse(mediaJson) : [],
                settings: settingsJson ? JSON.parse(settingsJson) : {}
            }), {
                headers: corsHeaders
            });
        }

        // POST - Add media item
        if (method === 'POST') {
            const mediaItem = await request.json();
            
            const mediaJson = await env.KV.get(kvKey);
            const media = mediaJson ? JSON.parse(mediaJson) : [];
            
            const newItem = {
                id: Date.now().toString(),
                ...mediaItem,
                createdAt: new Date().toISOString()
            };
            
            media.push(newItem);
            await env.KV.put(kvKey, JSON.stringify(media));
            
            return new Response(JSON.stringify({ 
                success: true, 
                item: newItem 
            }), {
                headers: corsHeaders
            });
        }

        // DELETE - Delete media item by ID
        if (method === 'DELETE') {
            const { itemId } = await request.json();
            
            if (!itemId) {
                return new Response(JSON.stringify({ 
                    error: 'Item ID is required' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            const mediaJson = await env.KV.get(kvKey);
            const media = mediaJson ? JSON.parse(mediaJson) : [];
            
            const filteredMedia = media.filter(item => item.id !== itemId);
            await env.KV.put(kvKey, JSON.stringify(filteredMedia));
            
            return new Response(JSON.stringify({ 
                success: true,
                message: 'Item deleted successfully'
            }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Page Hero API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
