// Use localStorage for simple storage
const STORAGE_KEY = 'jwc_hero_slider';

// Save hero slider media
async function saveHeroMediaToDB(mediaFiles) {
    try {
        console.log('💾 저장 시작:', mediaFiles.length, '개 파일');
        
        const savedMedia = [];
        
        for (let i = 0; i < mediaFiles.length; i++) {
            const mediaFile = mediaFiles[i];
            console.log(`📤 처리 중 ${i + 1}/${mediaFiles.length}: ${mediaFile.name}`);
            
            let mediaData;
            let mediaType;
            
            if (mediaFile.type.startsWith('image/')) {
                mediaData = await compressImage(mediaFile);
                mediaType = 'image';
            } else if (mediaFile.type.startsWith('video/')) {
                mediaData = await videoToBase64(mediaFile);
                mediaType = 'video';
            }
            
            savedMedia.push({
                id: Date.now() + '_' + i,
                type: 'heroSlider',
                filename: mediaFile.name,
                data: mediaData,
                mediaType: mediaType,
                order_index: i,
                created_at: new Date().toISOString()
            });
        }
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMedia));
        console.log('✅ 모든 파일 저장 완료');
        return true;
    } catch (error) {
        console.error('❌ 히어로 슬라이더 저장 실패:', error);
        throw error;
    }
}

// Get hero slider media
async function getHeroSliderMedia() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('❌ 히어로 슬라이더 불러오기 실패:', error);
        return [];
    }
}

// Delete hero media by id
async function deleteHeroMediaById(id) {
    try {
        const media = await getHeroSliderMedia();
        const filtered = media.filter(item => item.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
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
