// Cloudflare Pages Advanced Mode Function
// Handles ALL /api/* routes using advanced mode

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Extract path after /api
  const apiPath = url.pathname.substring(4); // Remove '/api'
  const targetUrl = `https://www.genspark.ai/api${apiPath}${url.search}`;
  
  console.log(`[API Proxy] ${request.method} ${targetUrl}`);
  
  try {
    // Get body if needed
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
      body = await request.text();
    }
    
    // Create proxied request
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      body: body,
    });
    
    const response = await fetch(proxyRequest);
    const data = await response.text();
    
    // Return with CORS
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
    console.error('[API Proxy Error]', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      targetUrl: targetUrl
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

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
