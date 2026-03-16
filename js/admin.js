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
            
            // Load section-specific data when section opens
            handleSectionLoad(section);
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

    // Setup product image upload
    setupProductImageUpload();

    // Setup certification image upload
    const certImageArea = document.getElementById('certImageArea');
    const certImageInput = document.getElementById('certImageInput');
    const certImagePreview = document.getElementById('certImagePreview');
    
    if (certImageArea && certImageInput) {
        certImageArea.addEventListener('click', function() {
            certImageInput.click();
        });
        
        certImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (certImagePreview) {
                        certImagePreview.src = event.target.result;
                        certImagePreview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Setup page logo upload
    const pageLogoInput = document.getElementById('pageLogoInput');
    if (pageLogoInput) {
        pageLogoInput.addEventListener('change', async (e) => {
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

    // Setup page hero media upload
    const pageHeroUploadArea = document.getElementById('pageHeroUploadArea');
    const pageHeroMediaInput = document.getElementById('pageHeroMediaInput');
    
    if (pageHeroUploadArea && pageHeroMediaInput) {
        pageHeroUploadArea.addEventListener('click', (e) => {
            if (!e.target.closest('.preview-grid')) {
                pageHeroMediaInput.click();
            }
        });
        
        pageHeroMediaInput.addEventListener('change', handlePageMediaFiles);
        
        pageHeroUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            pageHeroUploadArea.style.borderColor = '#007bff';
            pageHeroUploadArea.style.background = '#f0f8ff';
        });
        
        pageHeroUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            pageHeroUploadArea.style.borderColor = '#007bff';
            pageHeroUploadArea.style.background = '';
        });
        
        pageHeroUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            pageHeroUploadArea.style.borderColor = '#007bff';
            pageHeroUploadArea.style.background = '';
            
            const files = Array.from(e.dataTransfer.files).filter(f => 
                f.type.startsWith('image/') || f.type.startsWith('video/')
            );
            
            if (files.length > 0) {
                pageHeroMediaInput.files = e.dataTransfer.files;
                handlePageMediaFiles({ target: { files } });
            }
        });
    }

    // Handle logo upload
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

    // Load initial data - 공지사항을 기본으로 로드
    handleSectionLoad('notices');
}

