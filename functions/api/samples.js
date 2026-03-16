// Cloudflare Pages Function for Sample Requests API
export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    const method = request.method;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // GET /api/samples - Get all sample requests
        if (method === 'GET') {
            const samplesJson = await env.KV.get('sample_requests');
            const samples = samplesJson ? JSON.parse(samplesJson) : [];
            
            // Sort by date (newest first)
            samples.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            return new Response(JSON.stringify(samples), {
                headers: corsHeaders
            });
        }

        // POST /api/samples - Create new sample request
        if (method === 'POST') {
            const requestData = await request.json();
            
            // Get existing samples
            const samplesJson = await env.KV.get('sample_requests');
            const samples = samplesJson ? JSON.parse(samplesJson) : [];
            
            // Create new sample request
            const newSample = {
                id: Date.now().toString(),
                company: requestData.company,
                name: requestData.name,
                phone: requestData.phone,
                email: requestData.email,
                address: requestData.address,
                message: requestData.message,
                product: requestData.product,
                status: 'pending', // pending, approved, rejected, completed
                provided: false,
                adminMemo: '',
                historyMemo: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            samples.push(newSample);
            
            // Save to KV
            await env.KV.put('sample_requests', JSON.stringify(samples));
            
            return new Response(JSON.stringify({ 
                success: true, 
                sample: newSample 
            }), {
                headers: corsHeaders
            });
        }

        // PUT /api/samples?id=xxx - Update sample request
        if (method === 'PUT') {
            const sampleId = url.searchParams.get('id');
            const updateData = await request.json();
            
            if (!sampleId) {
                return new Response(JSON.stringify({ 
                    error: 'Missing sample ID' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // Get existing samples
            const samplesJson = await env.KV.get('sample_requests');
            const samples = samplesJson ? JSON.parse(samplesJson) : [];
            
            // Find and update sample
            const sampleIndex = samples.findIndex(s => s.id === sampleId);
            
            if (sampleIndex === -1) {
                return new Response(JSON.stringify({ 
                    error: 'Sample request not found' 
                }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
            
            samples[sampleIndex] = {
                ...samples[sampleIndex],
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            
            // Save to KV
            await env.KV.put('sample_requests', JSON.stringify(samples));
            
            return new Response(JSON.stringify({ 
                success: true,
                sample: samples[sampleIndex]
            }), {
                headers: corsHeaders
            });
        }

        // DELETE /api/samples?id=xxx - Delete sample request
        if (method === 'DELETE') {
            const sampleId = url.searchParams.get('id');
            
            if (!sampleId) {
                return new Response(JSON.stringify({ 
                    error: 'Missing sample ID' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // Get existing samples
            const samplesJson = await env.KV.get('sample_requests');
            const samples = samplesJson ? JSON.parse(samplesJson) : [];
            
            // Filter out the sample
            const filteredSamples = samples.filter(s => s.id !== sampleId);
            
            if (filteredSamples.length === samples.length) {
                return new Response(JSON.stringify({ 
                    error: 'Sample request not found' 
                }), {
                    status: 404,
                    headers: corsHeaders
                });
            }
            
            // Save to KV
            await env.KV.put('sample_requests', JSON.stringify(filteredSamples));
            
            return new Response(JSON.stringify({ 
                success: true,
                deleted: sampleId
            }), {
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Sample Requests API Error:', error);
        return new Response(JSON.stringify({ 
            error: error.message 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
