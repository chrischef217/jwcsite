// About 페이지 - 히어로 이미지 로딩

async function loadAboutHero() {
    console.log('🔍 About 페이지 히어로 이미지 로딩...');
    
    try {
        const heroData = await getPageHero('about');
        const enabled = await getSetting('aboutHeroEnabled', false);
        const heroSection = document.getElementById('pageHero');
        
        if (heroData && enabled && heroData.data) {
            console.log('✅ About 히어로 이미지 발견:', heroData.filename);
            heroSection.style.backgroundImage = `url(${heroData.data})`;
            heroSection.style.display = 'flex';
        } else {
            console.log('ℹ️ About 히어로 이미지 비활성화 또는 없음');
            heroSection.style.display = 'none';
        }
    } catch (error) {
        console.error('❌ About 히어로 이미지 로딩 실패:', error);
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 About 페이지 로드 완료');
    loadAboutHero();
});
