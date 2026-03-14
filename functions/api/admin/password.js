// Admin Password Management API
const SECRET_MASTER_PASSWORD = '848605'; // 시크릿 마스터 비밀번호 (변경 불가)

// GET: 현재 관리자 비밀번호 가져오기
export async function onRequestGet(context) {
    try {
        const { env } = context;
        const url = new URL(context.request.url);
        const authPassword = url.searchParams.get('password');

        // 인증 확인 (시크릿 마스터 비밀번호만 가능)
        if (authPassword !== SECRET_MASTER_PASSWORD) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        const storedPassword = await env.KV.get('admin_password');
        const adminPassword = storedPassword || '1111'; // 기본값

        return new Response(JSON.stringify({ password: adminPassword }), {
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

// POST: 관리자 비밀번호 변경
export async function onRequestPost(context) {
    try {
        const { env } = context;
        const { currentPassword, newPassword } = await context.request.json();

        if (!currentPassword || !newPassword) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 현재 비밀번호 확인 (시크릿 마스터 비밀번호 또는 현재 관리자 비밀번호)
        const storedPassword = await env.KV.get('admin_password');
        const adminPassword = storedPassword || '1111';

        if (currentPassword !== SECRET_MASTER_PASSWORD && currentPassword !== adminPassword) {
            return new Response(JSON.stringify({ error: 'Invalid current password' }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 새 비밀번호 저장
        await env.KV.put('admin_password', newPassword);

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
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
