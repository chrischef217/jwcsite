// Admin page functionality
let selectedMediaFiles = [];

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Check login
    if (sessionStorage.getItem('admin_logged_in') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    initAdmin();
});

function initAdmin() {
    // Section navigation
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('logout-btn')) return;
            
            const section = btn.dataset.section;
            if (!section) return;
            
            document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            const sectionEl = document.getElementById(section);
            if (sectionEl) {
                sectionEl.classList.add('active');
            }
        });
    });

    // Hero Slider file input handling
    const heroSliderInput = document.getElementById('heroSliderInput');
    const heroSliderUploadArea = document.getElementById('heroSliderUploadArea');
    const heroPreviewGrid = document.getElementById('heroPreviewGrid');

    if (heroSliderInput && heroSliderUploadArea) {
        heroSliderUploadArea.addEventListener('click', () => {
            heroSliderInput.click();
        });

        heroSliderInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            handleHeroMediaFiles(files);
        });

        // Drag and drop
        heroSliderUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            heroSliderUploadArea.style.borderColor = '#28a745';
            heroSliderUploadArea.style.background = '#f0f8f0';
        });

        heroSliderUploadArea.addEventListener('dragleave', () => {
            heroSliderUploadArea.style.borderColor = '#28a745';
            heroSliderUploadArea.style.background = '';
        });

        heroSliderUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            heroSliderUploadArea.style.borderColor = '#28a745';
            heroSliderUploadArea.style.background = '';
            
            const files = Array.from(e.dataTransfer.files);
            handleHeroMediaFiles(files);
        });
    }

    // Load data
    loadHeroSliderList();
    loadSliderSettings();
}

// Handle selected media files
function handleHeroMediaFiles(files) {
    selectedMediaFiles = files;
    
    const heroPreviewGrid = document.getElementById('heroPreviewGrid');
    const placeholder = document.querySelector('#heroSliderUploadArea .upload-placeholder');
    
    if (!heroPreviewGrid) return;
    
    heroPreviewGrid.innerHTML = '';
    heroPreviewGrid.style.display = 'block';
    
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    files.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.style.cssText = 'border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 15px;';
        
        let mediaPreview = '';
        if (file.type.startsWith('image/')) {
            mediaPreview = '<img style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;"/>';
        } else if (file.type.startsWith('video/')) {
            mediaPreview = '<video style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;" controls></video>';
        }
        
        previewItem.innerHTML = `
            <div style="display: flex; gap: 15px; align-items: start;">
                <div id="media-${index}">${mediaPreview}</div>
                <div style="flex: 1;">
                    <p><strong>${file.type.startsWith('video/') ? '🎥' : '📷'} ${file.name}</strong></p>
                    <div style="margin-top: 10px;">
                        <button onclick="moveUpPreview(${index})" style="padding: 5px 10px; margin-right: 5px;">↑</button>
                        <button onclick="moveDownPreview(${index})" style="padding: 5px 10px;">↓</button>
                    </div>
                </div>
            </div>
        `;
        
        heroPreviewGrid.appendChild(previewItem);
        
        // Load preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const mediaEl = document.querySelector(`#media-${index} ${file.type.startsWith('image/') ? 'img' : 'video'}`);
            if (mediaEl) mediaEl.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Move up preview
window.moveUpPreview = function(index) {
    if (index === 0) return;
    const temp = selectedMediaFiles[index];
    selectedMediaFiles[index] = selectedMediaFiles[index - 1];
    selectedMediaFiles[index - 1] = temp;
    handleHeroMediaFiles(Array.from(selectedMediaFiles));
}

// Move down preview
window.moveDownPreview = function(index) {
    if (index >= selectedMediaFiles.length - 1) return;
    const temp = selectedMediaFiles[index];
    selectedMediaFiles[index] = selectedMediaFiles[index + 1];
    selectedMediaFiles[index + 1] = temp;
    handleHeroMediaFiles(Array.from(selectedMediaFiles));
}

// Save hero media (global function)
window.saveHeroMedia = async function() {
    if (selectedMediaFiles.length === 0) {
        alert('파일을 선택해주세요.');
        return;
    }
    
    const progressBar = document.getElementById('heroSliderProgress');
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    try {
        progressBar.style.display = 'block';
        progressFill.style.width = '50%';
        progressText.textContent = '50%';
        
        // Get existing media to append
        const existing = await getHeroSliderMedia();
        const startIndex = existing.length;
        
        await saveHeroMediaToDB(selectedMediaFiles, startIndex);
        
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        
        setTimeout(() => {
            progressBar.style.display = 'none';
            progressFill.style.width = '0%';
            alert('✅ 히어로 슬라이더가 서버에 저장되었습니다!');
            loadHeroSliderList();
            
            // Reset
            selectedMediaFiles = [];
            const heroPreviewGrid = document.getElementById('heroPreviewGrid');
            if (heroPreviewGrid) {
                heroPreviewGrid.innerHTML = '';
                heroPreviewGrid.style.display = 'none';
            }
            const placeholder = document.querySelector('#heroSliderUploadArea .upload-placeholder');
            if (placeholder) {
                placeholder.style.display = 'block';
            }
            const heroSliderInput = document.getElementById('heroSliderInput');
            if (heroSliderInput) {
                heroSliderInput.value = '';
            }
        }, 500);
        
    } catch (error) {
        progressBar.style.display = 'none';
        alert('❌ 저장 실패: ' + error.message);
    }
}

// Load slider settings
async function loadSliderSettings() {
    const settings = await getSliderSettings();
    if (settings) {
        document.getElementById('sliderTitle').value = settings.title || '';
        document.getElementById('sliderContent').value = settings.content || '';
        
        // Load title type
        const titleType = settings.titleType || 'text';
        selectTitleType(titleType);
        
        if (settings.logoUrl) {
            displayCurrentLogo(settings.logoUrl);
        }
    }
}

// Select title type
window.selectTitleType = function(type) {
    const textSection = document.getElementById('textTitleSection');
    const logoSection = document.getElementById('logoTitleSection');
    const buttons = document.querySelectorAll('.title-type-btn');
    
    // Update button styles
    buttons.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show/hide sections
    if (type === 'text') {
        textSection.style.display = 'block';
        logoSection.style.display = 'none';
    } else {
        textSection.style.display = 'none';
        logoSection.style.display = 'block';
    }
}

// Display current logo
function displayCurrentLogo(logoUrl) {
    const preview = document.getElementById('currentLogoPreview');
    preview.innerHTML = `
        <div style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; background: #f9f9f9;">
            <img src="${logoUrl}" style="max-width: 200px; max-height: 80px; display: block; margin-bottom: 10px;">
            <button class="btn btn-danger" onclick="deleteSliderLogo()" style="font-size: 0.9rem; padding: 5px 10px;">로고 삭제</button>
        </div>
    `;
}

// Delete slider logo
window.deleteSliderLogo = async function() {
    if (!confirm('로고를 삭제하시겠습니까?')) return;
    
    const settings = await getSliderSettings();
    settings.titleType = 'text';
    settings.logoUrl = '';
    await saveSliderSettings(settings);
    
    document.getElementById('currentLogoPreview').innerHTML = '';
    selectTitleType('text');
    alert('✅ 로고가 삭제되었습니다!');
}

// Handle logo upload
document.addEventListener('DOMContentLoaded', function() {
    const logoInput = document.getElementById('sliderLogoInput');
    if (logoInput) {
        logoInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드 가능합니다.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = async function(event) {
                const logoUrl = event.target.result;
                const settings = await getSliderSettings() || {};
                settings.titleType = 'logo';
                settings.logoUrl = logoUrl;
                await saveSliderSettings(settings);
                
                displayCurrentLogo(logoUrl);
                alert('✅ 로고가 업로드되었습니다!');
            };
            reader.readAsDataURL(file);
        });
    }
});

