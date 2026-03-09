// API Configuration
const API_BASE = 'https://www.genspark.ai/api/tables';

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

// Save hero slider media (images + videos)
async function saveHeroMediaToDB(mediaFiles) {
    try {
        console.log('💾 저장 시작:', mediaFiles.length, '개 파일');
        
        // Delete existing hero slider items
        const existingResponse = await fetch(`${API_BASE}/images?search=heroSlider&limit=100`);
        const existingData = await existingResponse.json();
        
        console.log('📋 기존 데이터:', existingData);
        
        if (existingData.success && existingData.data && existingData.data.length > 0) {
            const deletePromises = existingData.data
                .filter(item => item.type === 'heroSlider')
                .map(item => 
                    fetch(`${API_BASE}/images/${item.id}`, { method: 'DELETE' })
                );
            await Promise.all(deletePromises);
            console.log('🗑️ 기존 데이터 삭제 완료');
        }
        
        // Upload new media files
        const uploadPromises = mediaFiles.map(async (mediaFile, index) => {
            console.log(`📤 업로드 중 ${index + 1}/${mediaFiles.length}: ${mediaFile.name}`);
            
            let mediaData;
            let mediaType;
            let filename = mediaFile.name;
            
            if (mediaFile.type.startsWith('image/')) {
                mediaData = await compressImage(mediaFile);
                mediaType = 'image';
            } else if (mediaFile.type.startsWith('video/')) {
                mediaData = await videoToBase64(mediaFile);
                mediaType = 'video';
            }
            
            const response = await fetch(`${API_BASE}/images`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'heroSlider',
                    filename: filename,
                    data: mediaData,
                    mediaType: mediaType,
                    page: '',
                    order_index: index
                })
            });
            
            const result = await response.json();
            console.log(`✅ 업로드 완료 ${index + 1}:`, result);
            return result;
        });
        
        await Promise.all(uploadPromises);
        console.log('✅ 모든 파일 업로드 완료');
        return true;
    } catch (error) {
        console.error('❌ 히어로 슬라이더 저장 실패:', error);
        throw error;
    }
}

// Get hero slider media
async function getHeroSliderMedia() {
    try {
        const response = await fetch(`${API_BASE}/images?search=heroSlider&limit=100`);
        const data = await response.json();
        
        console.log('📥 히어로 슬라이더 데이터:', data);
        
        if (data.success && data.data) {
            return data.data
                .filter(item => item.type === 'heroSlider')
                .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        }
        return [];
    } catch (error) {
        console.error('❌ 히어로 슬라이더 불러오기 실패:', error);
        return [];
    }
}

// Expose functions globally
window.saveHeroMediaToDB = saveHeroMediaToDB;
window.getHeroSliderMedia = getHeroSliderMedia;
