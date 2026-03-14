// Notice API (공지사항 - 관리자 전용)
const SECRET_MASTER_PASSWORD = '848605'; // 시크릿 마스터 비밀번호

// 관리자 비밀번호를 KV에서 가져오는 함수
async function getAdminPassword(env) {
    const stored = await env.KV.get('admin_password');
    return stored || '1111'; // 기본값 1111
}

export async function onRequestGet(context) {
    try {
        const { env } = context;
        const url = new URL(context.request.url);
        const id = url.searchParams.get('id');

        // 단일 공지사항 조회
        if (id) {
            const key = id.startsWith('notice_') ? id : `notice_${id}`;
            const notice = await env.KV.get(key);
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
        const notices = [];
        
        // KV.list()가 null이거나 keys가 없는 경우 처리
        if (!list || !list.keys || !Array.isArray(list.keys)) {
            console.log('No keys found in KV for prefix notice_');
            return new Response(JSON.stringify([]), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });
        }
        
        for (const key of list.keys) {
            try {
                if (!key || !key.name) {
                    console.warn('Invalid key object:', key);
                    continue;
                }
                
                const data = await env.KV.get(key.name);
                if (data) {
                    try {
                        const parsed = JSON.parse(data);
                        // notice_ prefix가 있는 id만 추가
                        if (parsed && parsed.id && parsed.id.startsWith('notice_')) {
                            notices.push(parsed);
                        }
                    } catch (parseError) {
                        console.error(`Failed to parse notice ${key.name}:`, parseError);
                        // 파싱 실패한 항목은 건너뜀
                        continue;
                    }
                }
            } catch (e) {
                console.error(`Failed to get notice ${key.name}:`, e);
                // 항목 가져오기 실패는 건너뜀
                continue;
            }
        }

        // 최신순 정렬 (안전하게)
        notices.sort((a, b) => {
            const timeA = a.created_at || 0;
            const timeB = b.created_at || 0;
            return timeB - timeA;
        });

        return new Response(JSON.stringify(notices), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (error) {
        console.error('Notice API Error:', error);
        console.error('Error stack:', error.stack);
        return new Response(JSON.stringify({ error: error.message || 'Unknown error', stack: error.stack }), {
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
        const adminPassword = await getAdminPassword(env);
        if (data.password !== adminPassword && data.password !== SECRET_MASTER_PASSWORD) {
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
        const adminPassword = await getAdminPassword(env);
        if (data.password !== adminPassword && data.password !== SECRET_MASTER_PASSWORD) {
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
        const adminPassword = await getAdminPassword(env);
        if (password !== adminPassword && password !== SECRET_MASTER_PASSWORD) {
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
