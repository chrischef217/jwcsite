// ============================================
// IndexedDB 기반 데이터 관리
// VERSION: 3.2.20240308
// LAST UPDATE: 2024-03-08 - IndexedDB로 전환
// ============================================

const DB_NAME = 'JWC_DB';
const DB_VERSION = 1;
let db = null;

// IndexedDB 초기화
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            console.log('✅ IndexedDB 초기화 완료');
            resolve(db);
        };
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            // images 스토어
            if (!db.objectStoreNames.contains('images')) {
                const imagesStore = db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
                imagesStore.createIndex('type', 'type', { unique: false });
                imagesStore.createIndex('page', 'page', { unique: false });
                console.log('✅ images 스토어 생성 완료');
            }
            
            // settings 스토어
            if (!db.objectStoreNames.contains('settings')) {
                db.createObjectStore('settings', { keyPath: 'key' });
                console.log('✅ settings 스토어 생성 완료');
            }
        };
    });
}

// DB 연결 보장
async function ensureDB() {
    if (!db) {
        await initDB();
    }
    return db;
}

// ============================================
// 이미지 관리 API
// ============================================

/**
 * 로고 저장
 */
async function saveLogoToDB(filename, dataUrl) {
    try {
        const db = await ensureDB();
        const tx = db.transaction(['images'], 'readwrite');
        const store = tx.objectStore('images');
        const index = store.index('type');
        
        // 기존 로고 삭제
        const existing = await new Promise((resolve) => {
            const request = index.getAll('logo');
            request.onsuccess = () => resolve(request.result);
        });
        
        for (const logo of existing) {
            await new Promise((resolve, reject) => {
                const request = store.delete(logo.id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
        
        // 새 로고 저장
        await new Promise((resolve, reject) => {
            const request = store.add({
                type: 'logo',
                filename: filename,
                data: dataUrl,
                page: '',
                order_index: 0
            });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        
        console.log('✅ 로고 저장 완료');
        return true;
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
        const db = await ensureDB();
        const tx = db.transaction(['images'], 'readonly');
        const store = tx.objectStore('images');
        const index = store.index('type');
        
        const logos = await new Promise((resolve) => {
            const request = index.getAll('logo');
            request.onsuccess = () => resolve(request.result);
        });
        
        if (logos && logos.length > 0) {
            const logo = logos[0];
            console.log('✅ 로고 데이터 발견:', logo.filename);
            return { filename: logo.filename, data: logo.data };
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
        const db = await ensureDB();
        const tx = db.transaction(['images'], 'readwrite');
        const store = tx.objectStore('images');
        const index = store.index('type');
        
        // 기존 히어로 이미지 모두 삭제
        const existing = await new Promise((resolve) => {
            const request = index.getAll('heroSlider');
            request.onsuccess = () => resolve(request.result);
        });
        
        for (const img of existing) {
            await new Promise((resolve, reject) => {
                const request = store.delete(img.id);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
        
        // 새 이미지 저장
        for (let i = 0; i < images.length; i++) {
            await new Promise((resolve, reject) => {
                const request = store.add({
                    type: 'heroSlider',
                    filename: images[i].filename,
                    data: images[i].data,
                    page: '',
                    order_index: i
                });
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }
        
        console.log(`✅ 히어로 이미지 ${images.length}개 저장 완료`);
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
        const db = await ensureDB();
        const tx = db.transaction(['images'], 'readonly');
        const store = tx.objectStore('images');
        const index = store.index('type');
        
        const images = await new Promise((resolve) => {
            const request = index.getAll('heroSlider');
            request.onsuccess = () => resolve(request.result);
        });
        
        if (images && images.length > 0) {
            images.sort((a, b) => a.order_index - b.order_index);
            console.log(`✅ 히어로 이미지 ${images.length}개 로드됨`);
            return images.map(img => ({
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
        const db = await ensureDB();
        const tx = db.transaction(['images'], 'readwrite');
        const store = tx.objectStore('images');
        const index = store.index('type');
        
        // 기존 페이지 히어로 삭제
        const existing = await new Promise((resolve) => {
            const request = index.getAll('pageHero');
            request.onsuccess = () => resolve(request.result);
        });
        
        for (const img of existing) {
            if (img.page === page) {
                await new Promise((resolve, reject) => {
                    const request = store.delete(img.id);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                });
            }
        }
        
        // 새 히어로 이미지 저장
        await new Promise((resolve, reject) => {
            const request = store.add({
                type: 'pageHero',
                filename: filename,
                data: dataUrl,
                page: page,
                order_index: 0
            });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        
        console.log(`✅ ${page} 페이지 히어로 저장 완료`);
        return true;
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
        const db = await ensureDB();
        const tx = db.transaction(['images'], 'readonly');
        const store = tx.objectStore('images');
        const index = store.index('type');
        
        const images = await new Promise((resolve) => {
            const request = index.getAll('pageHero');
            request.onsuccess = () => resolve(request.result);
        });
        
        const hero = images.find(img => img.page === page);
        if (hero) {
            console.log(`✅ ${page} 페이지 히어로 이미지 발견:`, hero.filename);
            return { filename: hero.filename, data: hero.data };
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
        const db = await ensureDB();
        const tx = db.transaction(['settings'], 'readwrite');
        const store = tx.objectStore('settings');
        
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
        
        await new Promise((resolve, reject) => {
            const request = store.put({ key: key, value: valueStr });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        
        console.log(`✅ 설정 저장 완료: ${key}`);
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
        const db = await ensureDB();
        const tx = db.transaction(['settings'], 'readonly');
        const store = tx.objectStore('settings');
        
        const setting = await new Promise((resolve) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
        });
        
        if (setting) {
            try {
                return JSON.parse(setting.value);
            } catch {
                return setting.value;
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

// 페이지 로드 시 DB 초기화
initDB().then(() => {
    console.log('✅ IndexedDB 데이터베이스 초기화 완료');
}).catch(error => {
    console.error('❌ IndexedDB 초기화 실패:', error);
});
