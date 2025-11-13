# Shortglish Backend Server

토스 로그인 API 프록시 서버

## 개발 환경 설정

1. 의존성 설치
```bash
yarn install
```

2. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수들을 설정하세요:

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

3. 클라이언트 인증서 준비
`certs/` 디렉토리에 다음 파일들을 배치하세요:
- `client-cert.pem` - 클라이언트 인증서
- `client-key.pem` - 클라이언트 개인 키

4. 개발 서버 실행
```bash
yarn dev
```

## 프로덕션 빌드

```bash
yarn build
yarn start
```

## Railway 배포

1. Railway에 프로젝트 연결
2. 환경 변수 설정:
   - `PORT` (자동 설정됨)
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS` (프론트엔드 도메인)
   - `TOSS_CLIENT_CERT_PATH` (인증서 파일 경로)
   - `TOSS_CLIENT_KEY_PATH` (키 파일 경로)
   - `TOSS_DECRYPT_KEY` (복호화 키)
   - `TOSS_AAD` (기본값: TOSS)

3. 클라이언트 인증서 파일 업로드
   - Railway의 Secrets 또는 파일 시스템에 업로드
   - 또는 환경 변수로 Base64 인코딩하여 저장

## API 엔드포인트

- `POST /api/toss/generate-token` - AccessToken 발급
- `POST /api/toss/refresh-token` - AccessToken 재발급
- `GET /api/toss/login-me` - 사용자 정보 조회
- `POST /api/toss/unlink/access-token` - AccessToken으로 연결 끊기
- `POST /api/toss/unlink/user-key` - userKey로 연결 끊기
- `GET /health` - Health check

