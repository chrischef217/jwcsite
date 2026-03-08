// HTML 레이아웃 및 컴포넌트

export function layout(content: string, title: string = 'JWC', activePage: string = '') {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/css/common.css">
    <style>
        /* 히어로 슬라이더 스타일 */
        .hero {
            position: relative;
            width: 100%;
            height: 600px;
            overflow: hidden;
            background: #000;
        }
        
        .hero-slider {
            position: relative;
            width: 100%;
            height: 100%;
        }
        
        .hero-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 1s ease-in-out;
        }
        
        .hero-slide.active {
            opacity: 1;
        }
        
        .hero-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .hero-text-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: white;
            z-index: 10;
            width: 90%;
            max-width: 800px;
        }
        
        .hero-text-overlay h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
        
        .hero-text-overlay p {
            font-size: 1.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
        
        .slider-nav {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 20;
        }
        
        .slider-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .slider-dot.active {
            background: white;
        }
        
        /* 페이지 히어로 스타일 */
        .page-hero {
            width: 100%;
            height: 400px;
            background-size: cover;
            background-position: center;
            background-color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .page-hero h1 {
            color: white;
            font-size: 3rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
        }
    </style>
</head>
<body>
    ${header(activePage)}
    ${content}
    ${footer()}
    <script>
        // 히어로 슬라이더 자동 재생
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.slider-dot');
        
        if (slides.length > 0) {
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.classList.toggle('active', i === index);
                });
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }
            
            // 초기 슬라이드 표시
            showSlide(0);
            
            // 자동 재생 (5초마다)
            setInterval(nextSlide, 5000);
            
            // 점 클릭 이벤트
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
            });
        }
        
        // 모바일 메뉴
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }
    </script>
</body>
</html>`;
}

function header(activePage: string) {
  const pages = ['Home', 'About', 'Products', 'Contact'];
  const links = {
    'Home': '/',
    'About': '/about',
    'Products': '/products',
    'Contact': '/contact'
  };
  
  return `
    <header>
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="/">
                        <img src="/jwc-logo.png" alt="JWC">
                    </a>
                </div>
                <nav class="nav-menu" id="navMenu">
                    ${pages.map(page => 
                      `<a href="${links[page]}" class="nav-link ${activePage === page ? 'active' : ''}">${page}</a>`
                    ).join('\n                    ')}
                </nav>
                <div class="header-actions">
                    <button class="mobile-menu-btn" id="mobileMenuBtn">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>
        </div>
    </header>`;
}

function footer() {
  return `
    <footer>
        <div class="container">
            <p>&copy; 2024 JWC. All rights reserved.</p>
            <a href="/admin-login.html" style="opacity: 0.3; font-size: 12px; color: #999;">
                <i class="fas fa-cog"></i>
            </a>
        </div>
    </footer>`;
}

export function heroSlider(images: any[], heroText: any) {
  if (!images || images.length === 0) {
    return `
    <section class="hero">
        <div class="hero-slider">
            <div class="hero-slide active">
                <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
            </div>
        </div>
        ${heroText ? `
        <div class="hero-text-overlay">
            <h1>${heroText.title || 'Welcome to JWC'}</h1>
            <p>${heroText.subtitle || 'Premium Cosmetics'}</p>
        </div>
        ` : ''}
    </section>`;
  }
  
  return `
    <section class="hero">
        <div class="hero-slider">
            ${images.map((img, index) => `
            <div class="hero-slide ${index === 0 ? 'active' : ''}">
                <img src="${img.data}" alt="Hero ${index + 1}">
            </div>
            `).join('')}
        </div>
        ${heroText ? `
        <div class="hero-text-overlay">
            <h1>${heroText.title || 'Welcome to JWC'}</h1>
            <p>${heroText.subtitle || 'Premium Cosmetics'}</p>
        </div>
        ` : ''}
        ${images.length > 1 ? `
        <div class="slider-nav">
            ${images.map((_, index) => `
            <div class="slider-dot ${index === 0 ? 'active' : ''}"></div>
            `).join('')}
        </div>
        ` : ''}
    </section>`;
}

export function pageHero(title: string, backgroundImage?: string) {
  const bgStyle = backgroundImage 
    ? `background-image: url('${backgroundImage}');`
    : 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';
    
  return `
    <section class="page-hero" style="${bgStyle}">
        <h1>${title}</h1>
    </section>`;
}
