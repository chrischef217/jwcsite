// Products Page - Advanced Search and Modal
let allProducts = [];
let allMaterials = [];
let currentProduct = null;
let currentFilters = {
    category: 'all',
    capacityMin: 0,
    capacityMax: 1200,
    searchText: '',
    materials: []
};

document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadMaterials();
    loadProducts();
    setupSliders();
});

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        
        const data = await response.json();
        const container = document.getElementById('categoryFilterContainer');
        
        container.innerHTML = '<button class="filter-btn active" data-category="all">전체 제품</button>';
        
        data.products.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-category', cat.id);
            btn.textContent = cat.nameKo || cat.name;
            container.appendChild(btn);
        });
        
        setupCategoryFilters();
        
    } catch (error) {
        console.error('❌ Failed to load categories:', error);
        setupCategoryFilters();
    }
}

// Load materials from API
async function loadMaterials() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch materials');
        
        const data = await response.json();
        allMaterials = data.materials || [];
        
        const container = document.getElementById('materialCheckboxes');
        container.innerHTML = '';
        
        allMaterials.forEach(mat => {
            const div = document.createElement('div');
            div.className = 'material-checkbox-item';
            div.innerHTML = `
                <input type="checkbox" id="mat_${mat.id}" value="${mat.id}">
                <label for="mat_${mat.id}">${mat.nameKo || mat.name}</label>
            `;
            container.appendChild(div);
        });
        
    } catch (error) {
        console.error('❌ Failed to load materials:', error);
    }
}

// Setup capacity sliders
function setupSliders() {
    const minSlider = document.getElementById('capacityMin');
    const maxSlider = document.getElementById('capacityMax');
    const minValue = document.getElementById('capacityMinValue');
    const maxValue = document.getElementById('capacityMaxValue');
    const rangeDisplay = document.getElementById('capacityRange');
    
    function updateSliders() {
        let min = parseInt(minSlider.value);
        let max = parseInt(maxSlider.value);
        
        if (min > max - 50) {
            min = max - 50;
            minSlider.value = min;
        }
        
        minValue.textContent = min;
        maxValue.textContent = max;
        
        currentFilters.capacityMin = min;
        currentFilters.capacityMax = max;
        
        // Update visual range
        const percent1 = (min / 1200) * 100;
        const percent2 = (max / 1200) * 100;
        rangeDisplay.style.left = percent1 + '%';
        rangeDisplay.style.width = (percent2 - percent1) + '%';
    }
    
    minSlider.addEventListener('input', updateSliders);
    maxSlider.addEventListener('input', updateSliders);
    updateSliders();
}

// Setup category filter event listeners
function setupCategoryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilters.category = this.getAttribute('data-category');
            applyFilters();
            
            const productsSection = document.querySelector('.products-section');
            const offset = 150;
            const elementPosition = productsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// Apply filters button
function applyFilters() {
    // Get text search
    currentFilters.searchText = document.getElementById('searchText').value.toLowerCase();
    
    // Get selected materials
    const checkedMaterials = document.querySelectorAll('#materialCheckboxes input:checked');
    currentFilters.materials = Array.from(checkedMaterials).map(cb => cb.value);
    
    // Filter products
    let filtered = allProducts;
    
    // Category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(p => p.category === currentFilters.category);
    }
    
    // Capacity filter
    filtered = filtered.filter(p => {
        const volume = parseFloat(p.volume) || 0;
        return volume >= currentFilters.capacityMin && volume <= currentFilters.capacityMax;
    });
    
    // Text search filter
    if (currentFilters.searchText) {
        filtered = filtered.filter(p => {
            const searchableText = `${p.name} ${p.model} ${p.size || ''}`.toLowerCase();
            return searchableText.includes(currentFilters.searchText);
        });
    }
    
    // Material filter
    if (currentFilters.materials.length > 0) {
        filtered = filtered.filter(p => {
            return currentFilters.materials.includes(p.material);
        });
    }
    
    renderProducts(filtered);
}

// Reset filters
function resetFilters() {
    // Reset sliders
    document.getElementById('capacityMin').value = 0;
    document.getElementById('capacityMax').value = 1200;
    document.getElementById('capacityMinValue').textContent = 0;
    document.getElementById('capacityMaxValue').textContent = 1200;
    
    // Reset range display
    const rangeDisplay = document.getElementById('capacityRange');
    rangeDisplay.style.left = '0%';
    rangeDisplay.style.width = '100%';
    
    // Reset text search
    document.getElementById('searchText').value = '';
    
    // Uncheck all materials
    document.querySelectorAll('#materialCheckboxes input').forEach(cb => cb.checked = false);
    
    // Reset category to "all"
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.getAttribute('data-category') === 'all') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    currentFilters = {
        category: 'all',
        capacityMin: 0,
        capacityMax: 1200,
        searchText: '',
        materials: []
    };
    
    renderProducts(allProducts);
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

