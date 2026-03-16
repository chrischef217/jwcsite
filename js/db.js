// Use Cloudflare KV via Pages Function
const API_ENDPOINT = '/api/hero';

// Helper: Compress image
async function compressImage(file, maxWidth = 1920, quality = 0.9) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Helper: Convert video to base64
async function videoToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

// Save hero slider media (append mode)
async function saveHeroMediaToDB(mediaFiles, startIndex = 0) {
    try {
        console.log('💾 저장 시작:', mediaFiles.length, '개 파일');
        
        // Upload new files starting from startIndex
        for (let i = 0; i < mediaFiles.length; i++) {
            const mediaFile = mediaFiles[i];
            
            console.log(`📤 업로드 중 ${i + 1}/${mediaFiles.length}: ${mediaFile.name}`);
            
            let mediaData;
            let mediaType;
            
            if (mediaFile.type.startsWith('image/')) {
                mediaData = await compressImage(mediaFile);
                mediaType = 'image';
            } else if (mediaFile.type.startsWith('video/')) {
                mediaData = await videoToBase64(mediaFile);
                mediaType = 'video';
            }
            
            await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: mediaFile.name,
                    data: mediaData,
                    mediaType: mediaType,
                    order_index: startIndex + i
                })
            });
        }
        
        console.log('✅ 모든 파일 업로드 완료');
        return true;
    } catch (error) {
        console.error('❌ 저장 실패:', error);
        throw error;
    }
}

// Get hero slider media
async function getHeroSliderMedia() {
    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        return data.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
    } catch (error) {
        console.error('❌ 불러오기 실패:', error);
        return [];
    }
}

// Delete hero media by id
async function deleteHeroMediaById(id) {
    try {
        await fetch(`${API_ENDPOINT}?id=${id}`, { method: 'DELETE' });
        return true;
    } catch (error) {
        console.error('❌ 삭제 실패:', error);
        throw error;
    }
}

