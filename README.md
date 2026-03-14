# JWC Website

## 프로젝트 개요
- **이름**: JWC Website
- **목표**: 화장품 용기 제조 회사 웹사이트
- **주요 기능**:
  - 동적 히어로 슬라이더 (메인 페이지)
  - 페이지별 독립 히어로 슬라이더 (About, Products, Contact - 70vh 크기)
  - 제품 관리 시스템 (카테고리별 제품 표시)
  - 관리자 페이지 (이미지/영상 업로드, 제품 관리)

## URL
- **프로덕션**: https://jwcsite.pages.dev
- **관리자 로그인**: https://jwcsite.pages.dev/admin-login.html (비밀번호: `1111`)
- **GitHub**: https://github.com/chrischef217/jwcsite

## 완료된 기능

### 1. 히어로 슬라이더
- ✅ **메인 히어로 슬라이더** (100vh 전체 화면)
  - 이미지/영상 업로드 지원
  - 자동 슬라이드 (이미지 5초, 영상 재생 시간)
  - 드래그앤드롭 업로드
  - 순서 변경 기능 (위/아래 버튼)
  - 삭제 기능 (즉시 반영)

- ✅ **페이지별 히어로 슬라이더** (70vh 크기)
  - About 페이지: `/about.html`
  - Products 페이지: `/products.html`
  - Contact 페이지: `/contact.html`
  - 각 페이지마다 독립적인 미디어 관리
  - 기본 배경 이미지 겹침 문제 해결

### 2. 제품 관리
- ✅ 카테고리별 제품 표시
  - Cream Jars
  - Essence & Serum
  - Lotion
  - Eco-Friendly
- ✅ 제품 필터링 기능
- ✅ 관리자 페이지에서 제품 추가/수정/삭제

### 3. 관리자 페이지
- ✅ 로그인 인증 (비밀번호: `1111`)
- ✅ 섹션별 네비게이션
  - 대시보드
  - 메인 히어로 슬라이더
  - 페이지 히어로 슬라이더
  - 제품 관리
- ✅ 파일 업로드 (드래그앤드롭)
- ✅ Cloudflare KV 스토리지 연동

## 현재 진행 상황

### ✅ 최근 수정 사항 (2026-03-14)
1. **admin.js 구문 오류 수정**
   - 파일이 중간에 잘린 오류 복구
   - 누락된 함수 추가:
     - `window.deleteHeroMediaById()` - DELETE API 호출
     - `window.getHeroSliderMedia()` - 전체 미디어 목록 조회
     - `window.updateItemOrder()` - 순서 변경 API 호출

2. **Cloudflare Pages 배포 설정 수정**
   - `wrangler.jsonc`에서 `pages_build_output_dir` 제거
   - 정적 파일(JS/CSS) 정상 배포 확인

3. **히어로 슬라이더 API 호환성**
   - `mediaType`/`type`, `data`/`url` 필드 모두 지원
   - 관리자 업로드 영상이 각 페이지에 정상 표시

## 데이터 구조

### Cloudflare KV 스토리지
- **Hero Slider (메인)**:
  ```
  Key: hero_{timestamp}
  Value: {
    id, title, filename, type, data (base64), 
    order_index, timestamp
  }
  ```

- **Page Hero Sliders**:
  ```
  Key: hero_page_{pageName}
  Value: {
    media: [{ id, mediaType, data, order_index, ... }],
    settings: { title, description }
  }
  ```

- **Products**:
  ```
  Key: product_{timestamp}
  Value: {
    id, name, category, description, features,
    image (base64), created_at, updated_at
  }
  ```

## 기술 스택
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Cloudflare Pages Functions (Hono)
- **Storage**: Cloudflare KV
- **Deployment**: Cloudflare Pages
- **Version Control**: Git + GitHub

## 사용 가이드

### 관리자 페이지 접속
1. https://jwcsite.pages.dev/admin-login.html 접속
2. 비밀번호 `1111` 입력
3. 로그인 후 관리자 페이지 진입

### 히어로 슬라이더 관리
1. 관리자 페이지 → "메인 히어로 슬라이더" 또는 "페이지 히어로 슬라이더" 선택
2. 파일 선택 또는 드래그앤드롭으로 이미지/영상 업로드
3. 순서 변경: 위/아래 버튼 클릭
4. 삭제: 삭제 버튼 클릭 → 확인

### 제품 관리
1. 관리자 페이지 → "제품 관리" 선택
2. "새 제품 추가" 버튼 클릭
3. 제품 정보 입력 (이름, 카테고리, 설명, 특징, 이미지)
4. 저장 버튼 클릭

## 배포 상태
- **플랫폼**: Cloudflare Pages
- **상태**: ✅ Active
- **최신 커밋**: `72604c3` - "Fix admin.js syntax error and restore missing functions"
- **마지막 업데이트**: 2026-03-14

## 알려진 이슈
- ✅ 모두 해결됨

## 다음 단계
1. Contact 페이지에 영상 업로드
2. 반응형 디자인 개선
3. 제품 상세 페이지 추가
4. 다국어 지원 (한국어/영어)

## 로컬 개발

### 서버 시작
```bash
cd /home/user/webapp
pm2 start "npx wrangler pages dev . --ip 0.0.0.0 --port 3000" --name jwcsite
```

### 로그 확인
```bash
pm2 logs jwcsite --nostream
```

### 포트 정리
```bash
fuser -k 3000/tcp 2>/dev/null || true
```

### 배포
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Cloudflare Pages가 자동으로 배포합니다 (1-2분 소요).

## 문의
- **GitHub Issues**: https://github.com/chrischef217/jwcsite/issues
