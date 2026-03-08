// 장원 로고 자동 업로드 스크립트 (개선된 버전)
(async function() {
    console.log('🎨 장원 로고 업로드 시작...');
    
    const statusEl = document.getElementById('status');
    const spinnerEl = document.getElementById('spinner');
    const homeBtnEl = document.getElementById('homeBtn');
    
    // Base64 인코딩된 로고 데이터 (장원 로고)
    const dataUrl = document.querySelector('script[data-logo]')?.getAttribute('data-logo') || '';
    const filename = 'jangwon-logo.png';
    
    if (!dataUrl) {
        statusEl.innerHTML = '❌ 로고 데이터를 찾을 수 없습니다.';
        statusEl.className = 'status error';
        spinnerEl.style.display = 'none';
        return;
    }
    
    try {
        statusEl.innerHTML = '⏳ 데이터베이스에 로고 저장 중...';
        await saveLogoToDB(filename, dataUrl);
        
        console.log('✅ 장원 로고가 성공적으로 저장되었습니다!');
        statusEl.innerHTML = '✅ 장원 로고가 성공적으로 적용되었습니다!<br><br>모든 페이지에서 로고가 표시됩니다.';
        statusEl.className = 'status success';
        spinnerEl.style.display = 'none';
        homeBtnEl.style.display = 'inline-block';
        
    } catch (error) {
        console.error('❌ 로고 저장 실패:', error);
        statusEl.innerHTML = `❌ 로고 저장에 실패했습니다.<br><br>오류: ${error.message}`;
        statusEl.className = 'status error';
        spinnerEl.style.display = 'none';
    }
})();