// Update item order
async function updateItemOrder(id, order_index) {
    try {
        await fetch(`${API_ENDPOINT}?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_index })
        });
        return true;
    } catch (error) {
        console.error('❌ 순서 수정 실패:', error);
        throw error;
    }
}

// Get slider settings
async function getSliderSettings() {
    try {
        const response = await fetch('/api/hero/settings');
        return await response.json();
    } catch (error) {
        console.error('❌ 설정 불러오기 실패:', error);
        return { text: '' };
    }
}

// Save slider settings
async function saveSliderSettings(settings) {
    try {
        await fetch('/api/hero/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        return true;
    } catch (error) {
        console.error('❌ 설정 저장 실패:', error);
        throw error;
    }
}

// ========== PRODUCT MANAGEMENT ==========

// Get all products
async function getAllProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to load products:', error);
        return [];
    }
}

// Save product (create or update)
async function saveProduct(productData) {
    try {
        console.log('💾 Saving product:', productData.name);
        
        // Compress image if it's a file
        if (productData.image && productData.image instanceof File) {
            productData.imageData = await compressImage(productData.image, 800, 0.85);
        }
        
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: productData.id || Date.now().toString(),
                name: productData.name,
                model: productData.model,
                size: productData.size,
                volume: productData.volume,
                category: productData.category,
                material: productData.material,
                imageData: productData.imageData || productData.image,
                createdAt: productData.createdAt || new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Failed to save product');
        
        const result = await response.json();
        console.log('✅ Product saved:', result);
        return result;
    } catch (error) {
        console.error('❌ Failed to save product:', error);
        throw error;
    }
}

// Delete product
async function deleteProduct(productId) {
    try {
        console.log('🗑️ Deleting product:', productId);
        
        const response = await fetch(`/api/products?id=${productId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete product');
        
        console.log('✅ Product deleted');
        return true;
    } catch (error) {
        console.error('❌ Failed to delete product:', error);
        throw error;
    }
}

// ========== PAGE HERO SLIDERS ==========

// Get page hero slider (about, products, contact)
async function getPageHeroSlider(pageName) {
    try {
        const response = await fetch(`/api/hero/page/${pageName}`);
        if (!response.ok) throw new Error('Failed to fetch page hero');
        return await response.json();
    } catch (error) {
        console.error(`❌ Failed to load ${pageName} hero:`, error);
        return { media: [], settings: {} };
    }
}

// Save page hero media
async function savePageHeroMedia(pageName, mediaFiles, startIndex = 0) {
    try {
        console.log(`💾 Saving ${pageName} hero media:`, mediaFiles.length, 'files');
        
        for (let i = 0; i < mediaFiles.length; i++) {
            const file = mediaFiles[i];
            const isVideo = file.type.startsWith('video/');
            
            let mediaData;
            if (isVideo) {
                mediaData = await videoToBase64(file);
            } else {
                mediaData = await compressImage(file);
            }
            
            const response = await fetch(`/api/hero/page/${pageName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mediaType: isVideo ? 'video' : 'image',
                    data: mediaData,
                    order_index: startIndex + i
                })
            });
            
            if (!response.ok) throw new Error('Failed to save media');
        }
        
        console.log('✅ Media saved');
        return true;
    } catch (error) {
        console.error('❌ Failed to save page hero media:', error);
        throw error;
    }
}

// Delete page hero media item
async function deletePageHeroMedia(pageName, mediaId) {
    try {
        const response = await fetch(`/api/hero/page/${pageName}/${mediaId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete media');
        return true;
    } catch (error) {
        console.error('❌ Failed to delete page hero media:', error);
        throw error;
    }
}

// Update page hero order
async function updatePageHeroOrder(pageName, mediaId, newOrder) {
    try {
        const response = await fetch(`/api/hero/page/${pageName}/${mediaId}/order`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_index: newOrder })
        });
        if (!response.ok) throw new Error('Failed to update order');
        return true;
    } catch (error) {
        console.error('❌ Failed to update order:', error);
        throw error;
    }
}

// Save page hero settings (text, logo)
async function savePageHeroSettings(pageName, settings) {
    try {
        const response = await fetch(`/api/hero/page/${pageName}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        if (!response.ok) throw new Error('Failed to save settings');
        return true;
    } catch (error) {
        console.error('❌ Failed to save page hero settings:', error);
        throw error;
    }
}

// Expose functions globally
window.saveHeroMediaToDB = saveHeroMediaToDB;
window.getHeroSliderMedia = getHeroSliderMedia;
window.deleteHeroMediaById = deleteHeroMediaById;
window.updateItemOrder = updateItemOrder;
window.getSliderSettings = getSliderSettings;
window.saveSliderSettings = saveSliderSettings;
window.getAllProducts = getAllProducts;
window.saveProduct = saveProduct;
window.deleteProduct = deleteProduct;
window.getPageHeroSlider = getPageHeroSlider;
window.savePageHeroMedia = savePageHeroMedia;
window.deletePageHeroMedia = deletePageHeroMedia;
window.updatePageHeroOrder = updatePageHeroOrder;
window.savePageHeroSettings = savePageHeroSettings;

// ========== CERTIFICATION MANAGEMENT ==========

// Get all certifications
async function getAllCertifications() {
    try {
        const response = await fetch('/api/certification');
        if (!response.ok) throw new Error('Failed to fetch certifications');
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to load certifications:', error);
        return [];
    }
}

// Save certification (create or update)
async function saveCertification(certData) {
    try {
        console.log('💾 Saving certification:', certData.name);
        
        // Compress image if it's a file
        if (certData.image && certData.image instanceof File) {
            certData.imageData = await compressImage(certData.image, 800, 0.85);
        }
        
        const response = await fetch('/api/certification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: certData.id || Date.now().toString(),
                name: certData.name,
                issuer: certData.issuer,
                issueDate: certData.issueDate,
                validUntil: certData.validUntil,
                certNumber: certData.certNumber,
                category: certData.category,
                imageData: certData.imageData || certData.image,
                createdAt: certData.createdAt || new Date().toISOString()
            })
        });
        
        if (!response.ok) throw new Error('Failed to save certification');
        
        const result = await response.json();
        console.log('✅ Certification saved:', result);
        return result;
    } catch (error) {
        console.error('❌ Failed to save certification:', error);
        throw error;
    }
}

// Delete certification
async function deleteCertification(certId) {
    try {
        console.log('🗑️ Deleting certification:', certId);
        
        const response = await fetch(`/api/certification?id=${certId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete certification');
        
        console.log('✅ Certification deleted');
        return true;
    } catch (error) {
        console.error('❌ Failed to delete certification:', error);
        throw error;
    }
}

window.getAllCertifications = getAllCertifications;
window.saveCertification = saveCertification;
window.deleteCertification = deleteCertification;

// ========== CATEGORY MANAGEMENT ==========

// Get all categories
async function getAllCategories() {
    try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to load categories:', error);
        // Return default categories
        return {
            products: [
                { id: 'cream', name: 'Cream Jars', nameKo: '크림 용기' },
                { id: 'essence', name: 'Essence & Serum', nameKo: '에센스/세럼' },
                { id: 'lotion', name: 'Lotion', nameKo: '로션' },
                { id: 'eco', name: 'Eco-Friendly', nameKo: '친환경' }
            ],
            certifications: [
                { id: 'iso', name: 'ISO', nameKo: 'ISO' },
                { id: 'patent', name: 'Patent', nameKo: '특허' },
                { id: 'quality', name: 'Quality', nameKo: '품질인증' },
                { id: 'others', name: 'Others', nameKo: '기타' }
            ]
        };
    }
}

// Save categories (update)
async function saveCategories(type, categories) {
    try {
        console.log(`💾 Saving ${type} categories:`, categories);
        
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: type,
                categories: categories
            })
        });
        
        if (!response.ok) throw new Error('Failed to save categories');
        
        const result = await response.json();
        console.log('✅ Categories saved:', result);
        return result;
    } catch (error) {
        console.error('❌ Failed to save categories:', error);
        throw error;
    }
}

