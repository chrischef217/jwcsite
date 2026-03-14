// Cloudflare Pages Function for Products API
export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const method = request.method;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // GET /api/products - Get all products
        if (method === 'GET') {
            const productsJson = await env.KV.get('products');
            const products = productsJson ? JSON.parse(productsJson) : [];
            
            return new Response(JSON.stringify(products), {
                headers: corsHeaders
            });
        }

        // POST /api/products - Create/Update product
        if (method === 'POST') {
            const productData = await request.json();
            
            // Get existing products
            const productsJson = await env.KV.get('products');
            const products = productsJson ? JSON.parse(productsJson) : [];
            
            // Find if product exists
            const existingIndex = products.findIndex(p => p.id === productData.id);
            
            if (existingIndex >= 0) {
                // Update existing product
                products[existingIndex] = {
                    ...products[existingIndex],
                    ...productData,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // Add new product
                products.push({
                    ...productData,
                    createdAt: productData.createdAt || new Date().toISOString()
                });
            }
            
            // Save to KV
            await env.KV.put('products', JSON.stringify(products));
            
            return new Response(JSON.stringify({ 
                success: true, 
                product: productData 
            }), {
                headers: corsHeaders
            });
        }

        // DELETE /api/products?id=xxx - Delete product
        if (method === 'DELETE') {
            const productId = url.searchParams.get('id');
            
            if (!productId) {
                return new Response(JSON.stringify({ 
                    error: 'Missing product ID' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // Get existing products
            const productsJson = await env.KV.get('products');
            const products = productsJson ? JSON.parse(productsJson) : [];
            
            // Filter out the product
            const filteredProducts = products.filter(p => p.id !== productId);
            
            if (filteredProducts.length === products.length) {
                return new Response(JSON.stringify({ 
                    error: 'Product not found' 
                }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
            
            // Save to KV
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
        console.error('Products API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
