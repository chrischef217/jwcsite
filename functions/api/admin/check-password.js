// Admin Password Check API
const SECRET_MASTER_PASSWORD = '848605'; // 시크릿 마스터 비밀번호 (변경 불가)

export async function onRequestPost(context) {
    try {
        const { env } = context;
        const { password } = await context.request.json();

        if (!password) {
            return new Response(JSON.stringify({ valid: false }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 시크릿 마스터 비밀번호 확인
        if (password === SECRET_MASTER_PASSWORD) {
            return new Response(JSON.stringify({ valid: true, isMaster: true }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // KV에서 관리자 비밀번호 가져오기
        const storedPassword = await env.KV.get('admin_password');
        const adminPassword = storedPassword || '1111'; // 기본값

        const valid = password === adminPassword;

        return new Response(JSON.stringify({ valid, isMaster: false }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ valid: false, error: error.message }), {
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
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
