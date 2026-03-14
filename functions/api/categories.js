// Cloudflare Pages Function for Categories API
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
        // GET /api/categories - Get all categories
        if (method === 'GET') {
            const categoriesJson = await env.KV.get('categories');
            const categories = categoriesJson ? JSON.parse(categoriesJson) : {
                products: [
                    { id: 'cream', name: 'Cream Jars', nameKo: '크림 용기' },
                    { id: 'essence', name: 'Essence & Serum', nameKo: '에센스/세럼' },
                    { id: 'lotion', name: 'Lotion', nameKo: '로션' },
                    { id: 'eco', name: 'Eco-Friendly', nameKo: '친환경' }
                ],
                certifications: [
                    { id: 'iso', name: 'ISO', nameKo: 'ISO' },
                    { id: 'patent', name: 'Patent', nameKo: '특허' },
                    { id: 'quality', name: 'Quality', nameKo: '품질인증' },
                    { id: 'others', name: 'Others', nameKo: '기타' }
                ]
            };
            
            return new Response(JSON.stringify(categories), {
                headers: corsHeaders
            });
        }

        // POST /api/categories - Update categories
        if (method === 'POST') {
            const data = await request.json();
            
            // Validate data
            if (!data.type || !data.categories) {
                return new Response(JSON.stringify({ 
                    error: 'Missing required fields (type, categories)' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // Get existing categories
            const categoriesJson = await env.KV.get('categories');
            const categories = categoriesJson ? JSON.parse(categoriesJson) : {
                products: [],
                certifications: []
            };
            
            // Update specific type
            if (data.type === 'products' || data.type === 'certifications') {
                categories[data.type] = data.categories;
            } else {
                return new Response(JSON.stringify({ 
                    error: 'Invalid type. Must be "products" or "certifications"' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // Save to KV
            await env.KV.put('categories', JSON.stringify(categories));
            
            return new Response(JSON.stringify({ 
                success: true,
                categories: categories
            }), {
                headers: corsHeaders
            });
        }

        // DELETE /api/categories?type=xxx&id=xxx - Delete category
        if (method === 'DELETE') {
            const type = url.searchParams.get('type');
            const id = url.searchParams.get('id');
            
            if (!type || !id) {
                return new Response(JSON.stringify({ 
                    error: 'Missing required parameters (type, id)' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // Get existing categories
            const categoriesJson = await env.KV.get('categories');
            const categories = categoriesJson ? JSON.parse(categoriesJson) : {
                products: [],
                certifications: []
            };
            
            // Validate type
            if (type !== 'products' && type !== 'certifications') {
                return new Response(JSON.stringify({ 
                    error: 'Invalid type. Must be "products" or "certifications"' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // Filter out the category
            const filtered = categories[type].filter(c => c.id !== id);
            
            if (filtered.length === categories[type].length) {
                return new Response(JSON.stringify({ 
                    error: 'Category not found' 
                }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
            
            categories[type] = filtered;
            
            // Save to KV
            await env.KV.put('categories', JSON.stringify(categories));
            
            return new Response(JSON.stringify({ 
                success: true,
                deleted: id
            }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Categories API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
