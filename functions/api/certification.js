// Cloudflare Pages Function for Certification API
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
        // GET /api/certification - Get all certifications
        if (method === 'GET') {
            const certificationsJson = await env.KV.get('certifications');
            const certifications = certificationsJson ? JSON.parse(certificationsJson) : [];
            
            return new Response(JSON.stringify(certifications), {
                headers: corsHeaders
            });
        }

        // POST /api/certification - Create/Update certification
        if (method === 'POST') {
            const certData = await request.json();
            
            // Get existing certifications
            const certificationsJson = await env.KV.get('certifications');
            const certifications = certificationsJson ? JSON.parse(certificationsJson) : [];
            
            // Find if certification exists
            const existingIndex = certifications.findIndex(c => c.id === certData.id);
            
            if (existingIndex >= 0) {
                // Update existing certification
                certifications[existingIndex] = {
                    ...certifications[existingIndex],
                    ...certData,
                    updatedAt: new Date().toISOString()
                };
            } else {
                // Add new certification
                certifications.push({
                    ...certData,
                    createdAt: certData.createdAt || new Date().toISOString()
                });
            }
            
            // Save to KV
            await env.KV.put('certifications', JSON.stringify(certifications));
            
            return new Response(JSON.stringify({ 
                success: true, 
                certification: certData 
            }), {
                headers: corsHeaders
            });
        }

        // DELETE /api/certification/:id - Delete certification
        if (method === 'DELETE') {
            const pathParts = url.pathname.split('/');
            const certId = pathParts[pathParts.length - 1];
            
            // Get existing certifications
            const certificationsJson = await env.KV.get('certifications');
            const certifications = certificationsJson ? JSON.parse(certificationsJson) : [];
            
            // Filter out the certification
            const filteredCertifications = certifications.filter(c => c.id !== certId);
            
            // Save to KV
            await env.KV.put('certifications', JSON.stringify(filteredCertifications));
            
            return new Response(JSON.stringify({ 
                success: true,
                deleted: certId
            }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Certification API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
