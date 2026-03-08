// 히어로 슬라이더 및 텍스트 오버레이

let currentSlide = 0;
let slideInterval = null;
let heroImages = [];

// 히어로 슬라이더 초기화
async function initHeroSlider() {
    console.log('🎬 히어로 슬라이더 초기화...');
    
    try {
        // 히어로 이미지 로드
        heroImages = await getHeroImages();
        
        console.log(`📦 히어로 이미지 ${heroImages.length}개 로드됨`);
        
        if (heroImages.length > 0) {
            renderSlides();
            startAutoSlide();
        } else {
            console.log('ℹ️ 히어로 이미지 없음');
        }
        
        // 네비게이션 버튼
        setupNavigation();
        
    } catch (error) {
        console.error('❌ 히어로 슬라이더 초기화 실패:', error);
    }
}

// 슬라이드 렌더링
function renderSlides() {
    const slider = document.getElementById('heroSlider');
    const dots = document.getElementById('heroDots');
    
    slider.innerHTML = '';
    dots.innerHTML = '';
    
    heroImages.forEach((image, index) => {
        // 슬라이드 생성
        const slide = document.createElement('div');
        slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `url(${image.data})`;
        slider.appendChild(slide);
        
        // 점 네비게이션 생성
        const dot = document.createElement('div');
        dot.className = `hero-dot ${index === 0 ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dots.appendChild(dot);
    });
}

// 다음 슬라이드
function nextSlide() {
    currentSlide = (currentSlide + 1) % heroImages.length;
    updateSlide();
}

// 이전 슬라이드
function prevSlide() {
    currentSlide = (currentSlide - 1 + heroImages.length) % heroImages.length;
    updateSlide();
}

// 특정 슬라이드로 이동
function goToSlide(index) {
    currentSlide = index;
    updateSlide();
}

// 슬라이드 업데이트
function updateSlide() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// 자동 슬라이드
async function startAutoSlide() {
    const interval = await getSetting('slideInterval', 5);
    console.log(`⏱️ 자동 슬라이드 시작 (${interval}초 간격)`);
    
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, interval * 1000);
}

// 네비게이션 설정
function setupNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.onclick = prevSlide;
    if (nextBtn) nextBtn.onclick = nextSlide;
    
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 홈 페이지 로드 완료');
    initHeroSlider();
});