// Handle section-specific data loading
function handleSectionLoad(section) {
    switch(section) {
        case 'hero-slider':
            loadHeroSliderList();
            loadSliderSettings();
            break;
        case 'page-heroes':
            loadPageHeroes();
            break;
        case 'products':
            loadProductsList();
            loadProductCategories();
            loadProductMaterials();
            break;
        case 'certifications':
            loadCertificationsList();
            loadCertCategories();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'samples':
            loadSamplesList();
            break;
        case 'notices':
            loadNotices();
            break;
    }
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

// Load product categories into select
async function loadProductCategories() {
    try {
        const categories = await window.getAllCategories();
        const select = document.getElementById('productCategory');
        
        // Keep first option (선택하세요)
        select.innerHTML = '<option value="">선택하세요</option>';
        
        // Add categories
        categories.products.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.name} (${cat.nameKo})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load product categories:', error);
    }
}

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
                // Get components materials
                const materials = product.components?.map(c => c.material).join(', ') || '-';
                
                html += `
                    <div class="product-item" style="background: white; border: 1px solid #e0e0e0; border-radius: 12px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <div style="width: 100%; padding-top: 100%; position: relative; overflow: hidden; border-radius: 8px; background: #f8f9fa; margin-bottom: 12px;">
                            <img src="${product.imageData || product.image}" alt="${product.code}" 
                                 style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 90%; height: 90%; object-fit: contain;">
                        </div>
                        <h4 style="margin: 0 0 5px 0; font-size: 1rem; color: #333;">${product.code}</h4>
                        <p style="color: #555; font-weight: 500; margin: 5px 0;">${product.volume || '-'}</p>
                        ${product.diameter ? `<p style="color: #666; font-size: 0.85rem; margin: 3px 0;">Ø ${product.diameter}mm</p>` : ''}
                        <p style="color: #888; font-size: 0.8rem; margin: 3px 0;">${materials}</p>
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
window.showProductForm = async function() {
    currentEditingProduct = null;
    document.getElementById('formTitle').textContent = '새 제품 추가';
    
    // Reset basic info fields
    document.getElementById('productCode').value = '';
    document.getElementById('productVolume').value = '';
    document.getElementById('productDiameter').value = '';
    document.getElementById('productBodySize').value = '';
    document.getElementById('productTotalHeight').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productAssembly').value = '';
    document.getElementById('productDeliverySet').value = '';
    
    // Reset component checkboxes and materials
    const componentTypes = ['outer_cap', 'inner_cap', 'single_cap', 'lid', 'outer_container', 'inner_container', 'decoration', 'over_cap', 'shoulder', 'pump', 'nameplate', 'cap_decoration', 'cap'];
    componentTypes.forEach(type => {
        const checkbox = document.getElementById('comp_' + type);
        const materialSelect = document.getElementById('material_' + type);
        
        if (checkbox) checkbox.checked = false;
        if (materialSelect) {
            materialSelect.disabled = true;
            materialSelect.value = '';
        }
    });
    
    // Reset images
    document.getElementById('productImagePreview').style.display = 'none';
    document.getElementById('productImagePreview').src = '';
    document.getElementById('productImageInput').value = '';
    
    document.getElementById('productCrossSectionPreview').style.display = 'none';
    document.getElementById('productCrossSectionPreview').src = '';
    document.getElementById('productCrossSectionInput').value = '';
    
    // Load categories and materials
    await loadProductCategories();
    await loadProductMaterials();
    
    // Show form
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
        
        // Load basic info
        document.getElementById('productCode').value = product.code || '';
        document.getElementById('productVolume').value = product.volume || '';
        document.getElementById('productDiameter').value = product.diameter || '';
        document.getElementById('productBodySize').value = product.bodySize || '';
        document.getElementById('productTotalHeight').value = product.totalHeight || '';
        document.getElementById('productAssembly').value = product.assembly || '';
        document.getElementById('productDeliverySet').value = product.deliverySet || '';
        
        // Load images
        if (product.imageData || product.image) {
            document.getElementById('productImagePreview').src = product.imageData || product.image;
            document.getElementById('productImagePreview').style.display = 'block';
        }
        
        if (product.crossSectionImageData) {
            document.getElementById('productCrossSectionPreview').src = product.crossSectionImageData;
            document.getElementById('productCrossSectionPreview').style.display = 'block';
        }
        
        // Load categories and materials FIRST
        await loadProductCategories();
        await loadProductMaterials();
        
        // Set category
        document.getElementById('productCategory').value = product.category || '';
        
        // Load components
        if (product.components && product.components.length > 0) {
            product.components.forEach(comp => {
                const checkbox = document.getElementById('comp_' + comp.type);
                const materialsContainer = document.getElementById('materials_' + comp.type);
                
                if (checkbox && materialsContainer) {
                    // Check the component checkbox
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change'));  // Trigger change event to show materials
                    
                    // Wait for materials to be displayed, then check the material checkboxes
                    setTimeout(() => {
                        // Handle both old (single material) and new (multiple materials) format
                        const materials = comp.materials || (comp.material ? [comp.material] : []);
                        
                        materials.forEach(materialId => {
                            const materialCheckbox = materialsContainer.querySelector(`input[value="${materialId}"]`);
                            if (materialCheckbox) {
                                materialCheckbox.checked = true;
                            }
                        });
                    }, 100);
                }
            });
        }
        
        console.log('Loaded product for edit:', product);
        
        document.getElementById('productForm').style.display = 'block';
        document.getElementById('productForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        alert('제품 로드 실패: ' + error.message);
        console.error('Edit error:', error);
    }
}

// Save product
window.saveProductData = async function() {
    try {
        const code = document.getElementById('productCode').value.trim();
        const volume = document.getElementById('productVolume').value.trim();
        const diameter = document.getElementById('productDiameter').value.trim();
        const bodySize = document.getElementById('productBodySize').value.trim();
        const totalHeight = document.getElementById('productTotalHeight').value.trim();
        const category = document.getElementById('productCategory').value;
        const assembly = document.getElementById('productAssembly').value.trim();
        const deliverySet = document.getElementById('productDeliverySet').value.trim();
        const imageInput = document.getElementById('productImageInput');
        const crossSectionInput = document.getElementById('productCrossSectionInput');
        
        console.log('Saving product:', { code, volume, category });
        
        if (!code || !volume || !category) {
            alert('필수 항목(제품 코드, 용량, 카테고리)을 모두 입력해주세요.');
            return;
        }
        
        // Collect components
        const components = [];
        const componentTypes = ['outer_cap', 'inner_cap', 'single_cap', 'lid', 'outer_container', 'inner_container', 'decoration', 'over_cap', 'shoulder', 'pump', 'nameplate', 'cap_decoration', 'cap'];
        const componentNames = {
            'outer_cap': '외캡',
            'inner_cap': '내캡',
            'single_cap': '단캡',
            'lid': '리드',
            'outer_container': '외용기',
            'inner_container': '내용기',
            'decoration': '알장식',
            'over_cap': '오버캡',
            'shoulder': '숄더',
            'pump': '펌프',
            'nameplate': '명판',
            'cap_decoration': '외캡장식',
            'cap': '캡'
        };
        
        componentTypes.forEach(type => {
            const checkbox = document.getElementById('comp_' + type);
            const materialsContainer = document.getElementById('materials_' + type);
            
            if (checkbox && checkbox.checked && materialsContainer) {
                // Collect all checked materials for this component
                const checkedMaterials = [];
                materialsContainer.querySelectorAll('.material-checkbox:checked').forEach(cb => {
                    checkedMaterials.push(cb.value);
                });
                
                if (checkedMaterials.length > 0) {
                    components.push({
                        type: type,
                        name: componentNames[type],
                        materials: checkedMaterials  // Changed to array
                    });
                }
            }
        });
        
        const productData = {
            id: currentEditingProduct ? currentEditingProduct.id : Date.now().toString(),
            code,
            volume,
            diameter,
            bodySize,
            totalHeight,
            category,
            components,
            assembly,
            deliverySet,
            createdAt: currentEditingProduct ? currentEditingProduct.createdAt : new Date().toISOString()
        };
        
        console.log('📊 Product data collected:', {
            code,
            volume,
            diameter,
            bodySize,
            totalHeight,
            category,
            componentsCount: components.length,
            components,
            assembly: assembly ? 'YES' : 'NO',
            deliverySet: deliverySet ? 'YES' : 'NO'
        });
        
        // Handle main image
        if (imageInput.files && imageInput.files[0]) {
            productData.image = imageInput.files[0];
        } else if (currentEditingProduct && (currentEditingProduct.imageData || currentEditingProduct.image)) {
            productData.imageData = currentEditingProduct.imageData || currentEditingProduct.image;
        } else {
            alert('제품 사진을 선택해주세요.');
            return;
        }
        
        // Handle cross section image (optional)
        if (crossSectionInput.files && crossSectionInput.files[0]) {
            productData.crossSectionImage = crossSectionInput.files[0];
        } else if (currentEditingProduct && currentEditingProduct.crossSectionImageData) {
            productData.crossSectionImageData = currentEditingProduct.crossSectionImageData;
        }
        
        await window.saveProduct(productData);
        
        showToast('✅ 제품이 저장되었습니다!');
        cancelProductForm();
        loadProductsList();
        
    } catch (error) {
        alert('❌ 저장 실패: ' + error.message);
        console.error('Save error:', error);
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
    // Main product image
    const uploadArea = document.getElementById('productImageArea');
    const imageInput = document.getElementById('productImageInput');
    const preview = document.getElementById('productImagePreview');
    
    if (uploadArea && imageInput) {
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
    
    // Cross section image (optional)
    const crossSectionArea = document.getElementById('productCrossSectionArea');
    const crossSectionInput = document.getElementById('productCrossSectionInput');
    const crossSectionPreview = document.getElementById('productCrossSectionPreview');
    
    if (crossSectionArea && crossSectionInput) {
        crossSectionArea.addEventListener('click', () => crossSectionInput.click());
        
        crossSectionInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    crossSectionPreview.src = e.target.result;
                    crossSectionPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Drag and drop for cross section
        crossSectionArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            crossSectionArea.style.borderColor = '#6c757d';
            crossSectionArea.style.background = '#f8f9fa';
        });
        
        crossSectionArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            crossSectionArea.style.borderColor = '#6c757d';
            crossSectionArea.style.background = '';
        });
        
        crossSectionArea.addEventListener('drop', (e) => {
            e.preventDefault();
            crossSectionArea.style.borderColor = '#6c757d';
            crossSectionArea.style.background = '';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                crossSectionInput.files = e.dataTransfer.files;
                const reader = new FileReader();
                reader.onload = (e) => {
                    crossSectionPreview.src = e.target.result;
                    crossSectionPreview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

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

// Load certification categories into select
async function loadCertCategories() {
    try {
        const categories = await window.getAllCategories();
        const select = document.getElementById('certCategory');
        
        // Keep first option (선택하세요)
        select.innerHTML = '<option value="">선택하세요</option>';
        
        // Add categories
        categories.certifications.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.name} (${cat.nameKo})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load certification categories:', error);
    }
}


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
                        ${cert.validUntil && cert.validUntil.trim() ? `<p style="color: #555; font-size: 0.85rem; margin: 3px 0;">유효기간: ${cert.validUntil}</p>` : ''}
                        ${cert.certNumber && cert.certNumber.trim() ? `<p style="color: #555; font-size: 0.85rem; margin: 3px 0;">발급번호: ${cert.certNumber}</p>` : ''}
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
window.showCertificationForm = async function() {
    currentEditingCertification = null;
    document.getElementById('certFormTitle').textContent = '새 인증서 추가';
    document.getElementById('certName').value = '';
    document.getElementById('certIssuer').value = '';
    document.getElementById('certIssueDate').value = '';
    document.getElementById('certValidUntil').value = '';
    document.getElementById('certNumber').value = '';
    document.getElementById('certCategory').value = '';
    document.getElementById('certImagePreview').style.display = 'none';
    document.getElementById('certImagePreview').src = '';
    document.getElementById('certificationForm').style.display = 'block';
    
    // Load categories
    await loadCertCategories();
    
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
        document.getElementById('certNumber').value = cert.certNumber || '';
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
        const certNumber = document.getElementById('certNumber').value.trim();
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
            certNumber,
            category,
            createdAt: currentEditingCertification ? currentEditingCertification.createdAt : new Date().toISOString()
        };
        
        // Handle image
        if (imageInput.files && imageInput.files[0]) {
            certData.image = imageInput.files[0];
        } else if (currentEditingCertification && (currentEditingCertification.imageData || currentEditingCertification.image)) {
            certData.imageData = currentEditingCertification.imageData || currentEditingCertification.image;
        } else {
            alert('인증서 이미지를 선택해주세요.');
            return;
        }
        
        await window.saveCertification(certData);
        
        alert('✅ 인증서가 저장되었습니다!');
        cancelCertificationForm();
        loadCertificationsList();
        
    } catch (error) {
        alert('❌ 저장 실패: ' + error.message);
    }
}

// Delete certification
window.deleteCertificationItem = async function(certId) {
    if (!confirm('정말 이 인증서를 삭제하시겠습니까?')) return;
    
    try {
        await window.deleteCertification(certId);
        alert('✅ 인증서가 삭제되었습니다.');
        loadCertificationsList();
    } catch (error) {
        alert('❌ 삭제 실패: ' + error.message);
    }
}


// ========================================
// CATEGORY MANAGEMENT
// ========================================

let currentCategories = null;

// Load categories
async function loadCategories() {
    try {
        currentCategories = await window.getAllCategories();
        
        // Render products categories
        renderProductCategories();
        
        // Render certification categories
        renderCertCategories();
        
        // Render materials
        renderMaterials();
        
    } catch (error) {
        console.error('Failed to load categories:', error);
        document.getElementById('productCategoriesList').innerHTML = '<p style="color: red; text-align: center; padding: 20px; grid-column: 1/-1;">카테고리를 불러오지 못했습니다.</p>';
        document.getElementById('certCategoriesList').innerHTML = '<p style="color: red; text-align: center; padding: 20px; grid-column: 1/-1;">카테고리를 불러오지 못했습니다.</p>';
        document.getElementById('materialsList').innerHTML = '<p style="color: red; text-align: center; padding: 20px; grid-column: 1/-1;">재질을 불러오지 못했습니다.</p>';
    }
}

// Render product categories
function renderProductCategories() {
    const container = document.getElementById('productCategoriesList');
    
    if (!currentCategories || !currentCategories.products || currentCategories.products.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px; grid-column: 1/-1;">등록된 카테고리가 없습니다.</p>';
        return;
    }
    
    let html = '';
    currentCategories.products.forEach(cat => {
        html += `
            <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: between; align-items: start; gap: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 4px;">${cat.nameKo}</div>
                        <div style="color: #666; font-size: 0.85rem;">${cat.name}</div>
                        <div style="color: #999; font-size: 0.75rem; margin-top: 4px;">ID: ${cat.id}</div>
                    </div>
                    <button onclick="deleteProductCategory('${cat.id}')" style="padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">삭제</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Render certification categories
