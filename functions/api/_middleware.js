// Cloudflare Pages Function - KV Storage API
// Handles all storage operations using Workers KV

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  // KV binding check
  if (!env.KV) {
    return new Response(JSON.stringify({ 
      error: 'KV binding not found' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Extract path: /api/tables/images or /api/tables/settings
    const pathParts = url.pathname.split('/');
    const resource = pathParts[3]; // 'images' or 'settings'
    const id = pathParts[4]; // optional ID for specific item
    
    // Parse query params
    const searchParams = new URLSearchParams(url.search);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '100');

    console.log(`[KV API] ${method} ${url.pathname} - resource: ${resource}, search: ${search}`);

    // Handle different HTTP methods
    switch (method) {
      case 'GET':
        return await handleGet(env.KV, resource, search, limit, id);
      
      case 'POST':
        const postData = await request.json();
        return await handlePost(env.KV, resource, postData);
      
      case 'PUT':
        const putData = await request.json();
        return await handlePut(env.KV, resource, id, putData);
      
      case 'DELETE':
        return await handleDelete(env.KV, resource, id);
      
      case 'OPTIONS':
        return new Response(null, {
          status: 204,
          headers: getCORSHeaders()
        });
      
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { 'Content-Type': 'application/json', ...getCORSHeaders() }
        });
    }
  } catch (error) {
    console.error('[KV API Error]', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...getCORSHeaders() }
    });
  }
}

// GET handler
async function handleGet(kv, resource, search, limit, id) {
  if (id) {
    // Get specific item
    const item = await kv.get(`${resource}:${id}`, 'json');
    return jsonResponse({ data: item ? [item] : [] });
  }

  // List items with search filter
  const list = await kv.list({ prefix: `${resource}:` });
  let items = [];
  
  for (const key of list.keys) {
    const item = await kv.get(key.name, 'json');
    if (item) {
      // Filter by search term if provided
      if (!search || item.type === search || key.name.includes(search)) {
        items.push(item);
      }
    }
  }
  
  // Apply limit
  items = items.slice(0, limit);
  
  return jsonResponse({ success: true, data: items });
}

// POST handler - Create new item
async function handlePost(kv, resource, data) {
  const id = crypto.randomUUID();
  const item = {
    id: id,
    ...data,
    created_at: new Date().toISOString()
  };
  
  await kv.put(`${resource}:${id}`, JSON.stringify(item));
  
  return jsonResponse({ success: true, result: item });
}

// PUT handler - Update item
async function handlePut(kv, resource, id, data) {
  const existing = await kv.get(`${resource}:${id}`, 'json');
  
  const item = {
    ...existing,
    ...data,
    id: id,
    updated_at: new Date().toISOString()
  };
  
  await kv.put(`${resource}:${id}`, JSON.stringify(item));
  
  return jsonResponse({ success: true, result: item });
}

// DELETE handler
async function handleDelete(kv, resource, id) {
  await kv.delete(`${resource}:${id}`);
  
  return jsonResponse({ success: true });
}

// Helper functions
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      ...getCORSHeaders()
    }
  });
}

function getCORSHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
}
