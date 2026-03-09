// Admin page functionality
let selectedMediaFiles = [];

// Section navigation
document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('logout-btn')) return;
        
        const section = btn.dataset.section;
        if (!section) return;
        
        document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(section).classList.add('active');
    });
});

// Hero Slider file input handling
const heroSliderInput = document.getElementById('heroSliderInput');
const heroSliderUploadArea = document.getElementById('heroSliderUploadArea');
const heroPreviewGrid = document.getElementById('heroPreviewGrid');

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

// Handle selected media files
function handleHeroMediaFiles(files) {
    selectedMediaFiles = files;
    
    heroPreviewGrid.innerHTML = '';
    heroPreviewGrid.style.display = 'grid';
    
    files.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.style.cssText = 'position: relative; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;';
        
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.style.cssText = 'width: 100%; height: 150px; object-fit: cover;';
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            previewItem.appendChild(img);
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.style.cssText = 'width: 100%; height: 150px; object-fit: cover;';
            video.controls = false;
            const reader = new FileReader();
            reader.onload = (e) => {
                video.src = e.target.result;
            };
            reader.readAsDataURL(file);
            previewItem.appendChild(video);
            
            const videoLabel = document.createElement('div');
            videoLabel.textContent = '🎥 Video';
            videoLabel.style.cssText = 'position: absolute; top: 5px; left: 5px; background: rgba(0,0,0,0.7); color: white; padding: 3px 8px; border-radius: 3px; font-size: 12px;';
            previewItem.appendChild(videoLabel);
        }
        
        const filename = document.createElement('div');
        filename.textContent = file.name;
        filename.style.cssText = 'padding: 5px; font-size: 12px; text-align: center; background: #f8f9fa;';
        previewItem.appendChild(filename);
        
        heroPreviewGrid.appendChild(previewItem);
    });
    
    document.querySelector('.upload-placeholder').style.display = 'none';
}

// Save hero media
async function saveHeroMedia() {
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
        
        await saveHeroMediaToDB(selectedMediaFiles);
        
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        
        setTimeout(() => {
            progressBar.style.display = 'none';
            progressFill.style.width = '0%';
            alert('✅ 히어로 슬라이더가 서버에 저장되었습니다!');
            loadHeroSliderList();
            
            // Reset
            selectedMediaFiles = [];
            heroPreviewGrid.innerHTML = '';
            heroPreviewGrid.style.display = 'none';
            document.querySelector('.upload-placeholder').style.display = 'block';
            heroSliderInput.value = '';
        }, 500);
        
    } catch (error) {
        progressBar.style.display = 'none';
        alert('❌ 저장 실패: ' + error.message);
    }
}

// Load hero slider list
async function loadHeroSliderList() {
    const list = document.getElementById('heroImagesList');
    const mediaItems = await getHeroSliderMedia();
    
    if (mediaItems.length === 0) {
        list.innerHTML = '<p style="color: #999;">등록된 슬라이더가 없습니다.</p>';
        return;
    }
    
    list.innerHTML = '';
    mediaItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'border: 1px solid #ddd; padding: 15px; border-radius: 5px; margin-bottom: 15px;';
        
        if (item.mediaType === 'video') {
            itemDiv.innerHTML = `
                <div style="display: flex; gap: 15px; align-items: center;">
                    <video src="${item.data}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;" controls></video>
                    <div>
                        <p><strong>🎥 동영상 ${index + 1}</strong></p>
                        <p style="color: #666; font-size: 14px;">${item.filename}</p>
                        <button class="btn btn-secondary" onclick="deleteHeroMedia('${item.id}')">삭제</button>
                    </div>
                </div>
            `;
        } else {
            itemDiv.innerHTML = `
                <div style="display: flex; gap: 15px; align-items: center;">
                    <img src="${item.data}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 5px;">
                    <div>
                        <p><strong>📷 이미지 ${index + 1}</strong></p>
                        <p style="color: #666; font-size: 14px;">${item.filename}</p>
                        <button class="btn btn-secondary" onclick="deleteHeroMedia('${item.id}')">삭제</button>
                    </div>
                </div>
            `;
        }
        
        list.appendChild(itemDiv);
    });
}

// Delete hero media
async function deleteHeroMedia(id) {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    
    try {
        await fetch(`${API_BASE}/images/${id}`, { method: 'DELETE' });
        alert('✅ 삭제되었습니다.');
        loadHeroSliderList();
    } catch (error) {
        alert('❌ 삭제 실패: ' + error.message);
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.href = 'admin-login.html';
}

// Check login
if (!sessionStorage.getItem('admin_logged_in')) {
    window.location.href = 'admin-login.html';
}

// Load data on page load
loadHeroSliderList();