function renderCertCategories() {
    const container = document.getElementById('certCategoriesList');
    
    if (!currentCategories || !currentCategories.certifications || currentCategories.certifications.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px; grid-column: 1/-1;">등록된 카테고리가 없습니다.</p>';
        return;
    }
    
    let html = '';
    currentCategories.certifications.forEach(cat => {
        html += `
            <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 15px; display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; justify-content: between; align-items: start; gap: 8px;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 4px;">${cat.nameKo}</div>
                        <div style="color: #666; font-size: 0.85rem;">${cat.name}</div>
                        <div style="color: #999; font-size: 0.75rem; margin-top: 4px;">ID: ${cat.id}</div>
                    </div>
                    <button onclick="deleteCertCategory('${cat.id}')" style="padding: 4px 8px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">삭제</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Add product category
window.addProductCategory = async function() {
    try {
        const id = document.getElementById('newProductCategoryId').value.trim();
        const name = document.getElementById('newProductCategoryName').value.trim();
        const nameKo = document.getElementById('newProductCategoryNameKo').value.trim();
        
        if (!id || !name || !nameKo) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        // Check if ID already exists
        if (currentCategories.products.find(c => c.id === id)) {
            alert('이미 존재하는 카테고리 ID입니다.');
            return;
        }
        
        // Add new category
        currentCategories.products.push({ id, name, nameKo });
        
        // Save to server
        await window.saveCategories('products', currentCategories.products);
        
        alert('✅ 카테고리가 추가되었습니다!');
        
        // Clear inputs
        document.getElementById('newProductCategoryId').value = '';
        document.getElementById('newProductCategoryName').value = '';
        document.getElementById('newProductCategoryNameKo').value = '';
        
        // Reload category list display
        renderProductCategories();
        
        // Update product category dropdown immediately
        await loadProductCategories();
        
    } catch (error) {
        alert('❌ 카테고리 추가 실패: ' + error.message);
    }
}

// Delete product category
window.deleteProductCategory = async function(categoryId) {
    if (!confirm('정말 이 카테고리를 삭제하시겠습니까?')) return;
    
    try {
        await window.deleteCategory('products', categoryId);
        
        // Update local cache
        currentCategories.products = currentCategories.products.filter(c => c.id !== categoryId);
        
        alert('✅ 카테고리가 삭제되었습니다.');
        
        // Reload category list display
        renderProductCategories();
        
        // Update product category dropdown immediately
        await loadProductCategories();
        
    } catch (error) {
        alert('❌ 카테고리 삭제 실패: ' + error.message);
    }
}

// Add certification category
window.addCertCategory = async function() {
    try {
        const id = document.getElementById('newCertCategoryId').value.trim();
        const name = document.getElementById('newCertCategoryName').value.trim();
        const nameKo = document.getElementById('newCertCategoryNameKo').value.trim();
        
        if (!id || !name || !nameKo) {
            alert('모든 필드를 입력해주세요.');
            return;
        }
        
        // Check if ID already exists
        if (currentCategories.certifications.find(c => c.id === id)) {
            alert('이미 존재하는 카테고리 ID입니다.');
            return;
        }
        
        // Add new category
        currentCategories.certifications.push({ id, name, nameKo });
        
        // Save to server
        await window.saveCategories('certifications', currentCategories.certifications);
        
        alert('✅ 카테고리가 추가되었습니다!');
        
        // Clear inputs
        document.getElementById('newCertCategoryId').value = '';
        document.getElementById('newCertCategoryName').value = '';
        document.getElementById('newCertCategoryNameKo').value = '';
        
        // Reload category list display
        renderCertCategories();
        
        // Update certification category dropdown immediately
        await loadCertCategories();
        
    } catch (error) {
        alert('❌ 카테고리 추가 실패: ' + error.message);
    }
}

// Delete certification category
window.deleteCertCategory = async function(categoryId) {
    if (!confirm('정말 이 카테고리를 삭제하시겠습니까?')) return;
    
    try {
        await window.deleteCategory('certifications', categoryId);
        
        // Update local cache
        currentCategories.certifications = currentCategories.certifications.filter(c => c.id !== categoryId);
        
        alert('✅ 카테고리가 삭제되었습니다.');
        
        // Reload category list display
        renderCertCategories();
        
        // Update certification category dropdown immediately
        await loadCertCategories();
        
    } catch (error) {
        alert('❌ 카테고리 삭제 실패: ' + error.message);
    }
}

// Render materials
function renderMaterials() {
    const container = document.getElementById('materialsList');
    
    if (!currentCategories || !currentCategories.materials || currentCategories.materials.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center; padding: 20px; grid-column: 1/-1;">등록된 원료가 없습니다. 위 입력창에서 원료를 추가하세요.</p>';
        return;
    }
    
    let html = '';
    currentCategories.materials.forEach(mat => {
        html += `
            <div style="background: white; border: 2px solid #e9ecef; border-radius: 8px; padding: 12px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s;">
                <div style="font-weight: 600; color: #333; font-size: 1rem;">${mat.nameKo || mat.name}</div>
                <button onclick="deleteMaterial('${mat.id}')" style="padding: 6px 12px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 600; transition: all 0.2s;" onmouseover="this.style.background='#c82333'" onmouseout="this.style.background='#dc3545'">🗑️ 삭제</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Add material
window.addMaterial = async function() {
    try {
        const name = document.getElementById('newMaterialName').value.trim();
        
        if (!name) {
            alert('원료명을 입력해주세요.');
            return;
        }
        
        // Initialize materials array if not exists
        if (!currentCategories.materials) {
            currentCategories.materials = [];
        }
        
        // Generate ID from name (lowercase, remove spaces)
        const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        
        // Check if material name already exists
        if (currentCategories.materials.find(m => m.id === id || m.name === name || m.nameKo === name)) {
            alert('이미 존재하는 원료입니다.');
            return;
        }
        
        // Add new material
        currentCategories.materials.push({ 
            id, 
            name, 
            nameKo: name 
        });
        
        // Save to server
        await window.saveCategories('materials', currentCategories.materials);
        
        showToast('✅ 원료가 추가되었습니다!');
        
        // Clear input
        document.getElementById('newMaterialName').value = '';
        
        // Reload materials list display
        renderMaterials();
        
        // Update product material dropdown immediately
        await loadProductMaterials();
        
    } catch (error) {
        alert('❌ 원료 추가 실패: ' + error.message);
    }
}

// Delete material
window.deleteMaterial = async function(materialId) {
    if (!confirm('정말 이 원료를 삭제하시겠습니까?\n\n⚠️ 주의: 이 원료를 사용 중인 제품이 있을 경우 문제가 발생할 수 있습니다.')) return;
    
    try {
        await window.deleteCategory('materials', materialId);
        
        // Update local cache
        currentCategories.materials = currentCategories.materials.filter(m => m.id !== materialId);
        
        showToast('✅ 원료가 삭제되었습니다.');
        
        // Reload materials list display
        renderMaterials();
        
        // Update product material dropdown immediately
        await loadProductMaterials();
        
    } catch (error) {
        alert('❌ 원료 삭제 실패: ' + error.message);
    }
}

// Load product materials as checkboxes
async function loadProductMaterials() {
    try {
        const categories = await window.getAllCategories();
        
        // Load materials for all component checkboxes
        const componentTypes = ['outer_cap', 'inner_cap', 'single_cap', 'lid', 'outer_container', 'inner_container', 'decoration', 'over_cap', 'shoulder', 'pump', 'nameplate', 'cap_decoration', 'cap'];
        
        componentTypes.forEach(type => {
            const container = document.getElementById('materials_' + type);
            
            if (container && categories.materials && categories.materials.length > 0) {
                container.innerHTML = '';
                
                categories.materials.forEach(mat => {
                    const checkboxWrapper = document.createElement('div');
                    checkboxWrapper.style.cssText = 'display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:6px;background:#f8f9fa;margin-bottom:6px;';
                    
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = `mat_${type}_${mat.id}`;
                    checkbox.value = mat.id;
                    checkbox.className = 'material-checkbox';
                    checkbox.dataset.component = type;
                    checkbox.style.cssText = 'width:18px;height:18px;cursor:pointer;';
                    
                    const label = document.createElement('label');
                    label.htmlFor = `mat_${type}_${mat.id}`;
                    label.textContent = mat.nameKo || mat.name || mat.id;
                    label.style.cssText = 'margin:0;font-size:0.95rem;cursor:pointer;flex:1;';
                    
                    checkboxWrapper.appendChild(checkbox);
                    checkboxWrapper.appendChild(label);
                    container.appendChild(checkboxWrapper);
                });
            }
        });
        
        // Setup checkbox event listeners
        setupComponentCheckboxes();
        
        console.log('✅ Loaded material checkboxes for all components');
    } catch (error) {
        console.error('Failed to load materials:', error);
    }
}

// Setup component checkbox event listeners
function setupComponentCheckboxes() {
    const componentTypes = ['outer_cap', 'inner_cap', 'single_cap', 'lid', 'outer_container', 'inner_container', 'decoration', 'over_cap', 'shoulder', 'pump', 'nameplate', 'cap_decoration', 'cap'];
    
    componentTypes.forEach(type => {
        const checkbox = document.getElementById('comp_' + type);
        const materialsContainer = document.getElementById('materials_' + type);
        
        if (checkbox && materialsContainer) {
            // Remove existing listener if any
            checkbox.replaceWith(checkbox.cloneNode(true));
            const newCheckbox = document.getElementById('comp_' + type);
            
            // Add new listener
            newCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    materialsContainer.style.display = 'block';
                    materialsContainer.parentElement.style.borderColor = '#667eea';
                    materialsContainer.parentElement.style.backgroundColor = '#f8f9ff';
                } else {
                    materialsContainer.style.display = 'none';
                    // Uncheck all material checkboxes
                    materialsContainer.querySelectorAll('.material-checkbox').forEach(cb => cb.checked = false);
                    materialsContainer.parentElement.style.borderColor = '#e0e0e0';
                    materialsContainer.parentElement.style.backgroundColor = 'transparent';
                }
            });
        }
    });
    
    console.log('✅ Setup component checkbox listeners');
}

