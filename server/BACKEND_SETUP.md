# 백엔드 서버 설정 완료 ✅

## 📁 프로젝트 구조

```
shortglish/
├── server/                 # 백엔드 서버
│   ├── src/
│   │   ├── config/        # 환경 변수 및 인증서 설정
│   │   ├── middleware/    # CORS, Rate Limiting, 에러 핸들링
│   │   ├── routes/        # API 라우트
│   │   ├── services/      # 토스 API 클라이언트
│   │   └── app.ts         # Express 앱 설정
│   ├── certs/             # 클라이언트 인증서 (로컬 개발용)
│   └── package.json
└── src/                   # 프론트엔드 (기존)
```

## 🚀 빠른 시작

### 1. 백엔드 의존성 설치
```bash
cd server
yarn install
```

### 2. 환경 변수 설정
`server/.env` 파일 생성:
```env
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
TOSS_API_BASE_URL=https://apps-in-toss-api.toss.im
TOSS_CLIENT_CERT_PATH=./certs/client-cert.pem
TOSS_CLIENT_KEY_PATH=./certs/client-key.pem
TOSS_DECRYPT_KEY=your_base64_encoded_decrypt_key
TOSS_AAD=TOSS
```

### 3. 클라이언트 인증서 준비
`server/certs/` 디렉토리에 다음 파일 배치:
- `client-cert.pem` - 클라이언트 인증서
- `client-key.pem` - 클라이언트 개인 키

### 4. 개발 서버 실행
```bash
yarn dev
```

서버가 `http://localhost:4000`에서 실행됩니다.

### 5. 프론트엔드 환경 변수 설정
프론트엔드 `.env` 파일에 추가:
```env
VITE_APP_API_BASE_URL=http://localhost:4000
```

## 📡 API 엔드포인트

### 토스 로그인 API 프록시

- `POST /api/toss/generate-token` - AccessToken 발급
- `POST /api/toss/refresh-token` - AccessToken 재발급
- `GET /api/toss/login-me` - 사용자 정보 조회
- `POST /api/toss/unlink/access-token` - AccessToken으로 연결 끊기
- `POST /api/toss/unlink/user-key` - userKey로 연결 끊기

### Health Check
- `GET /health` - 서버 상태 확인

## 🔒 보안 기능

- **CORS**: 허용된 도메인만 접근 가능
- **Rate Limiting**: API 호출 제한 (일반: 15분당 100회, 토스 API: 15분당 50회)
- **에러 핸들링**: 통일된 에러 응답 형식
- **클라이언트 인증서**: mTLS를 통한 토스 API 인증

## 🚢 Railway 배포

자세한 배포 가이드는 `server/DEPLOYMENT.md`를 참고하세요.

### 주요 설정 사항:
1. Root Directory: `server`
2. 환경 변수 설정 (특히 클라이언트 인증서 Base64 인코딩)
3. 프론트엔드 `VITE_APP_API_BASE_URL` 업데이트

## 🔧 주요 변경 사항

### 프론트엔드
- ✅ API 호출 경로를 백엔드 엔드포인트로 변경
- ✅ 환경 변수 `TOSS_API_BASE_URL` → `API_BASE_URL`로 변경
- ✅ 에러 처리 개선

### 백엔드
- ✅ Express + TypeScript 서버 구성
- ✅ 클라이언트 인증서를 통한 mTLS 구현
- ✅ 토스 API 프록시 엔드포인트 구현
- ✅ CORS, Rate Limiting, 에러 핸들링 미들웨어
- ✅ Railway 배포 설정

## 📝 다음 단계

1. 클라이언트 인증서 파일 준비 (`server/certs/`)
2. 로컬에서 테스트
3. Railway에 배포
4. 프론트엔드 환경 변수 업데이트

## 🐛 트러블슈팅

### 클라이언트 인증서 오류
- 인증서 파일 경로 확인
- 파일 권한 확인 (`chmod 600` 권장)

### CORS 오류
- `ALLOWED_ORIGINS`에 프론트엔드 도메인 포함 확인
- 포트 번호까지 정확히 일치해야 함

### API 호출 실패
- 백엔드 서버가 실행 중인지 확인
- `VITE_APP_API_BASE_URL` 환경 변수 확인

