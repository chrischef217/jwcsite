# 🚨 중요: 이미지 저장 방식 변경

## 변경 사항 (v3.0)

### ❌ 이전 방식 (IndexedDB)
- 브라우저의 IndexedDB에 이미지 저장
- **문제점**: 각 디바이스마다 별도의 데이터 보관
- 배포 후 다른 기기에서 접속하면 이미지가 보이지 않음

### ✅ 새로운 방식 (RESTful Table API)
- **Genspark 서버 데이터베이스**에 이미지 저장
- 모든 디바이스에서 동일한 이미지 공유
- 배포 후에도 모든 사용자가 같은 이미지 확인 가능
- 브라우저 캐시와 무관하게 영구 저장

## 저장 구조

### images 테이블
| 필드 | 타입 | 설명 |
|------|------|------|
| id | text | 고유 식별자 |
| type | text | 이미지 타입 (logo, heroSlider, pageHero) |
| page | text | 페이지 이름 (about, products, contact) |
| filename | text | 원본 파일명 |
| data | rich_text | Base64 인코딩된 이미지 데이터 |
| order_index | number | 정렬 순서 (히어로 슬라이더용) |

### settings 테이블
| 필드 | 타입 | 설명 |
|------|------|------|
| id | text | 고유 식별자 |
| key | text | 설정 키 |
| value | rich_text | 설정 값 (JSON) |

## API 엔드포인트

```javascript
// 이미지 조회
GET tables/images?search=logo
GET tables/images?search=heroSlider
GET tables/images?search=pageHero

// 설정 조회
GET tables/settings?search=slideInterval
GET tables/settings?search=aboutHeroEnabled

// 이미지 저장
POST tables/images
{ type: 'logo', filename: 'logo.png', data: 'base64...' }

// 이미지 삭제
DELETE tables/images/{id}

// 설정 저장
POST tables/settings
{ key: 'slideInterval', value: '5' }

// 설정 업데이트
PUT tables/settings/{id}
{ key: 'slideInterval', value: '10' }
```

## 이점

1. ✅ **디바이스 간 동기화**: 모든 기기에서 동일한 데이터
2. ✅ **영구 저장**: 서버에 저장되어 데이터 손실 없음
3. ✅ **배포 후 공유**: 관리자가 업로드한 이미지를 모든 방문자가 확인 가능
4. ✅ **브라우저 독립적**: 캐시 삭제와 무관

## 주의사항

- 이미지는 Base64로 인코딩되어 저장됩니다
- 자동 압축이 적용됩니다 (히어로: 1920px/85%, 로고: 500px/90%)
- 기존 IndexedDB 데이터는 사용되지 않습니다 (새로 업로드 필요)

---

**이제 배포 후에도 모든 디바이스에서 이미지가 정상적으로 표시됩니다!** 🎉
