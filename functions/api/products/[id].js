// Cloudflare Pages Function for Single Product API
export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const method = request.method;
    
    // Extract product ID from URL
    const pathParts = url.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // DELETE /api/products/:id
        if (method === 'DELETE') {
            const productsJson = await env.KV.get('products');
            const products = productsJson ? JSON.parse(productsJson) : [];
            
            const filteredProducts = products.filter(p => p.id !== productId);
            
            await env.KV.put('products', JSON.stringify(filteredProducts));
            
            return new Response(JSON.stringify({ 
                success: true,
                deleted: productId
            }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Product API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
