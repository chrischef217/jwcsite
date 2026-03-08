# Cloudflare Pages 배포 가이드

## 현재 상태 ✅

- ✅ **GitHub 저장소**: https://github.com/chrischef217/jwcsite
- ✅ **코드 푸시 완료**: 모든 파일이 GitHub에 업로드됨
- ⚠️ **배포 대기**: Cloudflare 대시보드에서 GitHub 연동 필요

---

## Cloudflare Pages 배포 방법 (5분 소요)

### 1단계: Cloudflare 대시보드 접속

1. **Cloudflare 대시보드 로그인**
   - 주소: https://dash.cloudflare.com/
   - 계정: chrischef217@gmail.com

2. **Workers & Pages 메뉴로 이동**
   - 좌측 사이드바에서 **"Workers & Pages"** 클릭

---

### 2단계: 새 프로젝트 생성

1. **Create application 클릭**
   - 우측 상단의 **"Create application"** 버튼 클릭

2. **Pages 탭 선택**
   - **"Pages"** 탭 클릭
   - **"Connect to Git"** 선택

---

### 3단계: GitHub 저장소 연결

1. **GitHub 계정 연동**
   - 처음 사용 시: GitHub 계정 연결 (한 번만)
   - 이미 연동된 경우: 저장소 목록에서 선택

2. **저장소 선택**
   - Repository: **`chrischef217/jwcsite`** 선택
   - 저장소가 보이지 않으면 **"Configure GitHub app"** 클릭하여 권한 추가

---

### 4단계: 빌드 설정 (중요!)

#### 프로젝트 이름
```
jwcsite
```

#### Production 브랜치
```
main
```

#### 빌드 설정 (정적 HTML 사이트)
```
Framework preset: None
Build command: (비워두기)
Build output directory: /
Root directory: /
```

⚠️ **중요**: 
- 이 프로젝트는 **정적 HTML 웹사이트**입니다
- 빌드 과정이 필요 없으므로 Build command는 **비워두세요**
- Build output directory는 **/** (루트)로 설정

---

### 5단계: 배포 시작

1. **Save and Deploy 클릭**
   - 하단의 **"Save and Deploy"** 버튼 클릭

2. **배포 진행**
   - 자동으로 배포 시작 (1-2분 소요)
   - 진행 상황을 실시간으로 확인 가능

3. **배포 완료**
   - 성공 메시지와 함께 URL 표시
   - 기본 URL: **`https://jwcsite.pages.dev`**
   - 추가 URL: **`https://main.jwcsite.pages.dev`** (브랜치별)

---

### 6단계: 배포 확인

배포 완료 후 다음 URL로 접속하여 확인:

- **메인 페이지**: https://jwcsite.pages.dev
- **About 페이지**: https://jwcsite.pages.dev/about.html
- **Products 페이지**: https://jwcsite.pages.dev/products.html
- **Contact 페이지**: https://jwcsite.pages.dev/contact.html
- **관리자 로그인**: https://jwcsite.pages.dev/admin-login.html

---

## 자동 배포 설정 ✨

GitHub 연동 후 자동으로 다음 기능이 활성화됩니다:

### 자동 배포 트리거
- ✅ **main 브랜치에 푸시** → 프로덕션 자동 배포
- ✅ **다른 브랜치에 푸시** → 미리보기 배포 자동 생성
- ✅ **Pull Request 생성** → 미리보기 URL 자동 생성

### 코드 업데이트 방법
```bash
# 로컬에서 코드 수정 후
cd /home/user/webapp
git add .
git commit -m "변경 사항 설명"
git push origin main

# GitHub에 푸시하면 자동으로 Cloudflare Pages 배포됨!
```

---

## 문제 해결

### Q1: 저장소가 목록에 보이지 않아요
**해결방법**:
1. "Configure GitHub app" 클릭
2. Repository access에서 `jwcsite` 저장소 권한 추가
3. Save 후 다시 Cloudflare로 돌아오기

### Q2: 배포 후 페이지가 404 에러가 나요
**해결방법**:
1. Build output directory가 **/** (루트)로 설정되었는지 확인
2. 프로젝트 설정에서 Build configuration 수정 가능

### Q3: CSS/JS 파일이 로드되지 않아요
**해결방법**:
- 현재 프로젝트는 상대 경로로 되어 있어 문제 없음
- HTML 파일에서 `href="css/common.css"` 형태로 참조 중

### Q4: 관리자 페이지에서 이미지가 안 보여요
**해결방법**:
- 관리자에서 업로드한 이미지는 **RESTful Table API**에 저장됨
- 서버 데이터베이스에 저장되므로 Cloudflare Pages 배포와 무관
- 관리자 로그인: ID `1`, 비밀번호 `1`

---

## 프로젝트 정보

### 기술 스택
- **프론트엔드**: HTML5, CSS3, JavaScript (ES6+)
- **스토리지**: RESTful Table API (서버 데이터베이스)
- **호스팅**: Cloudflare Pages
- **버전 관리**: GitHub

### 주요 기능
- ✅ 멀티 페이지 웹사이트 (Home, About, Products, Contact)
- ✅ 반응형 디자인 (모바일 지원)
- ✅ 관리자 시스템 (로고, 히어로 이미지, 슬라이더 관리)
- ✅ 히어로 텍스트 오버레이 (8가지 애니메이션)
- ✅ RESTful Table API 데이터 저장

---

## 배포 후 관리

### 프로젝트 대시보드
- URL: https://dash.cloudflare.com/
- Workers & Pages > jwcsite

### 확인 사항
- **Deployments**: 배포 히스토리 확인
- **Settings**: 빌드 설정, 환경 변수, 도메인 설정
- **Analytics**: 방문자 통계 확인

### 커스텀 도메인 추가 (선택사항)
1. Settings > Domains 탭
2. "Add a custom domain" 클릭
3. 도메인 입력 (예: www.jwccosmetics.com)
4. DNS 레코드 설정 안내 따르기

---

## 지원 및 문서

- **Cloudflare Pages 문서**: https://developers.cloudflare.com/pages/
- **GitHub 저장소**: https://github.com/chrischef217/jwcsite
- **프로젝트 README**: GitHub 저장소의 README.md 참고

---

**배포가 완료되면 `https://jwcsite.pages.dev`로 접속하실 수 있습니다!** 🎉
