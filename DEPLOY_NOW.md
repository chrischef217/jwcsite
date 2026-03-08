# 🚀 jwcsite.pages.dev 배포하기 (5분 완료!)

## 📍 현재 상태

✅ **GitHub 저장소 준비 완료**
- 저장소: https://github.com/chrischef217/jwcsite
- 브랜치: main
- 모든 코드 푸시 완료

❌ **Cloudflare Pages 프로젝트 필요**
- jwcsite.pages.dev 접속 불가
- 프로젝트 생성 필요 (5분 소요)

---

## 🎯 배포 방법 (단 5단계!)

### 1️⃣ Cloudflare Dashboard 접속

**URL**: https://dash.cloudflare.com/

로그인하세요.

---

### 2️⃣ Pages 메뉴 찾기

1. 좌측 사이드바에서 **"Workers & Pages"** 클릭
2. 우측 상단 **"Create application"** 버튼 클릭
3. **"Pages"** 탭 선택
4. **"Connect to Git"** 버튼 클릭

---

### 3️⃣ GitHub 연결

1. **"Connect GitHub"** 버튼 클릭
2. GitHub 계정 인증 (팝업창)
3. 저장소 목록에서 **"chrischef217/jwcsite"** 찾기
4. 선택 후 **"Begin setup"** 클릭

---

### 4️⃣ 설정 입력

다음과 같이 입력하세요:

```
┌─────────────────────────────────────┐
│ Project name: jwcsite               │
│                                     │
│ Production branch: main             │
│                                     │
│ Framework preset: None              │
│                                     │
│ Build command: (비워두기)            │
│                                     │
│ Build output directory: /           │
│                                     │
│ Root directory: /                   │
└─────────────────────────────────────┘
```

**중요**: 
- ✅ 빌드 명령은 **비워두세요** (정적 사이트)
- ✅ 출력 디렉토리는 **/** 로 설정

---

### 5️⃣ 배포!

1. **"Save and Deploy"** 버튼 클릭
2. 배포 진행 중... (1-2분 대기)
3. ✅ 배포 완료!

---

## 🎉 배포 성공!

배포가 완료되면 다음 URL로 접속할 수 있습니다:

### 메인 웹사이트
```
https://jwcsite.pages.dev
```

### 관리자 페이지
```
https://jwcsite.pages.dev/admin-login.html
비밀번호: 1111
```

---

## 🔄 자동 재배포 설정 완료!

이제 GitHub에 푸시하면 자동으로 배포됩니다:

```bash
git add .
git commit -m "업데이트"
git push origin main

# → Cloudflare가 자동 감지하고 재배포! 🚀
```

---

## 📊 배포 후 확인사항

배포가 완료되면 다음을 확인하세요:

### ✅ 체크리스트

- [ ] https://jwcsite.pages.dev 접속 확인
- [ ] 홈페이지 정상 로딩
- [ ] About, Products, Contact 페이지 확인
- [ ] 푸터에 톱니바퀴(⚙️) 아이콘 확인
- [ ] 관리자 로그인 (비밀번호: 1111)
- [ ] 로고 업로드 테스트
- [ ] 히어로 이미지 업로드 테스트

---

## 🆘 문제 해결

### Q: "Repository not found" 에러
**A**: GitHub 계정에 chrischef217/jwcsite 저장소 접근 권한이 없습니다.
- GitHub 계정 확인
- 저장소 접근 권한 확인

### Q: "Build failed" 에러
**A**: 빌드 명령을 비워두지 않았습니다.
- 설정으로 돌아가서 빌드 명령 삭제
- 다시 배포

### Q: "Project name already exists" 에러
**A**: jwcsite 프로젝트가 이미 존재합니다.
- 기존 프로젝트 삭제 후 재생성
- 또는 다른 프로젝트 이름 사용

### Q: 배포 후 404 에러
**A**: 빌드 출력 디렉토리가 잘못되었습니다.
- 설정에서 출력 디렉토리를 **/** 로 변경
- 다시 배포

---

## 📱 모바일에서도 확인

배포 후 모바일에서도 접속해보세요:
- 📱 스마트폰에서 jwcsite.pages.dev 접속
- ✅ 반응형 디자인 확인
- ✅ 관리자 기능 테스트

---

## 🎓 추가 팁

### 커스텀 도메인 연결 (선택사항)

1. Cloudflare Pages 프로젝트 설정
2. **"Custom domains"** 탭
3. 도메인 추가
4. DNS 레코드 설정

### 배포 미리보기

- 각 커밋마다 미리보기 URL 생성
- Pull Request 시 자동 미리보기
- 예: `https://abc123.jwcsite.pages.dev`

---

## 📞 도움이 필요하신가요?

배포 관련 문서:
- **AUTO_DEPLOY_GUIDE.md**: 상세 가이드
- **CLOUDFLARE_DEPLOYMENT.md**: 기술 문서
- **DEPLOYMENT_ISSUE.md**: 문제 해결

Cloudflare 공식 문서:
- https://developers.cloudflare.com/pages/

---

**시작하세요!** 👉 https://dash.cloudflare.com/

5분이면 배포 완료됩니다! 🚀
