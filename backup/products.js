// Products 페이지 - 히어로 이미지 로딩

async function loadProductsHero() {
    console.log('🔍 Products 페이지 히어로 이미지 로딩...');
    
    try {
        const heroData = await getPageHero('products');
        const enabled = await getSetting('productsHeroEnabled', false);
        const heroSection = document.getElementById('pageHero');
        
        if (heroData && enabled && heroData.data) {
            console.log('✅ Products 히어로 이미지 발견:', heroData.filename);
            heroSection.style.backgroundImage = `url(${heroData.data})`;
            heroSection.style.display = 'flex';
        } else {
            console.log('ℹ️ Products 히어로 이미지 비활성화 또는 없음');
            heroSection.style.display = 'none';
        }
    } catch (error) {
        console.error('❌ Products 히어로 이미지 로딩 실패:', error);
    }
}

// 제품 필터링
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.dataset.filter;
        console.log('🔍 필터:', filter);
        // 제품 필터링 로직 추가 가능
    });
});

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Products 페이지 로드 완료');
    loadProductsHero();
});
