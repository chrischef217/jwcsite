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
                        <label style="display: block; margin-bottom: 5px;">텍스트 (선택사항):</label>
                        <input type="text" id="text-${index}" class="slide-text-input" placeholder="슬라이드 텍스트 입력" 
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="margin-top: 10px;">
                        <button onclick="moveUp(${index})" style="padding: 5px 10px; margin-right: 5px;">↑</button>
                        <button onclick="moveDown(${index})" style="padding: 5px 10px;">↓</button>
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

// Move up
window.moveUp = function(index) {
    if (index === 0) return;
    const temp = selectedMediaFiles[index];
    selectedMediaFiles[index] = selectedMediaFiles[index - 1];
    selectedMediaFiles[index - 1] = temp;
    handleHeroMediaFiles(Array.from(selectedMediaFiles));
}

// Move down
window.moveDown = function(index) {
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
    
    // Collect text inputs
    const mediaWithText = selectedMediaFiles.map((file, index) => {
        const textInput = document.getElementById(`text-${index}`);
        return {
            file: file,
            text: textInput ? textInput.value : ''
        };
    });
    
    const progressBar = document.getElementById('heroSliderProgress');
    const progressFill = progressBar.querySelector('.progress-fill');
    const progressText = progressBar.querySelector('.progress-text');
    
    try {
        progressBar.style.display = 'block';
        progressFill.style.width = '50%';
        progressText.textContent = '50%';
        
        await saveHeroMediaToDB(mediaWithText);
        
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

// Load hero slider list
async function loadHeroSliderList() {
    const list = document.getElementById('heroImagesList');
    if (!list) return;
    
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
                        <p style="color: #666; font-size: 14px;">${item.filename || 'video'}</p>
                        ${item.text ? `<p style="color: #333; font-size: 14px; margin-top: 5px;">📝 "${item.text}"</p>` : ''}
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
                        <p style="color: #666; font-size: 14px;">${item.filename || 'image'}</p>
                        ${item.text ? `<p style="color: #333; font-size: 14px; margin-top: 5px;">📝 "${item.text}"</p>` : ''}
                        <button class="btn btn-secondary" onclick="deleteHeroMedia('${item.id}')">삭제</button>
                    </div>
                </div>
            `;
        }
        
        list.appendChild(itemDiv);
    });
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

// Logout (global function)
window.logout = function() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.href = 'admin-login.html';
}

