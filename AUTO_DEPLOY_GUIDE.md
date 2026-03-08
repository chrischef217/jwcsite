# 🚀 자동 배포 가이드 (Cloudflare Pages)

## ❌ 자동 배포 실패 원인

```
ERROR: In a non-interactive environment, it's necessary to set a 
CLOUDFLARE_API_TOKEN environment variable for wrangler to work.
```

**문제**: Cloudflare API 토큰이 설정되지 않았습니다.

## ✅ 해결 방법 - 2가지 옵션

---

## 🎯 옵션 1: Cloudflare Dashboard 수동 배포 (가장 쉬움!)

### 장점
- ✅ API 토큰 불필요
- ✅ 5분 내 완료
- ✅ 자동 재배포 설정 (GitHub 연동)
- ✅ 웹 인터페이스로 간편하게 관리

### 단계

1. **Cloudflare Dashboard 접속**
   ```
   https://dash.cloudflare.com/
   ```

2. **Workers & Pages → Create application**
   - Pages 탭 선택
   - Connect to Git

3. **GitHub 저장소 연결**
   ```
   저장소: chrischef217/jwcsite
   브랜치: main
   ```

4. **빌드 설정**
   ```
   프로젝트 이름: jwcsite
   빌드 명령: (비워두기)
   빌드 출력 디렉토리: /
   ```

5. **Deploy!**
   - Save and Deploy 클릭
   - 1-2분 대기
   - ✅ https://jwcsite.pages.dev 접속 가능!

---

## 🔧 옵션 2: CLI 자동 배포 (고급)

API 토큰을 생성하여 CLI로 배포하는 방법입니다.

### 1단계: Cloudflare API 토큰 생성

1. **Cloudflare Dashboard 접속**
   ```
   https://dash.cloudflare.com/profile/api-tokens
   ```

2. **"Create Token" 클릭**

3. **"Edit Cloudflare Workers" 템플릿 사용** 또는 커스텀 토큰 생성
   
   **필요한 권한:**
   ```
   Account - Cloudflare Pages - Edit
   ```

4. **토큰 생성 후 복사** (한 번만 표시됨!)

### 2단계: 환경 변수 설정

```bash
export CLOUDFLARE_API_TOKEN="your-api-token-here"
export CLOUDFLARE_ACCOUNT_ID="your-account-id-here"
```

**Account ID 찾는 방법:**
- Cloudflare Dashboard → 우측 사이드바
- 또는 https://dash.cloudflare.com/ 로그인 후 URL에서 확인

### 3단계: 배포 실행

```bash
cd /home/user/webapp
wrangler pages deploy . --project-name=jwcsite
```

---

## 📋 비교표

| 항목 | Dashboard (옵션 1) | CLI (옵션 2) |
|------|-------------------|-------------|
| 난이도 | ⭐ 쉬움 | ⭐⭐⭐ 어려움 |
| 소요 시간 | 5분 | 10분 (토큰 생성 포함) |
| API 토큰 | 불필요 | 필요 |
| 자동 재배포 | ✅ GitHub 연동 | ❌ 수동 |
| 관리 편의성 | ✅ 웹 UI | ❌ CLI |

## 🎯 추천

**옵션 1 (Dashboard)을 강력히 추천합니다!**

이유:
1. ✅ API 토큰 생성 불필요
2. ✅ GitHub 연동으로 자동 재배포
3. ✅ 웹 UI로 쉽게 관리
4. ✅ 배포 로그 확인 용이
5. ✅ 각 커밋마다 미리보기 URL 생성

---

## 🔄 GitHub 연동 후 자동 배포

Dashboard에서 한 번 설정하면:

```bash
# 코드 수정
git add .
git commit -m "업데이트"
git push origin main

# → Cloudflare가 자동으로 감지하고 재배포! 🚀
```

---

## 📍 배포 URL (배포 후)

- **메인**: https://jwcsite.pages.dev
- **관리자**: https://jwcsite.pages.dev/admin-login.html
- **GitHub**: https://github.com/chrischef217/jwcsite

---

## 🆘 문제 해결

### "Project not found" 에러
→ Dashboard에서 먼저 프로젝트 생성 필요

### "Unauthorized" 에러
→ API 토큰 확인 또는 Dashboard 사용

### "Build failed" 에러
→ 빌드 명령을 비워두세요 (정적 사이트)

---

**결론**: Cloudflare Dashboard (옵션 1)를 사용하세요! 
가장 쉽고 빠르며, 자동 재배포까지 설정됩니다. 🎉
