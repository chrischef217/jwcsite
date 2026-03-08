# 🚀 Cloudflare Pages 배포 가이드

## 📋 현재 상태

- **GitHub 저장소**: https://github.com/chrischef217/jwcsite
- **브랜치**: main
- **배포 대상**: jwcsite.pages.dev

## 🔧 Cloudflare Pages 배포 단계

### 1단계: Cloudflare Dashboard 로그인

1. https://dash.cloudflare.com/ 접속
2. Cloudflare 계정으로 로그인

### 2단계: Pages 프로젝트 생성

1. 좌측 메뉴에서 **"Workers & Pages"** 클릭
2. **"Create application"** 버튼 클릭
3. **"Pages"** 탭 선택
4. **"Connect to Git"** 선택

### 3단계: GitHub 연결

1. **"Connect GitHub"** 버튼 클릭
2. GitHub 계정 인증 (필요한 경우)
3. **"chrischef217/jwcsite"** 저장소 선택
4. **"Begin setup"** 클릭

### 4단계: 빌드 설정

다음과 같이 설정하세요:

```
프로젝트 이름: jwcsite
프로덕션 브랜치: main
빌드 명령: (비워두기 - 정적 사이트)
빌드 출력 디렉토리: /
루트 디렉토리: /
```

**중요**: 이 프로젝트는 빌드 과정이 필요 없는 순수 정적 사이트입니다.

### 5단계: 배포

1. **"Save and Deploy"** 버튼 클릭
2. 자동 배포 시작 (약 1-2분 소요)
3. 배포 완료 후 **jwcsite.pages.dev** 접속 가능

## ⚙️ 환경 변수 (필요 없음)

이 프로젝트는 환경 변수가 필요 없습니다. IndexedDB를 사용하여 브라우저에 데이터를 저장합니다.

## 🔄 자동 배포

GitHub에 새로운 커밋을 푸시하면 Cloudflare Pages가 자동으로 재배포합니다.

```bash
git add .
git commit -m "업데이트 내용"
git push origin main
```

## 📍 배포 URL

- **메인**: https://jwcsite.pages.dev
- **커밋별 미리보기**: https://[commit-hash].jwcsite.pages.dev

## 🐛 문제 해결

### 404 에러가 발생하는 경우

1. Cloudflare Pages 대시보드에서 배포 상태 확인
2. 배포 로그에서 에러 메시지 확인
3. 프로젝트 설정 → 빌드 & 배포 → 설정 재확인

### DNS가 해석되지 않는 경우

- Cloudflare Pages 프로젝트가 생성되지 않았거나 삭제됨
- 위의 단계를 따라 새로 생성 필요

### 커스텀 도메인 연결 (선택사항)

1. Cloudflare Pages 프로젝트 설정
2. **"Custom domains"** 탭
3. 도메인 추가 및 DNS 설정

## 📝 현재 버전 정보

- **버전**: v3.2
- **저장 방식**: IndexedDB (브라우저 로컬)
- **관리자 비밀번호**: 1111
- **마지막 업데이트**: 2024-03-08

## ⚠️ 중요 참고 사항

**IndexedDB 사용**: 이 프로젝트는 브라우저의 IndexedDB를 사용하므로:

- ✅ 별도의 서버나 데이터베이스 불필요
- ✅ 순수 정적 사이트로 배포 가능
- ⚠️ 브라우저별로 데이터가 독립적으로 저장됨
- ⚠️ 사용자가 브라우저 데이터를 삭제하면 업로드한 이미지도 삭제됨

## 🎯 배포 후 확인사항

1. ✅ https://jwcsite.pages.dev 접속 확인
2. ✅ 모든 페이지 로딩 확인 (Home, About, Products, Contact)
3. ✅ 관리자 페이지 로그인 (비밀번호: 1111)
4. ✅ 로고 업로드 테스트
5. ✅ 히어로 이미지 업로드 테스트

---

**참고 문서**: https://developers.cloudflare.com/pages/