// Save slider text
window.saveSliderText = async function() {
    const activeBtn = document.querySelector('.title-type-btn.active');
    const titleType = activeBtn ? activeBtn.dataset.type : 'text';
    const title = document.getElementById('sliderTitle').value;
    const content = document.getElementById('sliderContent').value;
    
    const settings = await getSliderSettings() || {};
    settings.titleType = titleType;
    settings.title = title;
    settings.content = content;
    
    await saveSliderSettings(settings);
    alert('✅ 슬라이더 텍스트가 저장되었습니다!');
}

// Load hero slider list
async function loadHeroSliderList() {
    const list = document.getElementById('heroImagesList');
    if (!list) return;
    
    const mediaItems = await getHeroSliderMedia();
    
    // Debug logging
    console.log('[DEBUG] Raw API response:', mediaItems);
    console.log('[DEBUG] Type:', typeof mediaItems, 'Is Array:', Array.isArray(mediaItems));
    if (Array.isArray(mediaItems) && mediaItems.length > 0) {
        console.log('[DEBUG] First item:', mediaItems[0]);
        if (mediaItems[0] && typeof mediaItems[0] === 'object' && !Array.isArray(mediaItems[0])) {
            console.log('[DEBUG] First item ID:', mediaItems[0].id);
        }
    }
    
    // CRITICAL FIX: Filter out non-object items and items without valid IDs
    const validItems = mediaItems.filter(item => 
        item && 
        typeof item === 'object' && 
        !Array.isArray(item) && 
        item.id && 
        typeof item.id === 'string' &&
        item.id.startsWith('hero_')
    );
    
    console.log('[DEBUG] Valid items after filtering:', validItems.length, validItems);
    
    if (validItems.length === 0) {
        list.innerHTML = '<p style="color: #999;">등록된 슬라이더가 없습니다.</p>';
        return;
    }
    
    list.innerHTML = '';
    validItems.forEach((item, index) => {
        console.log(`[DEBUG] Rendering item ${index}:`, item.id, item.mediaType);
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 15px; display: flex; gap: 15px; align-items: center;';
        
        if (item.mediaType === 'video') {
            itemDiv.innerHTML = `
                <video src="${item.data}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;" controls></video>
                <div style="flex: 1;">
                    <p><strong>🎥 동영상 ${index + 1}</strong></p>
                    <p style="color: #666; font-size: 14px;">${item.filename || 'video'}</p>
                    <p style="color: #999; font-size: 12px;">ID: ${item.id}</p>
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="moveItemUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn btn-secondary" onclick="moveItemDown(${index})" ${index === validItems.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn btn-secondary" onclick="deleteHeroMedia('${item.id}')">삭제</button>
                </div>
            `;
        } else {
            itemDiv.innerHTML = `
                <img src="${item.data}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;">
                <div style="flex: 1;">
                    <p><strong>📷 이미지 ${index + 1}</strong></p>
                    <p style="color: #666; font-size: 14px;">${item.filename || 'image'}</p>
                    <p style="color: #999; font-size: 12px;">ID: ${item.id}</p>
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="moveItemUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn btn-secondary" onclick="moveItemDown(${index})" ${index === validItems.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn btn-secondary" onclick="deleteHeroMedia('${item.id}')">삭제</button>
                </div>
            `;
        }
        
        list.appendChild(itemDiv);
    });
}

