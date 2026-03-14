// Contact Board API (게시판)
const ADMIN_PASSWORD = '1111'; // 관리자 비밀번호

export async function onRequestGet(context) {
    try {
        const { env } = context;
        const url = new URL(context.request.url);
        const id = url.searchParams.get('id');
        const password = url.searchParams.get('password');

        // 단일 게시글 조회 (비밀번호 검증 필요)
        if (id) {
            const post = await env.KV.get(`board_${id}`);
            if (!post) {
                return new Response(JSON.stringify({ error: 'Post not found' }), {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
            
            const postData = JSON.parse(post);
            
            // 비밀번호 검증 (일반 비밀번호 또는 관리자 비밀번호)
            if (!password || (password !== postData.password && password !== ADMIN_PASSWORD)) {
                return new Response(JSON.stringify({ error: 'Invalid password' }), {
                    status: 403,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
            
            return new Response(post, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });
        }

        // 전체 게시글 목록 조회
        const list = await env.KV.list({ prefix: 'board_' });
        const posts = await Promise.all(
            list.keys.map(async (key) => {
                const data = await env.KV.get(key.name);
                return JSON.parse(data);
            })
        );

        // 최신순 정렬
        posts.sort((a, b) => b.created_at - a.created_at);

        return new Response(JSON.stringify(posts), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

export async function onRequestPost(context) {
    try {
        const { env } = context;
        const data = await context.request.json();

        // 필수 필드 검증
        if (!data.company || !data.author || !data.email || !data.phone || !data.password || !data.content) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const id = Date.now();
        const post = {
            id: `board_${id}`,
            company: data.company,
            author: data.author,
            email: data.email,
            phone: data.phone,
            password: data.password, // 실제로는 해시 처리해야 하지만 간단하게 구현
            content: data.content,
            created_at: id,
            updated_at: id
        };

        await env.KV.put(`board_${id}`, JSON.stringify(post));

        return new Response(JSON.stringify({ success: true, id: post.id }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

export async function onRequestPut(context) {
    try {
        const { env } = context;
        const data = await context.request.json();

        if (!data.id || !data.password) {
            return new Response(JSON.stringify({ error: 'Missing id or password' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const post = await env.KV.get(data.id);
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const postData = JSON.parse(post);

        // 비밀번호 검증 (일반 비밀번호 또는 관리자 비밀번호)
        if (data.password !== postData.password && data.password !== ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 수정
        const updatedPost = {
            ...postData,
            company: data.company || postData.company,
            author: data.author || postData.author,
            email: data.email || postData.email,
            phone: data.phone || postData.phone,
            content: data.content || postData.content,
            updated_at: Date.now()
        };

        await env.KV.put(data.id, JSON.stringify(updatedPost));

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

export async function onRequestDelete(context) {
    try {
        const { env } = context;
        const url = new URL(context.request.url);
        const id = url.searchParams.get('id');
        const password = url.searchParams.get('password');

        if (!id || !password) {
            return new Response(JSON.stringify({ error: 'Missing id or password' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const post = await env.KV.get(id);
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const postData = JSON.parse(post);

        // 비밀번호 검증
        if (password !== postData.password && password !== ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        await env.KV.delete(id);

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