// Render products to grid
function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #999;">검색 결과가 없습니다.</p>';
        return;
    }
    
    let html = '';
    
    products.forEach(product => {
        // Get all component materials
        const materials = product.components?.map(c => c.material).filter(Boolean).join(', ') || '-';
        
        html += `
            <div class="product-card" data-category="${product.category}" onclick='openProductModal(${JSON.stringify(product).replace(/'/g, "&apos;")})'>
                <div class="product-image">
                    <img src="${product.imageData || product.image}" alt="${product.code}">
                </div>
                <div class="product-info">
                    <h3>${product.code}</h3>
                    <p class="product-volume">${product.volume || '-'}</p>
                    ${product.diameter ? `<p class="product-size">Ø ${product.diameter}mm</p>` : ''}
                    <p class="product-material">${materials}</p>
                </div>
            </div>
        `;
    });
    
    grid.innerHTML = html;
    observeProductCards();
}

// Open product detail modal
function openProductModal(product) {
    const modal = document.getElementById('productModal');
    currentProduct = product;
    
    console.log('Opening product modal:', product);
    
    // Setup image gallery
    const mainImage = document.getElementById('modalMainImage');
    const thumbnailsContainer = document.getElementById('modalImageThumbnails');
    
    const images = [];
    
    // Add main image
    if (product.imageData || product.image) {
        images.push({
            src: product.imageData || product.image,
            label: '제품 사진'
        });
    }
    
    // Add cross section image
    if (product.crossSectionImageData) {
        images.push({
            src: product.crossSectionImageData,
            label: '단면 사진'
        });
    }
    
    // Set main image
    if (images.length > 0) {
        mainImage.src = images[0].src;
        mainImage.alt = images[0].label;
    }
    
    // Build thumbnails
    thumbnailsContainer.innerHTML = '';
    images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'modal-thumbnail' + (index === 0 ? ' active' : '');
        thumbnail.innerHTML = `<img src="${img.src}" alt="${img.label}">`;
        thumbnail.onclick = function() {
            mainImage.src = img.src;
            mainImage.alt = img.label;
            
            // Update active state
            document.querySelectorAll('.modal-thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        };
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Set product code/name
    document.getElementById('modalProductName').textContent = product.code || '제품 코드';
    
    // Basic Info
    document.getElementById('modalProductVolume').textContent = product.volume || '-';
    document.getElementById('modalProductCategory').textContent = product.categoryName || product.category || '-';
    
    // Dimensions Section
    const dimensionsSection = document.getElementById('modalDimensionsSection');
    const dimensionsDiv = document.getElementById('modalDimensions');
    let hasDimensions = false;
    let dimensionsHTML = '';
    
    if (product.diameter) {
        dimensionsHTML += `
            <div class="detail-row">
                <span class="detail-label">직경 (Ø):</span>
                <span>${product.diameter} mm</span>
            </div>
        `;
        hasDimensions = true;
    }
    
    if (product.bodySize) {
        dimensionsHTML += `
            <div class="detail-row">
                <span class="detail-label">BODY SIZE:</span>
                <span>${product.bodySize} mm</span>
            </div>
        `;
        hasDimensions = true;
    }
    
    if (product.totalHeight) {
        dimensionsHTML += `
            <div class="detail-row">
                <span class="detail-label">TOTAL HEIGHT:</span>
                <span>${product.totalHeight} mm</span>
            </div>
        `;
        hasDimensions = true;
    }
    
    if (hasDimensions) {
        dimensionsDiv.innerHTML = dimensionsHTML;
        dimensionsSection.style.display = 'block';
    } else {
        dimensionsSection.style.display = 'none';
    }
    
    // Components Section
    const componentsSection = document.getElementById('modalComponentsSection');
    const componentsDiv = document.getElementById('modalComponents');
    
    if (product.components && product.components.length > 0) {
        let componentsHTML = '<div style="display: grid; gap: 8px;">';
        product.components.forEach(comp => {
            componentsHTML += `
                <div style="display: flex; justify-content: space-between; padding: 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                    <span style="font-weight: 600; color: #495057;">${comp.name}</span>
                    <span style="color: #6c757d; background: white; padding: 4px 12px; border-radius: 4px; font-size: 0.9rem;">${comp.material}</span>
                </div>
            `;
        });
        componentsHTML += '</div>';
        componentsDiv.innerHTML = componentsHTML;
        componentsSection.style.display = 'block';
    } else {
        componentsSection.style.display = 'none';
    }
    
    // Assembly & Delivery Section
    const assemblySection = document.getElementById('modalAssemblySection');
    const assemblyRow = document.getElementById('modalAssemblyRow');
    const deliveryRow = document.getElementById('modalDeliveryRow');
    let hasAssemblyInfo = false;
    
    if (product.assembly) {
        document.getElementById('modalAssembly').textContent = product.assembly;
        assemblyRow.style.display = 'flex';
        hasAssemblyInfo = true;
    } else {
        assemblyRow.style.display = 'none';
    }
    
    if (product.deliverySet) {
        document.getElementById('modalDeliverySet').textContent = product.deliverySet;
        deliveryRow.style.display = 'flex';
        hasAssemblyInfo = true;
    } else {
        deliveryRow.style.display = 'none';
    }
    
    if (hasAssemblyInfo) {
        assemblySection.style.display = 'block';
    } else {
        assemblySection.style.display = 'none';
    }
    
    // Hide cross section section (now in gallery)
    const crossSectionSection = document.getElementById('modalCrossSectionSection');
    if (crossSectionSection) {
        crossSectionSection.style.display = 'none';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Open sample request modal
function openSampleRequestModal() {
    if (!currentProduct) {
        alert('제품 정보를 불러올 수 없습니다.');
        return;
    }
    
    const sampleModal = document.getElementById('sampleRequestModal');
    const productDetailsDiv = document.getElementById('sampleProductDetails');
    
    // Get material name
    const materials = currentProduct.components?.map(c => `${c.name}: ${c.material}`).join(', ') || '-';
    
    // Populate product details
    productDetailsDiv.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">제품 코드:</span>
            <span>${currentProduct.code}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">용량:</span>
            <span>${currentProduct.volume}</span>
        </div>
        ${currentProduct.diameter ? `
        <div class="detail-row">
            <span class="detail-label">직경:</span>
            <span>${currentProduct.diameter}mm</span>
        </div>` : ''}
        ${currentProduct.bodySize ? `
        <div class="detail-row">
            <span class="detail-label">BODY SIZE:</span>
            <span>${currentProduct.bodySize}mm</span>
        </div>` : ''}
        ${currentProduct.totalHeight ? `
        <div class="detail-row">
            <span class="detail-label">TOTAL HEIGHT:</span>
            <span>${currentProduct.totalHeight}mm</span>
        </div>` : ''}
        <div class="detail-row">
            <span class="detail-label">부품/재질:</span>
            <span>${materials}</span>
        </div>
    `;
    
    // Close product modal and open sample request modal
    closeProductModal();
    sampleModal.classList.add('active');
}

// Close sample request modal
function closeSampleRequestModal() {
    const modal = document.getElementById('sampleRequestModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('sampleRequestForm').reset();
}

// Submit sample request
async function submitSampleRequest(event) {
    event.preventDefault();
    
    const company = document.getElementById('sampleCompany').value.trim();
    const name = document.getElementById('sampleName').value.trim();
    const phone = document.getElementById('samplePhone').value.trim();
    const email = document.getElementById('sampleEmail').value.trim();
    const address = document.getElementById('sampleAddress').value.trim();
    const message = document.getElementById('sampleMessage').value.trim();
    
    // Validate phone format
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneRegex.test(phone)) {
        alert('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    try {
        const response = await fetch('/api/samples', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company,
                name,
                phone,
                email,
                address,
                message,
                product: {
                    id: currentProduct.id,
                    code: currentProduct.code,
                    volume: currentProduct.volume,
                    diameter: currentProduct.diameter,
                    bodySize: currentProduct.bodySize,
                    totalHeight: currentProduct.totalHeight,
                    components: currentProduct.components,
                    category: currentProduct.category
                }
            })
        });
        
        if (!response.ok) throw new Error('샘플 신청 실패');
        
        alert('✅ 샘플 신청이 완료되었습니다!\n담당자가 확인 후 연락드리겠습니다.');
        closeSampleRequestModal();
        
    } catch (error) {
        console.error('샘플 신청 오류:', error);
        alert('❌ 샘플 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
}

// Request sample (deprecated - redirect to contact)
function requestSample() {
    openSampleRequestModal();
}

// Close modal on background click
document.addEventListener('click', function(e) {
    const modal = document.getElementById('productModal');
    if (e.target === modal) {
        closeProductModal();
    }
});

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

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}
