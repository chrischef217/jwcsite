// Cloudflare Pages Function - Proxy for /api/tables/images
// Handles: GET /api/tables/images?search=...
//          POST /api/tables/images
//          PUT /api/tables/images/:id
//          DELETE /api/tables/images/:id

const API_BASE = 'https://www.genspark.ai/api/tables/images';

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Build target URL with query params and path
  const targetUrl = `${API_BASE}${url.pathname.replace('/api/tables/images', '')}${url.search}`;
  
  console.log(`[Proxy] ${request.method} ${targetUrl}`);
  
  try {
    // Get request body if exists
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.text();
    }
    
    // Forward the request to the actual API with proper headers
    const apiRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://jwcsite.pages.dev/',
        'Origin': 'https://jwcsite.pages.dev',
      },
      body: body,
    });
    
    const response = await fetch(apiRequest);
    const data = await response.text();
    
    // Return response with CORS headers
    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('[Proxy Error]', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
