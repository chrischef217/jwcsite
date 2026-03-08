// 공통 기능 (모든 페이지에서 사용)

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
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 공통 스크립트 로드 완료');
    console.log('🌐 현재 URL:', window.location.href);
    
    // 모바일 메뉴 초기화
    initMobileMenu();
});
