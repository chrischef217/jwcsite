// ============================================
// RESTful Table API 기반 데이터 관리
// VERSION: 3.1.20240308
// LAST UPDATE: 2024-03-08 - API 경로 수정
// ============================================

const API_BASE = '/api/table';

// ============================================
// 이미지 관리 API
// ============================================

/**
 * 로고 저장
 */
async function saveLogoToDB(filename, dataUrl) {
    try {
        // 기존 로고 삭제
        const existing = await fetch(`${API_BASE}/images?search=logo`);
        const result = await existing.json();
        
        if (result.data && result.data.length > 0) {
            for (const logo of result.data) {
                if (logo.type === 'logo') {
                    await fetch(`${API_BASE}/images/${logo.id}`, { method: 'DELETE' });
                }
            }
        }

        // 새 로고 저장
        const response = await fetch(`${API_BASE}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'logo',
                filename: filename,
                data: dataUrl,
                page: '',
                order_index: 0
            })
        });

        return await response.json();
    } catch (error) {
        console.error('❌ 로고 저장 실패:', error);
        throw error;
    }
}

/**
 * 로고 가져오기
 */
async function getLogo() {
    try {
        const response = await fetch(`${API_BASE}/images?search=logo&limit=1`);
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            const logo = result.data.find(item => item.type === 'logo');
            return logo ? { filename: logo.filename, data: logo.data } : null;
        }
        return null;
    } catch (error) {
        console.error('❌ 로고 로딩 실패:', error);
        return null;
    }
}

/**
 * 히어로 슬라이더 이미지 저장
 */
async function saveHeroImagesToDB(images) {
    try {
        // 기존 히어로 이미지 모두 삭제
        const existing = await fetch(`${API_BASE}/images?search=heroSlider&limit=100`);
        const result = await existing.json();
        
        if (result.data && result.data.length > 0) {
            for (const img of result.data) {
                if (img.type === 'heroSlider') {
                    await fetch(`${API_BASE}/images/${img.id}`, { method: 'DELETE' });
                }
            }
        }

        // 새 이미지 저장
        const promises = images.map((img, index) => 
            fetch(`${API_BASE}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'heroSlider',
                    filename: img.filename,
                    data: img.data,
                    page: '',
                    order_index: index
                })
            })
        );

        await Promise.all(promises);
        return true;
    } catch (error) {
        console.error('❌ 히어로 이미지 저장 실패:', error);
        throw error;
    }
}

/**
 * 히어로 슬라이더 이미지 가져오기
 */
async function getHeroImages() {
    try {
        const response = await fetch(`${API_BASE}/images?search=heroSlider&limit=100`);
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            const heroImages = result.data
                .filter(item => item.type === 'heroSlider')
                .sort((a, b) => a.order_index - b.order_index);
            
            return heroImages.map(img => ({
                filename: img.filename,
                data: img.data
            }));
        }
        return [];
    } catch (error) {
        console.error('❌ 히어로 이미지 로딩 실패:', error);
        return [];
    }
}

/**
 * 페이지별 히어로 이미지 저장
 */
async function savePageHeroToDB(page, filename, dataUrl) {
    try {
        // 기존 페이지 히어로 삭제
        const existing = await fetch(`${API_BASE}/images?search=pageHero&limit=100`);
        const result = await existing.json();
        
        if (result.data && result.data.length > 0) {
            for (const img of result.data) {
                if (img.type === 'pageHero' && img.page === page) {
                    await fetch(`${API_BASE}/images/${img.id}`, { method: 'DELETE' });
                }
            }
        }

        // 새 히어로 이미지 저장
        const response = await fetch(`${API_BASE}/images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'pageHero',
                filename: filename,
                data: dataUrl,
                page: page,
                order_index: 0
            })
        });

        return await response.json();
    } catch (error) {
        console.error(`❌ ${page} 페이지 히어로 저장 실패:`, error);
        throw error;
    }
}

/**
 * 페이지별 히어로 이미지 가져오기
 */
async function getPageHero(page) {
    try {
        const response = await fetch(`${API_BASE}/images?search=pageHero&limit=100`);
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            const hero = result.data.find(item => item.type === 'pageHero' && item.page === page);
            return hero ? { filename: hero.filename, data: hero.data } : null;
        }
        return null;
    } catch (error) {
        console.error(`❌ ${page} 페이지 히어로 로딩 실패:`, error);
        return null;
    }
}

// ============================================
// 설정 관리 API
// ============================================

/**
 * 설정 저장
 */
async function saveSetting(key, value) {
    try {
        // 기존 설정 확인
        const existing = await fetch(`${API_BASE}/settings?search=${key}&limit=1`);
        const result = await existing.json();
        
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
        
        if (result.data && result.data.length > 0) {
            const setting = result.data.find(item => item.key === key);
            if (setting) {
                // 업데이트
                await fetch(`${API_BASE}/settings/${setting.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        key: key,
                        value: valueStr
                    })
                });
                return;
            }
        }

        // 새로 생성
        await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                key: key,
                value: valueStr
            })
        });
    } catch (error) {
        console.error(`❌ 설정 저장 실패 (${key}):`, error);
        throw error;
    }
}

/**
 * 설정 가져오기
 */
async function getSetting(key, defaultValue = null) {
    try {
        const response = await fetch(`${API_BASE}/settings?search=${key}&limit=1`);
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            const setting = result.data.find(item => item.key === key);
            if (setting) {
                try {
                    return JSON.parse(setting.value);
                } catch {
                    return setting.value;
                }
            }
        }
        return defaultValue;
    } catch (error) {
        console.error(`❌ 설정 로딩 실패 (${key}):`, error);
        return defaultValue;
    }
}

// ============================================
// 이미지 압축 유틸리티
// ============================================

/**
 * 이미지 압축
 */
async function compressImage(file, maxWidth = 1920, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // 비율 유지하며 리사이즈
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Base64로 변환
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };

            img.onerror = reject;
            img.src = e.target.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

console.log('✅ RESTful Table API 데이터베이스 초기화 완료');