// Move item up in saved list
window.moveItemUp = async function(index) {
    const items = await getHeroSliderMedia();
    if (index === 0) return;
    
    // Swap order_index
    const temp = items[index].order_index;
    items[index].order_index = items[index - 1].order_index;
    items[index - 1].order_index = temp;
    
    await updateItemOrder(items[index].id, items[index].order_index);
    await updateItemOrder(items[index - 1].id, items[index - 1].order_index);
    
    loadHeroSliderList();
}

// Move item down in saved list
window.moveItemDown = async function(index) {
    const items = await getHeroSliderMedia();
    if (index >= items.length - 1) return;
    
    // Swap order_index
    const temp = items[index].order_index;
    items[index].order_index = items[index + 1].order_index;
    items[index + 1].order_index = temp;
    
    await updateItemOrder(items[index].id, items[index].order_index);
    await updateItemOrder(items[index + 1].id, items[index + 1].order_index);
    
    loadHeroSliderList();
}

// Delete hero media by ID (API call)
window.deleteHeroMediaById = async function(id) {
    const response = await fetch(`/api/hero?id=${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete media');
    }
    
    return await response.json();
}

// Delete hero media (global function)
window.deleteHeroMedia = async function(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await window.deleteHeroMediaById(id);
        alert('✅ 삭제되었습니다.');
        loadHeroSliderList();
    } catch (error) {
        alert('❌ 삭제 실패: ' + error.message);
    }
}

// Get all hero slider media
window.getHeroSliderMedia = async function() {
    // Add timestamp to prevent caching
    const response = await fetch('/api/hero?_t=' + Date.now());
    if (!response.ok) {
        throw new Error('Failed to fetch hero media');
    }
    return await response.json();
}

// Update item order
window.updateItemOrder = async function(id, orderIndex) {
    const response = await fetch(`/api/hero?id=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order_index: orderIndex })
    });
    
    if (!response.ok) {
        throw new Error('Failed to update order');
    }
    
    return await response.json();
}

// ========== PRODUCTS MANAGEMENT ==========

let currentEditingProduct = null;

