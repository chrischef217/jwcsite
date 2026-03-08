// 공통 기능 (모든 페이지에서 사용)

// 로고 로딩
async function loadLogo() {
    console.log('🔍 로고 로딩 시작...');
    
    try {
        const logoData = await getLogo();
        const logoImage = document.getElementById('logoImage');
        const logoText = document.getElementById('logoText');
        
        if (logoData && logoData.data) {
            console.log('✅ 로고 데이터 발견:', logoData.filename);
            logoImage.src = logoData.data;
            logoImage.style.display = 'block';
            if (logoText) logoText.style.display = 'none';
        } else {
            console.log('ℹ️ 저장된 로고 없음 - 기본 텍스트 표시');
            logoImage.style.display = 'none';
            if (logoText) logoText.style.display = 'inline-block';
        }
    } catch (error) {
        console.error('❌ 로고 로딩 실패:', error);
        const logoText = document.getElementById('logoText');
        if (logoText) logoText.style.display = 'inline-block';
    }
}

// 모바일 메뉴 토글
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 공통 스크립트 로드 완료');
    
    // 로고 로딩
    await loadLogo();
    
    // 모바일 메뉴 초기화
    initMobileMenu();
});
