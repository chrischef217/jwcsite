// Cloudflare Pages Function - Proxy for /api/*
// This proxies ALL requests under /api to https://www.genspark.ai/api

const API_BASE = 'https://www.genspark.ai/api';

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  
  // Build path from params
  const pathParts = params.path || [];
  const path = '/' + pathParts.join('/');
  const targetUrl = `${API_BASE}${path}${url.search}`;
  
  console.log(`[API Proxy] ${request.method} ${targetUrl}`);
  
  try {
    // Get request body if exists
    let body = undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        body = await request.text();
      }
    }
    
    // Forward the request
    const apiRequest = new Request(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://jwcsite.pages.dev/',
        'Origin': 'https://jwcsite.pages.dev',
      },
      body: body,
    });
    
    const response = await fetch(apiRequest);
    const data = await response.text();
    
    console.log(`[API Proxy] Response status: ${response.status}`);
    
    // Return with CORS headers
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
      success: false, 
      error: error.message,
      details: 'Proxy error occurred'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

// Handle OPTIONS
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
