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
        const existing = await window.getHeroSliderMedia();
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
    
    const mediaItems = await window.getHeroSliderMedia();
    
    if (mediaItems.length === 0) {
        list.innerHTML = '<p style="color: #999;">등록된 슬라이더가 없습니다.</p>';
        return;
    }
    
    list.innerHTML = '';
    mediaItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 15px; display: flex; gap: 15px; align-items: center;';
        
        if (item.mediaType === 'video') {
            itemDiv.innerHTML = `
                <video src="${item.data}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;" controls></video>
                <div style="flex: 1;">
                    <p><strong>🎥 동영상 ${index + 1}</strong></p>
                    <p style="color: #666; font-size: 14px;">${item.filename || 'video'}</p>
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="moveItemUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn btn-secondary" onclick="moveItemDown(${index})" ${index === mediaItems.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn btn-secondary" onclick="deleteHeroMedia('${item.id}')">삭제</button>
                </div>
            `;
        } else {
            itemDiv.innerHTML = `
                <img src="${item.data}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;">
                <div style="flex: 1;">
                    <p><strong>📷 이미지 ${index + 1}</strong></p>
                    <p style="color: #666; font-size: 14px;">${item.filename || 'image'}</p>
                </div>
                <div>
                    <button class="btn btn-secondary" onclick="moveItemUp(${index})" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn btn-secondary" onclick="moveItemDown(${index})" ${index === mediaItems.length - 1 ? 'disabled' : ''}>↓</button>
                    <button class="btn btn-secondary" onclick="deleteHeroMedia('${item.id}')">삭제</button>
                </div>
            `;
        }
        
        list.appendChild(itemDiv);
    });
}

// Move item up in saved list
window.moveItemUp = async function(index) {
    const items = await window.getHeroSliderMedia();
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
    const items = await window.getHeroSliderMedia();
    if (index >= items.length - 1) return;
    
    // Swap order_index
    const temp = items[index].order_index;
    items[index].order_index = items[index + 1].order_index;
    items[index + 1].order_index = temp;
    
    await window.updateItemOrder(items[index].id, items[index].order_index);
    await window.updateItemOrder(items[index + 1].id, items[index + 1].order_index);
    
    loadHeroSliderList();
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

// Delete hero media by ID
window.deleteHeroMediaById = async function(id) {
    const response = await fetch(`/api/hero?id=${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete hero media');
    }
    
    return await response.json();
}

// Get all hero slider media
window.getHeroSliderMedia = async function() {
    const response = await fetch('/api/hero');
    if (!response.ok) {
        throw new Error('Failed to fetch hero media');
    }
    const items = await response.json();
    return items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
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
        'contact': 'CONTACT'
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
        uploadArea.style.borderColor = '#007b