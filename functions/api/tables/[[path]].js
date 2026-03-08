// Cloudflare Pages Function - API Proxy for RESTful Table API
// This function proxies all requests to https://www.genspark.ai/api/tables
// and handles CORS issues

const API_BASE = 'https://www.genspark.ai/api/tables';

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  
  // Build target URL
  const path = params.path ? params.path.join('/') : '';
  const targetUrl = `${API_BASE}/${path}${url.search}`;
  
  console.log(`[Proxy] ${request.method} ${targetUrl}`);
  
  try {
    // Forward the request to the actual API
    const apiRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.method !== 'GET' && request.method !== 'HEAD' 
        ? await request.text() 
        : undefined,
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
