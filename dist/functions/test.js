// Test function
export async function onRequest() {
  return new Response(JSON.stringify({ 
    message: 'Functions working!',
    path: '/test'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
