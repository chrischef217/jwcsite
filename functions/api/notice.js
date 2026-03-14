// Notice API (공지사항 - 관리자 전용)
const ADMIN_PASSWORD = '1111';

export async function onRequestGet(context) {
    try {
        const { env } = context;
        const url = new URL(context.request.url);
        const id = url.searchParams.get('id');

        // 단일 공지사항 조회
        if (id) {
            const notice = await env.KV.get(`notice_${id}`);
            if (!notice) {
                return new Response(JSON.stringify({ error: 'Notice not found' }), {
                    status: 404,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
            return new Response(notice, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });
        }

        // 전체 공지사항 목록 조회
        const list = await env.KV.list({ prefix: 'notice_' });
        const notices = await Promise.all(
            list.keys.map(async (key) => {
                const data = await env.KV.get(key.name);
                return JSON.parse(data);
            })
        );

        // 최신순 정렬
        notices.sort((a, b) => b.created_at - a.created_at);

        return new Response(JSON.stringify(notices), {
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

        // 관리자 비밀번호 검증
        if (data.password !== ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 필수 필드 검증
        if (!data.title || !data.content) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const id = Date.now();
        const notice = {
            id: `notice_${id}`,
            title: data.title,
            content: data.content,
            media: data.media || null, // 이미지 또는 동영상 (base64 또는 URL)
            mediaType: data.mediaType || null, // 'image' 또는 'video'
            created_at: id,
            updated_at: id
        };

        await env.KV.put(`notice_${id}`, JSON.stringify(notice));

        return new Response(JSON.stringify({ success: true, id: notice.id }), {
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

        // 관리자 비밀번호 검증
        if (data.password !== ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        if (!data.id) {
            return new Response(JSON.stringify({ error: 'Missing id' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const notice = await env.KV.get(data.id);
        if (!notice) {
            return new Response(JSON.stringify({ error: 'Notice not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const noticeData = JSON.parse(notice);

        // 수정
        const updatedNotice = {
            ...noticeData,
            title: data.title || noticeData.title,
            content: data.content || noticeData.content,
            media: data.media !== undefined ? data.media : noticeData.media,
            mediaType: data.mediaType !== undefined ? data.mediaType : noticeData.mediaType,
            updated_at: Date.now()
        };

        await env.KV.put(data.id, JSON.stringify(updatedNotice));

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

        // 관리자 비밀번호 검증
        if (password !== ADMIN_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        if (!id) {
            return new Response(JSON.stringify({ error: 'Missing id' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const notice = await env.KV.get(id);
        if (!notice) {
            return new Response(JSON.stringify({ error: 'Notice not found' }), {
                status: 404,
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