// ========== SAMPLE REQUESTS MANAGEMENT ==========

// Load samples list
// Store samples data globally for detail popup
let allSamplesData = [];
let currentSamplePage = 1;
const samplesPerPage = 10;

async function loadSamplesList(page = 1) {
    try {
        const samples = await window.getAllSamples();
        allSamplesData = samples; // Store for detail view
        currentSamplePage = page;
        const container = document.getElementById('samplesList');
        
        if (!samples || samples.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">샘플 신청 내역이 없습니다.</p>';
            return;
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(samples.length / samplesPerPage);
        const startIndex = (page - 1) * samplesPerPage;
        const endIndex = startIndex + samplesPerPage;
        const paginatedSamples = samples.slice(startIndex, endIndex);
        
        // Table-style list view
        let html = `
            <table style="width: 100%; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 20px;">
                <thead>
                    <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <th style="padding: 15px; text-align: left; font-weight: 600;">No</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600;">회사명</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600;">담당자</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600;">제품</th>
                        <th style="padding: 15px; text-align: center; font-weight: 600;">상태</th>
                        <th style="padding: 15px; text-align: center; font-weight: 600;">제공여부</th>
                        <th style="padding: 15px; text-align: left; font-weight: 600;">신청일</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        paginatedSamples.forEach((sample, index) => {
            const globalIndex = startIndex + index;
            const statusBadge = {
                'pending': '<span style="background: #ffc107; color: #000; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">대기중</span>',
                'approved': '<span style="background: #28a745; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">승인</span>',
                'rejected': '<span style="background: #dc3545; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">거절</span>',
                'completed': '<span style="background: #6c757d; color: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">완료</span>'
            };
            
            const providedBadge = sample.provided ? 
                '<span style="background: #17a2b8; color: #fff; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">✓</span>' : 
                '<span style="background: #e9ecef; color: #6c757d; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 600;">✗</span>';
            
            html += `
                <tr onclick="showSampleDetail('${sample.id}')" style="cursor: pointer; border-bottom: 1px solid #eee; transition: background 0.2s;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
                    <td style="padding: 15px; color: #666;">${samples.length - globalIndex}</td>
                    <td style="padding: 15px; color: #333; font-weight: 600;">${sample.company}</td>
                    <td style="padding: 15px; color: #666;">${sample.name}</td>
                    <td style="padding: 15px; color: #666;">${sample.product?.code || '-'}</td>
                    <td style="padding: 15px; text-align: center;">${statusBadge[sample.status] || statusBadge['pending']}</td>
                    <td style="padding: 15px; text-align: center;">${providedBadge}</td>
                    <td style="padding: 15px; color: #999; font-size: 0.9rem;">${new Date(sample.createdAt).toLocaleDateString('ko-KR')}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        
        // Add pagination if needed
        if (totalPages > 1) {
            html += '<div style="display: flex; justify-content: center; align-items: center; gap: 8px; padding: 20px;">';
            
            // Previous button
            if (page > 1) {
                html += `<button onclick="loadSamplesList(${page - 1})" style="padding: 8px 12px; background: white; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; color: #666; font-weight: 600; transition: all 0.2s;">‹</button>`;
            }
            
            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                if (
                    i === 1 || // First page
                    i === totalPages || // Last page
                    (i >= page - 2 && i <= page + 2) // Pages around current
                ) {
                    const isActive = i === page;
                    html += `
                        <button onclick="loadSamplesList(${i})" 
                                style="padding: 8px 14px; 
                                       background: ${isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'}; 
                                       border: ${isActive ? 'none' : '1px solid #ddd'}; 
                                       border-radius: 6px; 
                                       cursor: pointer; 
                                       color: ${isActive ? 'white' : '#666'}; 
                                       font-weight: ${isActive ? '700' : '600'}; 
                                       transition: all 0.2s;
                                       box-shadow: ${isActive ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none'};">
                            ${i}
                        </button>
                    `;
                } else if (i === page - 3 || i === page + 3) {
                    html += '<span style="color: #999; padding: 0 5px;">...</span>';
                }
            }
            
            // Next button
            if (page < totalPages) {
                html += `<button onclick="loadSamplesList(${page + 1})" style="padding: 8px 12px; background: white; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; color: #666; font-weight: 600; transition: all 0.2s;">›</button>`;
            }
            
            html += '</div>';
            
            // Page info
            html += `<p style="text-align: center; color: #999; font-size: 0.9rem; margin-top: 10px;">전체 ${samples.length}개 중 ${startIndex + 1}-${Math.min(endIndex, samples.length)}개 표시 (${page}/${totalPages} 페이지)</p>`;
        }
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Failed to load samples:', error);
        document.getElementById('samplesList').innerHTML = '<p style="color: #dc3545; text-align: center; padding: 40px;">샘플 신청 내역을 불러오지 못했습니다.</p>';
    }
}

