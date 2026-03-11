// Use Cloudflare KV via Pages Function
const API_ENDPOINT = '/api/hero';

// Helper: Compress image
async function compressImage(file, maxWidth = 1920, quality = 0.9) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Helper: Convert video to base64
async function videoToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

// Save hero slider media with text
async function saveHeroMediaToDB(mediaWithText) {
    try {
        console.log('💾 저장 시작:', mediaWithText.length, '개 파일');
        
        // Delete all existing
        const existing = await getHeroSliderMedia();
        for (const item of existing) {
            await fetch(`${API_ENDPOINT}?id=${item.id}`, { method: 'DELETE' });
        }
        
        // Upload new
        for (let i = 0; i < mediaWithText.length; i++) {
            const item = mediaWithText[i];
            const mediaFile = item.file;
            const text = item.text || '';
            
            console.log(`📤 업로드 중 ${i + 1}/${mediaWithText.length}: ${mediaFile.name}`);
            
            let mediaData;
            let mediaType;
            
            if (mediaFile.type.startsWith('image/')) {
                mediaData = await compressImage(mediaFile);
                mediaType = 'image';
            } else if (mediaFile.type.startsWith('video/')) {
                mediaData = await videoToBase64(mediaFile);
                mediaType = 'video';
            }
            
            await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: mediaFile.name,
                    data: mediaData,
                    mediaType: mediaType,
                    text: text,
                    order_index: i
                })
            });
        }
        
        console.log('✅ 모든 파일 업로드 완료');
        return true;
    } catch (error) {
        console.error('❌ 저장 실패:', error);
        throw error;
    }
}

// Get hero slider media
async function getHeroSliderMedia() {
    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        return data.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    } catch (error) {
        console.error('❌ 불러오기 실패:', error);
        return [];
    }
}

// Delete hero media by id
async function deleteHeroMediaById(id) {
    try {
        await fetch(`${API_ENDPOINT}?id=${id}`, { method: 'DELETE' });
        return true;
    } catch (error) {
        console.error('❌ 삭제 실패:', error);
        throw error;
    }
}

// Expose functions globally
window.saveHeroMediaToDB = saveHeroMediaToDB;
window.getHeroSliderMedia = getHeroSliderMedia;
window.deleteHeroMediaById = deleteHeroMediaById;
