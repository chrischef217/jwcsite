// Cloudflare Pages Function - Proxy for Genspark API
export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // Get the path after /api/tables/
    const path = context.params.path ? context.params.path.join('/') : '';
    
    // Build target URL
    const targetUrl = `https://www.genspark.ai/api/tables/${path}${url.search}`;
    
    console.log('🔄 Proxying:', request.method, targetUrl);
    
    // Forward the request
    const headers = new Headers(request.headers);
    headers.delete('host'); // Remove host header
    
    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
        body = await request.text();
    }
    
    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: body
        });
        
        // Get response body
        const responseBody = await response.text();
        
        // Create new response with CORS headers
        return new Response(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });
    } catch (error) {
        console.error('❌ Proxy error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// Handle OPTIONS preflight request
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}