// Load products list
async function loadProductsList() {
    try {
        const products = await window.getAllProducts();
        const container = document.getElementById('productsList');
        
        if (!products || products.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">등록된 제품이 없습니다.</p>';
            return;
        }
        
        // Group by category
        const grouped = products.reduce((acc, product) => {
            const cat = product.category || 'uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(product);
            return acc;
        }, {});
        
        const categoryNames = {
            'cream': 'Cream Jars (크림 용기)',
            'essence': 'Essence & Serum (에센스/세럼)',
            'lotion': 'Lotion (로션)',
            'eco': 'Eco-Friendly (친환경)',
            'uncategorized': '미분류'
        };
        
        let html = '';
        
        Object.keys(grouped).forEach(category => {
            html += `
                <div class="product-category-group" style="margin-bottom: 30px;">
                    <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 15px;">
                        ${categoryNames[category] || category} (${grouped[category].length})
                    </h3>
                    <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
            `;
            
            grouped[category].forEach(product => {
                html += `
                    <div class="product-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="width: 100%; padding-top: 100%; position: relative; overflow: hidden; border-radius: 8px; background: #f8f9fa; margin-bottom: 12px;">
                            <img src="${product.imageData || product.image}" alt="${product.name}" 
                                 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; height: 90%; object-fit: contain;">
                        </div>
                        <h4 style="margin: 0 0 5px 0; font-size: 1rem; color: #333;">${product.name}</h4>
                        <p style="color: #007bff; font-weight: 600; margin: 5px 0;">${product.model}</p>
                        ${product.size ? `<p style="color: #666; font-size: 0.85rem; margin: 3px 0;">${product.size}</p>` : ''}
                        <p style="color: #555; font-weight: 500; margin: 5px 0;">${product.volume}</p>
                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <button onclick="editProduct('${product.id}')" class="btn btn-sm" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">수정</button>
                            <button onclick="deleteProductItem('${product.id}')" class="btn btn-sm" style="flex: 1; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">삭제</button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to load products:', error);
        document.getElementById('productsList').innerHTML = '<p style="color: red; text-align: center; padding: 40px;">제품 목록을 불러오지 못했습니다.</p>';
    }
}

// Show product form
window.showProductForm = function() {
    currentEditingProduct = null;
    document.getElementById('formTitle').textContent = '새 제품 추가';
    document.getElementById('productName').value = '';
    document.getElementById('productModel').value = '';
    document.getElementById('productSize').value = '';
    document.getElementById('productVolume').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productImagePreview').style.display = 'none';
    document.getElementById('productImagePreview').src = '';
    document.getElementById('productForm').style.display = 'block';
    
    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Cancel product form
window.cancelProductForm = function() {
    currentEditingProduct = null;
    document.getElementById('productForm').style.display = 'none';
}

// Edit product
window.editProduct = async function(productId) {
    try {
        const products = await window.getAllProducts();
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            alert('제품을 찾을 수 없습니다.');
            return;
        }
        
        currentEditingProduct = product;
        document.getElementById('formTitle').textContent = '제품 수정';
        document.getElementById('productName').value = product.name;
        document.getElementById('productModel').value = product.model;
        document.getElementById('productSize').value = product.size || '';
        document.getElementById('productVolume').value = product.volume;
        document.getElementById('productCategory').value = product.category;
        
        if (product.imageData || product.image) {
            document.getElementById('productImagePreview').src = product.imageData || product.image;
            document.getElementById('productImagePreview').style.display = 'block';
        }
        
        document.getElementById('productForm').style.display = 'block';
        document.getElementById('productForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        alert('제품 로드 실패: ' + error.message);
    }
}

// Save product
window.saveProductData = async function() {
    try {
        const name = document.getElementById('productName').value.trim();
        const model = document.getElementById('productModel').value.trim();
        const size = document.getElementById('productSize').value.trim();
        const volume = document.getElementById('productVolume').value.trim();
        const category = document.getElementById('productCategory').value;
        const imageInput = document.getElementById('productImageInput');
        
        if (!name || !model || !volume || !category) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }
        
        const productData = {
            id: currentEditingProduct ? currentEditingProduct.id : Date.now().toString(),
            name,
            model,
            size,
            volume,
            category,
            createdAt: currentEditingProduct ? currentEditingProduct.createdAt : new Date().toISOString()
        };
        
        // Handle image
        if (imageInput.files && imageInput.files[0]) {
            productData.image = imageInput.files[0];
        } else if (currentEditingProduct && (currentEditingProduct.imageData || currentEditingProduct.image)) {
            productData.imageData = currentEditingProduct.imageData || currentEditingProduct.image;
        } else {
            alert('제품 이미지를 선택해주세요.');
            return;
        }
        
        await window.saveProduct(productData);
        
        alert('✅ 제품이 저장되었습니다!');
        cancelProductForm();
        loadProductsList();
        
    } catch (error) {
        alert('❌ 저장 실패: ' + error.message);
    }
}

// Delete product
window.deleteProductItem = async function(productId) {
    if (!confirm('정말 이 제품을 삭제하시겠습니까?')) return;
    
    try {
        await window.deleteProduct(productId);
        alert('✅ 제품이 삭제되었습니다.');
        loadProductsList();
    } catch (error) {
        alert('❌ 삭제 실패: ' + error.message);
    }
}

// Setup product image upload
function setupProductImageUpload() {
    const uploadArea = document.getElementById('productImageArea');
    const imageInput = document.getElementById('productImageInput');
    const preview = document.getElementById('productImagePreview');
    
    if (!uploadArea || !imageInput) return;
    
    uploadArea.addEventListener('click', () => imageInput.click());
    
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007bff';
        uploadArea.style.background = '#f0f8ff';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007bff';
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007bff';
        uploadArea.style.background = '';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            imageInput.files = e.dataTransfer.files;
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Initialize products management on page load
document.addEventListener('DOMContentLoaded', function() {
    setupProductImageUpload();
    
    // Load products when navigating to products section
    const productsNav = document.querySelector('[data-section="products"]');
    if (productsNav) {
        productsNav.addEventListener('click', loadProductsList);
    }
    
    // Load products if already on products section
    if (window.location.hash === '#products') {
        loadProductsList();
    }
});

// ========== PAGE HERO SLIDERS MANAGEMENT ==========

let currentPageName = '';
let currentPageTitleType = 'text';
let currentPageLogoData = '';
let pageHeroMediaFiles = [];

// Load page hero slider
window.loadPageHeroSlider = async function(pageName) {
    if (!pageName) {
        document.getElementById('pageHeroContent').style.display = 'none';
        return;
    }
    
    currentPageName = pageName;
    document.getElementById('pageHeroContent').style.display = 'block';
    
    const pageNames = {
        'about': 'ABOUT',
        'products': 'PRODUCTS',
        'contact': 'CONTACT',
        'notice': 'NOTICE'
    };
    document.getElementById('pageHeroTitle').textContent = `${pageNames[pageName]} 페이지 히어로 슬라이더`;
    
    try {
        const data = await window.getPageHeroSlider(pageName);
        
        // Load settings
        if (data.settings) {
            document.getElementById('pageSliderTitle').value = data.settings.title || '';
            document.getElementById('pageSliderContent').value = data.settings.content || '';
            currentPageTitleType = data.settings.titleType || 'text';
            currentPageLogoData = data.settings.logoUrl || '';
            
            // Update title type buttons
            document.querySelectorAll('.title-type-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.type === currentPageTitleType) {
                    btn.classList.add('active');
                }
            });
            
            // Show/hide inputs
            if (currentPageTitleType === 'logo') {
                document.getElementById('pageTitleTextInput').style.display = 'none';
                document.getElementById('pageTitleLogoInput').style.display = 'block';
                if (currentPageLogoData) {
                    document.getElementById('pageLogoPreview').src = currentPageLogoData;
                    document.getElementById('pageLogoPreviewContainer').style.display = 'block';
                }
            } else {
                document.getElementById('pageTitleTextInput').style.display = 'block';
                document.getElementById('pageTitleLogoInput').style.display = 'none';
            }
        }
        
        // Load media items
        renderPageHeroList(data.media || []);
        
    } catch (error) {
        console.error('Failed to load page hero:', error);
    }
}

// Select page title type
window.selectPageTitleType = function(type) {
    currentPageTitleType = type;
    
    // Update button styles
    document.querySelectorAll('.title-type-btn').forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
            btn.style.background = '#007bff';
            btn.style.color = 'white';
            btn.style.borderColor = '#007bff';
        } else {
            btn.classList.remove('active');
            btn.style.background = 'white';
            btn.style.color = '#666';
            btn.style.borderColor = '#ddd';
        }
    });
    
    // Show/hide inputs
    if (type === 'logo') {
        document.getElementById('pageTitleTextInput').style.display = 'none';
        document.getElementById('pageTitleLogoInput').style.display = 'block';
    } else {
        document.getElementById('pageTitleTextInput').style.display = 'block';
        document.getElementById('pageTitleLogoInput').style.display = 'none';
    }
}

// Setup page logo upload
document.addEventListener('DOMContentLoaded', function() {
    const logoInput = document.getElementById('pageLogoInput');
    if (logoInput) {
        logoInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    currentPageLogoData = e.target.result;
                    document.getElementById('pageLogoPreview').src = currentPageLogoData;
                    document.getElementById('pageLogoPreviewContainer').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Delete page logo
window.deletePageLogo = function() {
    currentPageLogoData = '';
    document.getElementById('pageLogoPreview').src = '';
    document.getElementById('pageLogoPreviewContainer').style.display = 'none';
    document.getElementById('pageLogoInput').value = '';
}

// Save page slider text
window.savePageSliderText = async function() {
    if (!currentPageName) {
        alert('페이지를 먼저 선택하세요.');
        return;
    }
    
    try {
        const settings = {
            title: document.getElementById('pageSliderTitle').value.trim(),
            content: document.getElementById('pageSliderContent').value.trim(),
            titleType: currentPageTitleType,
            logoUrl: currentPageLogoData
        };
        
        await window.savePageHeroSettings(currentPageName, settings);
        alert('✅ 텍스트가 저장되었습니다!');
        
    } catch (error) {
        alert('❌ 저장 실패: ' + error.message);
    }
}

// Setup page hero media upload
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('pageHeroUploadArea');
    const mediaInput = document.getElementById('pageHeroMediaInput');
    
    if (!uploadArea || !mediaInput) return;
    
    uploadArea.addEventListener('click', (e) => {
        if (!e.target.closest('.preview-grid')) {
            mediaInput.click();
        }
    });
    
    mediaInput.addEventListener('change', handlePageMediaFiles);
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007bff';
        uploadArea.style.background = '#f0f8ff';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007bff';
        uploadArea.style.background = '';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007bff';
        uploadArea.style.background = '';
        
        const files = Array.from(e.dataTransfer.files).filter(f => 
            f.type.startsWith('image/') || f.type.startsWith('video/')
        );
        
        if (files.length > 0) {
            mediaInput.files = e.dataTransfer.files;
            handlePageMediaFiles({ target: { files } });
        }
    });
});

function handlePageMediaFiles(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    pageHeroMediaFiles = files;
    
    const previewGrid = document.getElementById('pageMediaPreviewGrid');
    previewGrid.innerHTML = '';
    previewGrid.style.display = 'grid';
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.style.position = 'relative';
            preview.style.paddingTop = '100%';
            preview.style.overflow = 'hidden';
            preview.style.borderRadius = '8px';
            preview.style.background = '#f0f0f0';
            
            if (file.type.startsWith('video/')) {
                preview.innerHTML = `
                    <video src="${e.target.result}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"></video>
                    <div style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 5px; font-size: 0.8rem;">VIDEO</div>
                `;
            } else {
                preview.innerHTML = `
                    <img src="${e.target.result}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
                `;
            }
            
            previewGrid.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

// Save page hero media
window.savePageHeroMedia = async function() {
    if (!currentPageName) {
        alert('페이지를 먼저 선택하세요.');
        return;
    }
    
    if (pageHeroMediaFiles.length === 0) {
        alert('업로드할 파일을 선택하세요.');
        return;
    }
    
    const progressBar = document.getElementById('pageHeroProgress');
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    try {
        console.log(`🚀 Saving ${pageHeroMediaFiles.length} files to ${currentPageName} page`);
        
        // Show progress bar
        progressBar.style.display = 'block';
        progressFill.style.width = '0%';
        progressText.textContent = '0%';
        
        const data = await window.getPageHeroSlider(currentPageName);
        const startIndex = data.media ? data.media.length : 0;
        
        console.log(`📊 Current items: ${startIndex}, Adding: ${pageHeroMediaFiles.length}`);
        
        // Process each file
        for (let i = 0; i < pageHeroMediaFiles.length; i++) {
            const file = pageHeroMediaFiles[i];
            const isVideo = file.type.startsWith('video/');
            
            console.log(`📤 Uploading ${i + 1}/${pageHeroMediaFiles.length}: ${file.name} (${isVideo ? 'video' : 'image'})`);
            
            let mediaData;
            if (isVideo) {
                mediaData = await videoToBase64(file);
            } else {
                mediaData = await compressImage(file);
            }
            
            // Save to API
            const response = await fetch(`/api/hero/page/${currentPageName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaType: isVideo ? 'video' : 'image',
                    data: mediaData,
                    order_index: startIndex + i
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to save ${file.name}`);
            }
            
            const result = await response.json();
            console.log(`✅ Saved: ${result.item.id}`);
            
            // Update progress
            const progress = Math.round(((i + 1) / pageHeroMediaFiles.length) * 100);
            progressFill.style.width = progress + '%';
            progressText.textContent = progress + '%';
        }
        
        console.log('✅ All files saved successfully');
        alert('✅ 미디어가 저장되었습니다!');
        
        // Hide progress bar
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 1000);
        
        // Clear preview
        document.getElementById('pageMediaPreviewGrid').innerHTML = '';
        document.getElementById('pageMediaPreviewGrid').style.display = 'none';
        document.getElementById('pageHeroMediaInput').value = '';
        pageHeroMediaFiles = [];
        
        // Reload list
        loadPageHeroSlider(currentPageName);
        
    } catch (error) {
        console.error('❌ Save failed:', error);
        alert('❌ 저장 실패: ' + error.message);
        progressBar.style.display = 'none';
    }
}

// Render page hero list
function renderPageHeroList(items) {
    const listEl = document.getElementById('pageHeroItemsList');
    
    if (!items || items.length === 0) {
        listEl.innerHTML = '<li style="padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #999;">항목이 없습니다. 이미지나 영상을 업로드하세요.</li>';
        return;
    }
    
    let html = '';
    items.forEach((item, index) => {
        const isVideo = item.mediaType === 'video';
        html += `
            <li style="display: flex; align-items: center; gap: 15px; padding: 15px; background: white; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 10px;">
                <div style="width: 100px; height: 100px; flex-shrink: 0; border-radius: 8px; overflow: hidden; background: #f0f0f0;">
                    ${isVideo ? 
                        `<video src="${item.data}" style="width: 100%; height: 100%; object-fit: cover;"></video>` :
                        `<img src="${item.data}" style="width: 100%; height: 100%; object-fit: cover;">`
                    }
                </div>
                <div style="flex: 1;">
                    <strong style="display: block; margin-bottom: 5px;">${isVideo ? '영상' : '이미지'} #${index + 1}</strong>
                    <small style="color: #999;">${new Date(item.createdAt).toLocaleString()}</small>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="deletePageHeroItem('${item.id}')" class="btn btn-danger" style="padding: 8px 15px; white-space: nowrap;">🗑️ 삭제</button>
                </div>
            </li>
        `;
    });
    
    listEl.innerHTML = html;
}

// Delete page hero media function
window.deletePageHeroMedia = async function(pageName, itemId) {
    const response = await fetch(`/api/hero/page/${pageName}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ itemId })
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete media');
    }
    
    return await response.json();
}

// Delete page hero item
window.deletePageHeroItem = async function(itemId) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await window.deletePageHeroMedia(currentPageName, itemId);
        alert('✅ 삭제되었습니다.');
        loadPageHeroSlider(currentPageName);
    } catch (error) {
        alert('❌ 삭제 실패: ' + error.message);
    }
}

// Logout (global function)
window.logout = function() {
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('admin_password');
    window.location.href = 'admin-login.html';
}

// Password change form handler
document.getElementById('passwordChangeForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        alert('❌ 새 비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (newPassword.length < 4) {
        alert('❌ 비밀번호는 최소 4자 이상이어야 합니다.');
        return;
    }
    
    try {
        const response = await fetch('/api/admin/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert('✅ 비밀번호가 성공적으로 변경되었습니다.');
            document.getElementById('passwordChangeForm').reset();
        } else {
            alert('❌ ' + (result.error || '비밀번호 변경에 실패했습니다.'));
        }
    } catch (error) {
        console.error('Password change error:', error);
        alert('❌ 비밀번호 변경 중 오류가 발생했습니다.');
    }
});

