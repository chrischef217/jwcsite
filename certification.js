// Certification Page - Category Filter and Dynamic Loading
let allCertifications = [];

document.addEventListener('DOMContentLoaded', function() {
    // Load categories first, then certifications
    loadCertCategories();
    loadCertifications();
});

// Load certification categories from API
async function loadCertCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        const container = document.querySelector('.category-filter .container');
        
        // Keep "All Certifications" button (Korean)
        container.innerHTML = '<button class="filter-btn active" data-category="all">전체 인증서</button>';
        
        // Add category buttons with Korean names
        data.certifications.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-category', cat.id);
            btn.textContent = cat.nameKo || cat.name; // Use Korean name (nameKo)
            container.appendChild(btn);
        });
        
        // Setup event listeners after buttons are created
        setupCategoryFilters();
        
    } catch (error) {
        console.error('❌ Failed to load categories:', error);
        // Use default buttons if API fails
        setupCategoryFilters();
    }
}

// Setup category filter event listeners
function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const certificationsGrid = document.getElementById('certificationsGrid');

    // Category filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Filter and render certifications
            filterCertifications(category);
        });
    });

    // Smooth scroll to top when filter changes
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const certificationsSection = document.querySelector('.products-section');
            const offset = 150; // Offset for sticky header
            const elementPosition = certificationsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Load certifications from API
async function loadCertifications() {
    try {
        const response = await fetch('/api/certification');
        if (!response.ok) throw new Error('Failed to fetch certifications');
        
        allCertifications = await response.json();
        console.log('✅ Loaded certifications:', allCertifications.length);
        
        renderCertifications(allCertifications);
        
    } catch (error) {
        console.error('❌ Failed to load certifications:', error);
        document.getElementById('certificationsGrid').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #dc3545;">인증서 목록을 불러오지 못했습니다.</p>';
    }
}

// Filter certifications by category
function filterCertifications(category) {
    const certificationsGrid = document.getElementById('certificationsGrid');
    certificationsGrid.classList.add('loading');
    
    setTimeout(() => {
        if (category === 'all') {
            renderCertifications(allCertifications);
        } else {
            const filtered = allCertifications.filter(c => c.category === category);
            renderCertifications(filtered);
        }
        certificationsGrid.classList.remove('loading');
    }, 200);
}

// Render certifications to grid
function renderCertifications(certifications) {
    const grid = document.getElementById('certificationsGrid');
    
    if (!certifications || certifications.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;">등록된 인증서가 없습니다.</p>';
        return;
    }
    
    let html = '';
    
    certifications.forEach(cert => {
        html += `
            <div class="product-card" data-category="${cert.category}">
                <div class="product-image">
                    <img src="${cert.imageData || cert.image}" alt="${cert.name}">
                </div>
                <div class="product-info">
                    <h3>${cert.name}</h3>
                    ${cert.issuer ? `<p class="product-model">${cert.issuer}</p>` : ''}
                    ${cert.issueDate ? `<p class="product-size">발급일: ${cert.issueDate}</p>` : ''}
                    ${cert.validUntil && cert.validUntil.trim() ? `<p class="product-volume">유효기간: ${cert.validUntil}</p>` : ''}
                    ${cert.certNumber && cert.certNumber.trim() ? `<p class="product-volume">발급번호: ${cert.certNumber}</p>` : ''}
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    
    // Reapply intersection observer for fade-in animation
    observeCertificationCards();
}

// Intersection Observer for fade-in animation
function observeCertificationCards() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all certification cards
    const certificationCards = document.querySelectorAll('.product-card');
    certificationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}
