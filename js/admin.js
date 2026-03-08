// 관리자 페이지 기능
// VERSION: 3.0.20240220 - RESTful Table API with File Upload
// LAST UPDATE: 2024-02-20 11:20

// 로그인 체크
if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// 로그아웃
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

// 섹션 전환
document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (this.classList.contains('logout-btn')) return;
        
        const section = this.dataset.section;
        
        // 버튼 활성화
        document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // 섹션 표시
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // 섹션별 로드 함수
        if (section === 'dashboard') loadDashboard();
        if (section === 'logo') loadLogoManager();
        if (section === 'hero-slider') loadHeroSliderManager();
        if (section === 'page-heroes') loadPageHeroesManager();
        if (section === 'products') loadProductsManager();
    });
});

// ===== 대시보드 =====
async function loadDashboard() {
    const heroImages = await getHeroImages();
    
    document.getElementById('heroImagesCount').textContent = heroImages.length;
    document.getElementById('productsCount').textContent = 0;
}

// ===== 로고 관리 =====
let selectedLogoFile = null;

function loadLogoManager() {
    const uploadArea = document.getElementById('logoUploadArea');
    const input = document.getElementById('logoInput');
    const preview = document.getElementById('logoPreview');
    
    // 기존 로고 로드
    getLogo().then(logo => {
        if (logo) {
            preview.src = logo.data;
            preview.style.display = 'block';
            uploadArea.querySelector('.upload-placeholder').style.display = 'none';
        }
    });
    
    // 클릭 업로드
    uploadArea.onclick = () => input.click();
    
    // 파일 선택
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedLogoFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                uploadArea.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };
    
    // 드래그앤드롭
    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#000';
    };
    
    uploadArea.ondragleave = () => {
        uploadArea.style.borderColor = '#ddd';
    };
    
    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            selectedLogoFile = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                uploadArea.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };
}

async function saveLogoButton() {
    if (!selectedLogoFile) {
        alert('로고 이미지를 선택해주세요.');
        return;
    }
    
    try {
        showProgress('logoProgress');
        
        const compressed = await compressImage(selectedLogoFile, 500, 0.9);
        await saveLogoToDB(selectedLogoFile.name, compressed);
        
        hideProgress('logoProgress');
        alert('로고가 저장되었습니다! 모든 페이지에서 확인할 수 있습니다.');
        
        selectedLogoFile = null;
        document.getElementById('logoInput').value = '';
    } catch (error) {
        hideProgress('logoProgress');
        console.error('로고 저장 실패:', error);
        alert('로고 저장에 실패했습니다.');
    }
}

async function removeLogo() {
    if (!confirm('로고를 제거하시겠습니까?')) return;
    
    try {
        const response = await fetch('/api/table/images?search=logo');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
            for (const logo of result.data) {
                if (logo.type === 'logo') {
                    await fetch(`/api/table/images/${logo.id}`, { method: 'DELETE' });
                }
            }
        }
        
        alert('로고가 제거되었습니다.');
        location.reload();
    } catch (error) {
        console.error('로고 제거 실패:', error);
        alert('로고 제거에 실패했습니다.');
    }
}

// ===== 히어로 슬라이더 관리 =====
let selectedHeroFiles = [];

function loadHeroSliderManager() {
    const uploadArea = document.getElementById('heroSliderUploadArea');
    const input = document.getElementById('heroSliderInput');
    
    // 간격 로드
    getSetting('slideInterval', 5).then(interval => {
        document.getElementById('slideInterval').value = interval;
    });
    
    // 현재 이미지 로드
    loadHeroImagesList();
    
    // 클릭 업로드
    uploadArea.onclick = () => input.click();
    
    // 파일 선택
    input.onchange = (e) => {
        selectedHeroFiles = Array.from(e.target.files);
        console.log(`📁 ${selectedHeroFiles.length}개 히어로 이미지 선택됨`);
    };
    
    // 드래그앤드롭
    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#000';
    };
    
    uploadArea.ondragleave = () => {
        uploadArea.style.borderColor = '#ddd';
    };
    
    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        selectedHeroFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        console.log(`📁 ${selectedHeroFiles.length}개 히어로 이미지 선택됨`);
    };
}

async function loadHeroImagesList() {
    const images = await getHeroImages();
    
    const list = document.getElementById('heroImagesList');
    list.innerHTML = '';
    
    if (images.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#999;">아직 등록된 이미지가 없습니다.</p>';
        return;
    }
    
    images.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'hero-image-item';
        item.innerHTML = `
            <img src="${image.data}" alt="${image.filename}">
            <div class="hero-image-actions">
                ${index > 0 ? `<button onclick="moveHeroUp(${index})">↑</button>` : ''}
                ${index < images.length - 1 ? `<button onclick="moveHeroDown(${index})">↓</button>` : ''}
                <button onclick="deleteHeroImage(${index})">🗑️</button>
            </div>
        `;
        list.appendChild(item);
    });
}