// ========== Notices Management ==========

let currentNoticeMedia = null;

// Load notices list
async function loadNotices() {
    try {
        const response = await fetch('/api/notice');
        
        // 응답 상태 확인
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        const listEl = document.getElementById('noticesList');
        
        // 에러 응답 처리
        if (data.error) {
            console.error('API Error:', data.error);
            listEl.innerHTML = '<p style="color: #dc3545; text-align: center; padding: 40px;">공지사항을 불러오는데 실패했습니다: ' + data.error + '</p>';
            return;
        }
        
        // 배열인지 확인 (에러 응답의 경우 data.notices가 있을 수 있음)
        const notices = Array.isArray(data) ? data : (Array.isArray(data.notices) ? data.notices : []);
        
        if (notices.length === 0) {
            listEl.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">등록된 공지사항이 없습니다.</p>';
            return;
        }
        
        // 최신순 정렬 (안전하게)
        const sortedNotices = notices.filter(n => n && n.id).sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
        
        listEl.innerHTML = sortedNotices.map(notice => `
            <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                    <h3 style="margin: 0; color: #333;">${notice.title || '제목 없음'}</h3>
                    <div style="display: flex; gap: 8px;">
                        <button onclick="editNotice('${notice.id}')" style="padding: 6px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">수정</button>
                        <button onclick="deleteNotice('${notice.id}')" style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">삭제</button>
                    </div>
                </div>
                <p style="color: #666; white-space: pre-wrap; margin: 10px 0;">${(notice.content || '').substring(0, 100)}${(notice.content || '').length > 100 ? '...' : ''}</p>
                ${notice.media ? `<p style="color: #999; font-size: 0.9rem;">📎 미디어 첨부됨</p>` : ''}
                <small style="color: #999;">${notice.created_at ? new Date(notice.created_at).toLocaleString() : ''}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load notices:', error);
        const listEl = document.getElementById('noticesList');
        if (listEl) {
            listEl.innerHTML = '<p style="color: #dc3545; text-align: center; padding: 40px;">공지사항을 불러오는데 실패했습니다: ' + error.message + '</p>';
        }
    }
}

// Open notice modal
window.openNoticeModal = function(noticeId = null) {
    document.getElementById('noticeModal').style.display = 'block';
    document.getElementById('noticeForm').reset();
    document.getElementById('noticeId').value = '';
    document.getElementById('noticeMediaPreview').innerHTML = '';
    currentNoticeMedia = null;
    
    if (noticeId) {
        document.getElementById('noticeModalTitle').textContent = '공지사항 수정';
        loadNoticeForEdit(noticeId);
    } else {
        document.getElementById('noticeModalTitle').textContent = '새 공지사항 작성';
    }
}

// Close notice modal
window.closeNoticeModal = function() {
    document.getElementById('noticeModal').style.display = 'none';
}

// Load notice for edit
async function loadNoticeForEdit(noticeId) {
    try {
        const response = await fetch(`/api/notice?id=${noticeId}`);
        const notice = await response.json();
        
        document.getElementById('noticeId').value = notice.id;
        document.getElementById('noticeTitle').value = notice.title;
        document.getElementById('noticeContent').value = notice.content;
        
        if (notice.media) {
            const previewEl = document.getElementById('noticeMediaPreview');
            if (notice.mediaType === 'video') {
                previewEl.innerHTML = `<video src="${notice.media}" controls style="max-width: 100%; max-height: 300px; border-radius: 4px;"></video>`;
            } else {
                previewEl.innerHTML = `<img src="${notice.media}" style="max-width: 100%; max-height: 300px; border-radius: 4px;">`;
            }
        }
    } catch (error) {
        console.error('Failed to load notice:', error);
        alert('❌ 공지사항을 불러오는데 실패했습니다.');
    }
}

// Edit notice
window.editNotice = function(noticeId) {
    openNoticeModal(noticeId);
}

// Delete notice
window.deleteNotice = async function(noticeId) {
    if (!confirm('정말 이 공지사항을 삭제하시겠습니까?')) return;
    
    const password = sessionStorage.getItem('admin_password') || prompt('관리자 비밀번호를 입력하세요:');
    if (!password) return;
    
    try {
        const response = await fetch(`/api/notice?id=${noticeId}&password=${encodeURIComponent(password)}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete notice');
        }
        
        alert('✅ 공지사항이 삭제되었습니다.');
        loadNotices();
    } catch (error) {
        console.error('Failed to delete notice:', error);
        alert('❌ 공지사항 삭제에 실패했습니다.');
    }
}

