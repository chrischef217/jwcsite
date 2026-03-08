// Contact 페이지 - 히어로 이미지 로딩

async function loadContactHero() {
    console.log('🔍 Contact 페이지 히어로 이미지 로딩...');
    
    try {
        const heroData = await getPageHero('contact');
        const enabled = await getSetting('contactHeroEnabled', false);
        const heroSection = document.getElementById('pageHero');
        
        if (heroData && enabled && heroData.data) {
            console.log('✅ Contact 히어로 이미지 발견:', heroData.filename);
            heroSection.style.backgroundImage = `url(${heroData.data})`;
            heroSection.style.display = 'flex';
        } else {
            console.log('ℹ️ Contact 히어로 이미지 비활성화 또는 없음');
            heroSection.style.display = 'none';
        }
    } catch (error) {
        console.error('❌ Contact 히어로 이미지 로딩 실패:', error);
    }
}

// 문의 폼 처리
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.');
    this.reset();
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Contact 페이지 로드 완료');
    loadContactHero();
});