// Show sample detail in modal
window.showSampleDetail = function(sampleId) {
    const sample = allSamplesData.find(s => s.id === sampleId);
    if (!sample) return;
    
    const statusBadge = {
        'pending': '<span style="background: #ffc107; color: #000; padding: 6px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">대기중</span>',
        'approved': '<span style="background: #28a745; color: #fff; padding: 6px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">승인</span>',
        'rejected': '<span style="background: #dc3545; color: #fff; padding: 6px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">거절</span>',
        'completed': '<span style="background: #6c757d; color: #fff; padding: 6px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">완료</span>'
    };
    
    const providedBadge = sample.provided ? 
        '<span style="background: #17a2b8; color: #fff; padding: 6px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">제공완료</span>' : 
        '<span style="background: #e9ecef; color: #6c757d; padding: 6px 16px; border-radius: 12px; font-size: 0.9rem; font-weight: 600;">미제공</span>';
    
    const modalContent = `
        <div style="padding: 30px; max-height: 80vh; overflow-y: auto;">
            <div style="margin-bottom: 25px;">
                <h2 style="margin: 0 0 15px 0; font-size: 1.8rem; color: #333;">${sample.company} - ${sample.name}</h2>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    ${statusBadge[sample.status] || statusBadge['pending']}
                    ${providedBadge}
                </div>
                <p style="color: #999; font-size: 0.95rem; margin: 0;">신청일: ${new Date(sample.createdAt).toLocaleString('ko-KR')}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
                    <h3 style="font-size: 1.1rem; color: #333; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                        📞 연락처 정보
                    </h3>
                    <p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>전화:</strong> ${sample.phone}</p>
                    <p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>이메일:</strong> ${sample.email}</p>
                    <p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>주소:</strong> ${sample.address || '-'}</p>
                </div>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px;">
                    <h3 style="font-size: 1.1rem; color: #333; margin: 0 0 15px 0; display: flex; align-items: center; gap: 8px;">
                        📦 제품 정보
                    </h3>
                    <p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>제품 코드:</strong> ${sample.product?.code || '-'}</p>
                    <p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>용량:</strong> ${sample.product?.volume || '-'}</p>
                    ${sample.product?.diameter ? `<p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>직경:</strong> ${sample.product.diameter}mm</p>` : ''}
                    ${sample.product?.bodySize ? `<p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>BODY SIZE:</strong> ${sample.product.bodySize}mm</p>` : ''}
                    ${sample.product?.totalHeight ? `<p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>TOTAL HEIGHT:</strong> ${sample.product.totalHeight}mm</p>` : ''}
                    ${sample.product?.components ? `<p style="margin: 8px 0; color: #666; line-height: 1.6;"><strong>부품/재질:</strong> ${sample.product.components.map(c => {
                        const mats = c.materials || (c.material ? [c.material] : []);
                        return `${c.name}: ${mats.join(', ')}`;
                    }).join(' / ')}</p>` : ''}
                </div>
            </div>
            
            ${sample.message ? `
                <div style="background: #fff8e1; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
                    <h3 style="font-size: 1.1rem; color: #f57c00; margin: 0 0 12px 0;">💬 문의 내용</h3>
                    <p style="margin: 0; color: #666; white-space: pre-wrap; line-height: 1.8;">${sample.message}</p>
                </div>
            ` : ''}
            
            ${sample.adminMemo ? `
                <div style="background: #e7f3ff; padding: 20px; border-radius: 12px; margin-bottom: 15px; border-left: 4px solid #007bff;">
                    <h3 style="font-size: 1.05rem; color: #007bff; margin: 0 0 12px 0;">📝 업체 피드백 메모</h3>
                    <p style="margin: 0; color: #495057; white-space: pre-wrap; line-height: 1.8;">${sample.adminMemo}</p>
                </div>
            ` : ''}
            
            ${sample.historyMemo ? `
                <div style="background: #f3e7ff; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #6f42c1;">
                    <h3 style="font-size: 1.05rem; color: #6f42c1; margin: 0 0 12px 0;">📋 이력 메모</h3>
                    <p style="margin: 0; color: #495057; white-space: pre-wrap; line-height: 1.8;">${sample.historyMemo}</p>
                </div>
            ` : ''}
            
            <!-- Action Buttons Section -->
            <div style="border-top: 2px solid #f0f0f0; padding-top: 25px; margin-top: 25px;">
                <!-- Status Change Section -->
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 0.95rem; color: #666; font-weight: 600;">상태 변경</h4>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        <button onclick="updateSampleStatus('${sample.id}', 'approved'); closeSampleDetail();" 
                                style="padding: 12px 20px; background: ${sample.status === 'approved' ? '#28a745' : '#fff'}; 
                                       color: ${sample.status === 'approved' ? '#fff' : '#28a745'}; 
                                       border: 2px solid #28a745; border-radius: 10px; cursor: pointer; 
                                       font-size: 0.95rem; font-weight: 600; transition: all 0.2s;
                                       box-shadow: ${sample.status === 'approved' ? '0 2px 8px rgba(40, 167, 69, 0.3)' : 'none'};">
                            ✅ 승인
                        </button>
                        <button onclick="updateSampleStatus('${sample.id}', 'rejected'); closeSampleDetail();" 
                                style="padding: 12px 20px; background: ${sample.status === 'rejected' ? '#dc3545' : '#fff'}; 
                                       color: ${sample.status === 'rejected' ? '#fff' : '#dc3545'}; 
                                       border: 2px solid #dc3545; border-radius: 10px; cursor: pointer; 
                                       font-size: 0.95rem; font-weight: 600; transition: all 0.2s;
                                       box-shadow: ${sample.status === 'rejected' ? '0 2px 8px rgba(220, 53, 69, 0.3)' : 'none'};">
                            ❌ 거절
                        </button>
                        <button onclick="updateSampleStatus('${sample.id}', 'completed'); closeSampleDetail();" 
                                style="padding: 12px 20px; background: ${sample.status === 'completed' ? '#6c757d' : '#fff'}; 
                                       color: ${sample.status === 'completed' ? '#fff' : '#6c757d'}; 
                                       border: 2px solid #6c757d; border-radius: 10px; cursor: pointer; 
                                       font-size: 0.95rem; font-weight: 600; transition: all 0.2s;
                                       box-shadow: ${sample.status === 'completed' ? '0 2px 8px rgba(108, 117, 125, 0.3)' : 'none'};">
                            ✔️ 완료
                        </button>
                    </div>
                </div>
                
                <!-- Sample Provided Toggle -->
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 0.95rem; color: #666; font-weight: 600;">샘플 제공 여부</h4>
                    <button onclick="toggleSampleProvided('${sample.id}', ${!sample.provided}); closeSampleDetail();" 
                            style="width: 100%; padding: 12px 20px; background: ${sample.provided ? '#17a2b8' : '#fff'}; 
                                   color: ${sample.provided ? '#fff' : '#17a2b8'}; 
                                   border: 2px solid #17a2b8; border-radius: 10px; cursor: pointer; 
                                   font-size: 0.95rem; font-weight: 600; transition: all 0.2s;
                                   box-shadow: ${sample.provided ? '0 2px 8px rgba(23, 162, 184, 0.3)' : 'none'};">
                        📦 ${sample.provided ? '제공완료 ✓' : '미제공 → 제공완료로 변경'}
                    </button>
                </div>
                
                <!-- Memo Buttons -->
                <div style="margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 0.95rem; color: #666; font-weight: 600;">메모 관리</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="closeSampleDetail(); addAdminMemo('${sample.id}', \`${(sample.adminMemo || '').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);" 
                                style="padding: 12px 20px; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); 
                                       color: white; border: none; border-radius: 10px; cursor: pointer; 
                                       font-size: 0.95rem; font-weight: 600; transition: all 0.2s;
                                       box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);">
                            📝 업체 피드백 메모
                        </button>
                        <button onclick="closeSampleDetail(); addHistoryMemo('${sample.id}', \`${(sample.historyMemo || '').replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);" 
                                style="padding: 12px 20px; background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%); 
                                       color: white; border: none; border-radius: 10px; cursor: pointer; 
                                       font-size: 0.95rem; font-weight: 600; transition: all 0.2s;
                                       box-shadow: 0 2px 8px rgba(111, 66, 193, 0.3);">
                            📋 이력 메모
                        </button>
                    </div>
                </div>
                
                <!-- Delete Button -->
                <button onclick="if(confirm('정말 이 샘플 신청을 삭제하시겠습니까?')) { deleteSampleRequest('${sample.id}', true); closeSampleDetail(); }" 
                        style="width: 100%; padding: 12px 20px; background: #fff; color: #dc3545; 
                               border: 2px solid #dc3545; border-radius: 10px; cursor: pointer; 
                               font-size: 0.95rem; font-weight: 600; transition: all 0.2s;">
                    🗑️ 삭제
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('sampleDetailContent').innerHTML = modalContent;
    document.getElementById('sampleDetailModal').style.display = 'block';
}

window.closeSampleDetail = function() {
    document.getElementById('sampleDetailModal').style.display = 'none';
}

// Update sample status
window.updateSampleStatus = async function(sampleId, newStatus) {
    try {
        await window.updateSample(sampleId, { status: newStatus });
        
        const statusText = {
            'approved': '승인',
            'rejected': '거절',
            'completed': '완료',
            'pending': '대기중'
        };
        
        showToast(`✅ 상태가 "${statusText[newStatus]}"(으)로 변경되었습니다.`);
        loadSamplesList(currentSamplePage);
    } catch (error) {
        alert('❌ 상태 변경 실패: ' + error.message);
    }
}

// Toggle sample provided status
window.toggleSampleProvided = async function(sampleId, provided) {
    try {
        await window.updateSample(sampleId, { provided: provided });
        showToast(`✅ ${provided ? '제공완료' : '미제공'}로 변경되었습니다.`);
        loadSamplesList(currentSamplePage);
    } catch (error) {
        alert('❌ 상태 변경 실패: ' + error.message);
    }
}

// Show toast notification
function showToast(message, color = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add admin memo
let currentMemoSampleId = null;
let currentMemoType = null;

window.addAdminMemo = async function(sampleId, currentMemo) {
    currentMemoSampleId = sampleId;
    currentMemoType = 'admin';
    
    document.getElementById('memoModalTitle').textContent = '📝 업체 피드백 메모';
    document.getElementById('memoTextarea').value = currentMemo || '';
    document.getElementById('memoModal').style.display = 'block';
    document.getElementById('memoTextarea').focus();
}

// Add history memo
window.addHistoryMemo = async function(sampleId, currentMemo) {
    currentMemoSampleId = sampleId;
    currentMemoType = 'history';
    
    document.getElementById('memoModalTitle').textContent = '📋 이력 메모';
    document.getElementById('memoTextarea').value = currentMemo || '';
    document.getElementById('memoModal').style.display = 'block';
    document.getElementById('memoTextarea').focus();
}

// Close memo modal
window.closeMemoModal = function() {
    document.getElementById('memoModal').style.display = 'none';
    currentMemoSampleId = null;
    currentMemoType = null;
}

// Save memo
window.saveMemo = async function() {
    const memoText = document.getElementById('memoTextarea').value.trim();
    
    if (!currentMemoSampleId || !currentMemoType) return;
    
    try {
        const updateData = currentMemoType === 'admin' 
            ? { adminMemo: memoText }
            : { historyMemo: memoText };
            
        await window.updateSample(currentMemoSampleId, updateData);
        
        showToast('✅ 메모가 저장되었습니다.');
        
        closeMemoModal();
        loadSamplesList(currentSamplePage);
    } catch (error) {
        alert('❌ 메모 저장 실패: ' + error.message);
    }
}

// Close modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (document.getElementById('memoModal').style.display === 'block') {
            closeMemoModal();
        }
        if (document.getElementById('sampleDetailModal').style.display === 'block') {
            closeSampleDetail();
        }
    }
});

// Close modal on background click
document.getElementById('memoModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeMemoModal();
    }
});

document.getElementById('sampleDetailModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
        closeSampleDetail();
    }
});

// Delete sample request
window.deleteSampleRequest = async function(sampleId, skipConfirm = false) {
    if (!skipConfirm && !confirm('정말 이 샘플 신청을 삭제하시겠습니까?')) return;
    
    try {
        await window.deleteSample(sampleId);
        showToast('✅ 샘플 신청이 삭제되었습니다.', 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)');
        
        // If current page becomes empty after delete, go to previous page
        const totalItems = allSamplesData.length - 1; // After deletion
        const totalPages = Math.ceil(totalItems / samplesPerPage);
        const newPage = currentSamplePage > totalPages ? Math.max(1, totalPages) : currentSamplePage;
        
        loadSamplesList(newPage);
    } catch (error) {
        alert('❌ 삭제 실패: ' + error.message);
    }
}