async function saveHeroImages() {
    if (selectedHeroFiles.length === 0) {
        alert('이미지를 선택해주세요.');
        return;
    }
    
    try {
        showProgress('heroSliderProgress');
        
        const existingImages = await getHeroImages();
        const newImages = [];
        
        for (const file of selectedHeroFiles) {
            const compressed = await compressImage(file);
            newImages.push({
                filename: file.name,
                data: compressed
            });
        }
        
        const allImages = [...existingImages, ...newImages];
        await saveHeroImagesToDB(allImages);
        
        // 간격 저장
        const interval = document.getElementById('slideInterval').value;
        await saveSetting('slideInterval', parseInt(interval));
        
        hideProgress('heroSliderProgress');
        console.log(`💾 ${selectedHeroFiles.length}개 히어로 이미지 저장 완료`);
        alert('이미지가 저장되었습니다!');
        
        selectedHeroFiles = [];
        document.getElementById('heroSliderInput').value = '';
        await loadHeroImagesList();
    } catch (error) {
        hideProgress('heroSliderProgress');
        console.error('히어로 이미지 저장 실패:', error);
        alert('이미지 저장에 실패했습니다.');
    }
}

async function moveHeroUp(index) {
    const images = await getHeroImages();
    
    if (index > 0) {
        [images[index], images[index - 1]] = [images[index - 1], images[index]];
        await saveHeroImagesToDB(images);
        await loadHeroImagesList();
    }
}

async function moveHeroDown(index) {
    const images = await getHeroImages();
    
    if (index < images.length - 1) {
        [images[index], images[index + 1]] = [images[index + 1], images[index]];
        await saveHeroImagesToDB(images);
        await loadHeroImagesList();
    }
}

async function deleteHeroImage(index) {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return;
    
    try {
        const images = await getHeroImages();
        images.splice(index, 1);
        await saveHeroImagesToDB(images);
        await loadHeroImagesList();
        alert('이미지가 삭제되었습니다.');
    } catch (error) {
        console.error('이미지 삭제 실패:', error);
        alert('이미지 삭제에 실패했습니다.');
    }
}

// ===== 페이지 히어로 이미지 관리 =====
const pageHeroFiles = {
    about: null,
    products: null,
    contact: null
};

function loadPageHeroesManager() {
    ['about', 'products', 'contact'].forEach(page => {
        setupPageHeroUpload(page);
        loadPageHeroPreview(page);
    });
}

function setupPageHeroUpload(page) {
    const uploadArea = document.getElementById(`${page}HeroUploadArea`);
    const input = document.getElementById(`${page}HeroInput`);
    const preview = document.getElementById(`${page}HeroPreview`);
    
    uploadArea.onclick = () => input.click();
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            pageHeroFiles[page] = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                uploadArea.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };
    
    uploadArea.ondragover = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#000';
    };
    
    uploadArea.ondragleave = () => {
        uploadArea.style.borderColor = '#ddd';
    };
    
    uploadArea.ondrop = (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#ddd';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            pageHeroFiles[page] = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
                uploadArea.querySelector('.upload-placeholder').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    };
}

async function loadPageHeroPreview(page) {
    const data = await getPageHero(page);
    const preview = document.getElementById(`${page}HeroPreview`);
    const uploadArea = document.getElementById(`${page}HeroUploadArea`);
    const checkbox = document.getElementById(`${page}HeroEnabled`);
    
    if (data) {
        preview.src = data.data;
        preview.style.display = 'block';
        uploadArea.querySelector('.upload-placeholder').style.display = 'none';
    }
    
    // enabled 설정 로드
    const enabled = await getSetting(`${page}HeroEnabled`, false);
    checkbox.checked = enabled;
}

async function savePageHero(page) {
    try {
        showProgress(`${page}HeroProgress`);
        
        const enabled = document.getElementById(`${page}HeroEnabled`).checked;
        await saveSetting(`${page}HeroEnabled`, enabled);
        
        if (pageHeroFiles[page]) {
            const compressed = await compressImage(pageHeroFiles[page]);
            await savePageHeroToDB(page, pageHeroFiles[page].name, compressed);
        }
        
        hideProgress(`${page}HeroProgress`);
        alert(`${page.toUpperCase()} 페이지 히어로 이미지가 저장되었습니다!`);
        pageHeroFiles[page] = null;
    } catch (error) {
        hideProgress(`${page}HeroProgress`);
        console.error('페이지 히어로 저장 실패:', error);
        alert('저장에 실패했습니다.');
    }
}

// ===== 제품 관리 =====
async function loadProductsManager() {
    const list = document.getElementById('productsList');
    list.innerHTML = '<p style="text-align:center;color:#999;">제품 관리 기능은 추후 구현 예정입니다.</p>';
}

function showProductForm() {
    alert('제품 추가 기능은 추후 구현 예정입니다.');
}

// ===== 유틸리티 함수 =====
function showProgress(id) {
    const progressBar = document.getElementById(id);
    if (progressBar) {
        progressBar.style.display = 'block';
        const fill = progressBar.querySelector('.progress-fill');
        const text = progressBar.querySelector('.progress-text');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress > 90) progress = 90;
            fill.style.width = progress + '%';
            text.textContent = progress + '%';
        }, 100);
        
        progressBar.dataset.interval = interval;
    }
}

function hideProgress(id) {
    const progressBar = document.getElementById(id);
    if (progressBar) {
        const interval = progressBar.dataset.interval;
        clearInterval(interval);
        
        const fill = progressBar.querySelector('.progress-fill');
        const text = progressBar.querySelector('.progress-text');
        fill.style.width = '100%';
        text.textContent = '100%';
        
        setTimeout(() => {
            progressBar.style.display = 'none';
            fill.style.width = '0%';
            text.textContent = '0%';
        }, 500);
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});