// Handle media file selection
document.getElementById('noticeMedia')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        currentNoticeMedia = {
            data: event.target.result,
            type: file.type.startsWith('video/') ? 'video' : 'image',
            filename: file.name
        };
        
        const previewEl = document.getElementById('noticeMediaPreview');
        if (currentNoticeMedia.type === 'video') {
            previewEl.innerHTML = `<video src="${event.target.result}" controls style="max-width: 100%; max-height: 300px; border-radius: 4px;"></video>`;
        } else {
            previewEl.innerHTML = `<img src="${event.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 4px;">`;
        }
    };
    reader.readAsDataURL(file);
});

// Submit notice form
document.getElementById('noticeForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = sessionStorage.getItem('admin_password') || prompt('관리자 비밀번호를 입력하세요:');
    if (!password) return;
    
    const noticeId = document.getElementById('noticeId').value;
    const title = document.getElementById('noticeTitle').value;
    const content = document.getElementById('noticeContent').value;
    
    const data = {
        title,
        content,
        password
    };
    
    if (noticeId) {
        data.id = noticeId;
    }
    
    if (currentNoticeMedia) {
        data.media = currentNoticeMedia.data;
        data.mediaType = currentNoticeMedia.type;
    }
    
    try {
        const method = noticeId ? 'PUT' : 'POST';
        const response = await fetch('/api/notice', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error('Failed to save notice');
        }
        
        alert('✅ 공지사항이 저장되었습니다.');
        closeNoticeModal();
        loadNotices();
    } catch (error) {
        console.error('Failed to save notice:', error);
        alert('❌ 공지사항 저장에 실패했습니다.');
    }
});