// Delete category
async function deleteCategory(type, categoryId) {
    try {
        console.log(`🗑️ Deleting ${type} category:`, categoryId);
        
        const response = await fetch(`/api/categories?type=${type}&id=${categoryId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete category');
        
        console.log('✅ Category deleted');
        return true;
    } catch (error) {
        console.error('❌ Failed to delete category:', error);
        throw error;
    }
}

window.getAllCategories = getAllCategories;
window.saveCategories = saveCategories;
window.deleteCategory = deleteCategory;

// ========== SAMPLE REQUESTS MANAGEMENT ==========

// Get all sample requests
async function getAllSamples() {
    try {
        const response = await fetch('/api/samples');
        if (!response.ok) throw new Error('Failed to fetch samples');
        return await response.json();
    } catch (error) {
        console.error('❌ Failed to load samples:', error);
        return [];
    }
}

// Update sample request
async function updateSample(sampleId, updateData) {
    try {
        console.log('💾 Updating sample:', sampleId);
        
        const response = await fetch(`/api/samples?id=${sampleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        if (!response.ok) throw new Error('Failed to update sample');
        
        const result = await response.json();
        console.log('✅ Sample updated:', result);
        return result;
    } catch (error) {
        console.error('❌ Failed to update sample:', error);
        throw error;
    }
}

// Delete sample request
async function deleteSample(sampleId) {
    try {
        console.log('🗑️ Deleting sample:', sampleId);
        
        const response = await fetch(`/api/samples?id=${sampleId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete sample');
        
        console.log('✅ Sample deleted');
        return true;
    } catch (error) {
        console.error('❌ Failed to delete sample:', error);
        throw error;
    }
}

window.getAllSamples = getAllSamples;
window.updateSample = updateSample;
window.deleteSample = deleteSample;
