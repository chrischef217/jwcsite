// Products Page - Category Filter and Dynamic Loading
let allProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    // Load categories first, then products
    loadCategories();
    loadProducts();
});

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        const container = document.getElementById('categoryFilterContainer');
        
        // Keep "All Products" button (Korean)
        container.innerHTML = '<button class="filter-btn active" data-category="all">전체 제품</button>';
        
        // Add category buttons with Korean names
        data.products.forEach(cat => {
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

    // Category filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected category
            const category = this.getAttribute('data-category');
            
            // Filter and render products
            filterProducts(category);
        });
    });

    // Smooth scroll to top when filter changes
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productsSection = document.querySelector('.products-section');
            const offset = 150; // Offset for sticky header
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        
        allProducts = await response.json();
        console.log('✅ Loaded products:', allProducts.length);
        
        renderProducts(allProducts);
        
    } catch (error) {
        console.error('❌ Failed to load products:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #dc3545;">제품 목록을 불러오지 못했습니다.</p>';
    }
}

// Filter products by category
function filterProducts(category) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.classList.add('loading');
    
    setTimeout(() => {
        if (category === 'all') {
            renderProducts(allProducts);
        } else {
            const filtered = allProducts.filter(p => p.category === category);
            renderProducts(filtered);
        }
        productsGrid.classList.remove('loading');
    }, 200);
}

// Render products to grid
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;">등록된 제품이 없습니다.</p>';
        return;
    }
    
    let html = '';
    
    products.forEach(product => {
        html += `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.imageData || product.image}" alt="${product.name} ${product.model}">
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-model">${product.model}</p>
                    ${product.size ? `<p class="product-size">${product.size}</p>` : ''}
                    <p class="product-volume">${product.volume}</p>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    
    // Reapply intersection observer for fade-in animation
    observeProductCards();
}

// Intersection Observer for fade-in animation
function observeProductCards() {
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

    // Observe all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}