// Load notices when section is active
document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        if (section === 'notices') {
            loadNotices();
        }
    });
});


// ========================================
// CERTIFICATION MANAGEMENT
// ========================================

let currentEditingCertification = null;

// Load certifications list
async function loadCertificationsList() {
    try {
        const response = await fetch('/api/certification');
        if (!response.ok) throw new Error('Failed to fetch certifications');
        
        const certifications = await response.json();
        const container = document.getElementById('certificationsList');
        
        if (!certifications || certifications.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">등록된 인증서가 없습니다.</p>';
            return;
        }
        
        // Group by category
        const grouped = certifications.reduce((acc, cert) => {
            const cat = cert.category || 'uncategorized';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(cert);
            return acc;
        }, {});
        
        const categoryNames = {
            'iso': 'ISO',
            'patent': 'Patent (특허)',
            'quality': 'Quality (품질인증)',
            'others': 'Others (기타)',
            'uncategorized': '미분류'
        };
        
        let html = '';
        
        Object.keys(grouped).forEach(category => {
            html += `
                <div class="certification-category-group" style="margin-bottom: 30px;">
                    <h3 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 15px;">
                        ${categoryNames[category] || category} (${grouped[category].length})
                    </h3>
                    <div class="certifications-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;">
            `;
            
            grouped[category].forEach(cert => {
                html += `
                    <div class="certification-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="width: 100%; padding-top: 100%; position: relative; overflow: hidden; border-radius: 8px; background: #f8f9fa; margin-bottom: 12px;">
                            <img src="${cert.imageData || cert.image}" alt="${cert.name}" 
                                 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; height: 90%; object-fit: contain;">
                        </div>
                        <h4 style="margin: 0 0 5px 0; font-size: 1rem; color: #333;">${cert.name}</h4>
                        ${cert.issuer ? `<p style="color: #007bff; font-weight: 600; margin: 5px 0;">${cert.issuer}</p>` : ''}
                        ${cert.issueDate ? `<p style="color: #666; font-size: 0.85rem; margin: 3px 0;">발급: ${cert.issueDate}</p>` : ''}
                        ${cert.validUntil ? `<p style="color: #555; font-size: 0.85rem; margin: 3px 0;">유효: ${cert.validUntil}</p>` : ''}
                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <button onclick="editCertification('${cert.id}')" class="btn btn-sm" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">수정</button>
                            <button onclick="deleteCertificationItem('${cert.id}')" class="btn btn-sm" style="flex: 1; padding: 8px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">삭제</button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to load certifications:', error);
        document.getElementById('certificationsList').innerHTML = '<p style="color: red; text-align: center; padding: 40px;">인증서 목록을 불러오지 못했습니다.</p>';
    }
}

// Show certification form
window.showCertificationForm = function() {
    currentEditingCertification = null;
    document.getElementById('certFormTitle').textContent = '새 인증서 추가';
    document.getElementById('certName').value = '';
    document.getElementById('certIssuer').value = '';
    document.getElementById('certIssueDate').value = '';
    document.getElementById('certValidUntil').value = '';
    document.getElementById('certCategory').value = '';
    document.getElementById('certImagePreview').style.display = 'none';
    document.getElementById('certImagePreview').src = '';
    document.getElementById('certificationForm').style.display = 'block';
    
    // Scroll to form
    document.getElementById('certificationForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Cancel certification form
window.cancelCertificationForm = function() {
    currentEditingCertification = null;
    document.getElementById('certificationForm').style.display = 'none';
}

// Edit certification
window.editCertification = async function(certId) {
    try {
        const response = await fetch('/api/certification');
        if (!response.ok) throw new Error('Failed to fetch certifications');
        
        const certifications = await response.json();
        const cert = certifications.find(c => c.id === certId);
        
        if (!cert) {
            alert('인증서를 찾을 수 없습니다.');
            return;
        }
        
        currentEditingCertification = cert;
        document.getElementById('certFormTitle').textContent = '인증서 수정';
        document.getElementById('certName').value = cert.name;
        document.getElementById('certIssuer').value = cert.issuer || '';
        document.getElementById('certIssueDate').value = cert.issueDate || '';
        document.getElementById('certValidUntil').value = cert.validUntil || '';
        document.getElementById('certCategory').value = cert.category;
        
        if (cert.imageData || cert.image) {
            document.getElementById('certImagePreview').src = cert.imageData || cert.image;
            document.getElementById('certImagePreview').style.display = 'block';
        }
        
        document.getElementById('certificationForm').style.display = 'block';
        document.getElementById('certificationForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        alert('인증서 로드 실패: ' + error.message);
    }
}

// Save certification
window.saveCertificationData = async function() {
    try {
        const name = document.getElementById('certName').value.trim();
        const issuer = document.getElementById('certIssuer').value.trim();
        const issueDate = document.getElementById('certIssueDate').value.trim();
        const validUntil = document.getElementById('certValidUntil').value.trim();
        const category = document.getElementById('certCategory').value;
        const imageInput = document.getElementById('certImageInput');
        
        if (!name || !category) {
            alert('필수 항목(인증서명, 카테고리)을 모두 입력해주세요.');
            return;
        }
        
        const certData = {
            id: currentEditingCertification ? currentEditingCertification.id : Date.now().toString(),
            name,
            issuer,
            issueDate,
            validUntil,
            category,
            createdAt: currentEditingCertification ? currentEditingCertification.createdAt : new Date().toISOString()
        };
        
        // Handle image
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            const imageData = await uploadFileToServer(file);
            certData.imageData = imageData;
        } else if (currentEditingCertification && (currentEditingCertification.imageData || currentEditingCertification.image)) {
            certData.imageData = currentEditingCertification.imageData || currentEditingCertification.image;
        }
        
        if (!certData.imageData) {
            alert('인증서 이미지를 선택해주세요.');
            return;
        }
        
        const response = await fetch('/api/certification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(certData)
        });
        
        if (!response.ok) throw new Error('Failed to save certification');
        
        alert('✅ 인증서가 저장되었습니다.');
        cancelCertificationForm();
        loadCertificationsList();
        
    } catch (error) {
        alert('❌ 인증서 저장 실패: ' + error.message);
    }
}

// Delete certification
window.deleteCertificationItem = async function(certId) {
    if (!confirm('정말 이 인증서를 삭제하시겠습니까?')) return;
    
    try {
        const response = await fetch(`/api/certification/${certId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete certification');
        
        alert('✅ 인증서가 삭제되었습니다.');
        loadCertificationsList();
        
    } catch (error) {
        alert('❌ 인증서 삭제 실패: ' + error.message);
    }
}

// Image upload handling for certifications
document.getElementById('certImageArea').addEventListener('click', function() {
    document.getElementById('certImageInput').click();
});

document.getElementById('certImageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            document.getElementById('certImagePreview').src = event.target.result;
            document.getElementById('certImagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Load certifications when section is active
document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.getAttribute('data-section');
        if (section === 'certifications') {
            loadCertificationsList();
        }
    });
});

