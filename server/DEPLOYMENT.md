# Railway 배포 가이드

## 1. Railway 프로젝트 생성

1. [Railway](https://railway.app)에 로그인
2. "New Project" 클릭
3. "Deploy from GitHub repo" 선택
4. 저장소 선택 (또는 "Empty Project" 선택 후 수동 연결)

## 2. 프로젝트 설정

### Root Directory 설정
- Railway 대시보드에서 프로젝트 설정
- "Settings" → "Root Directory" → `server` 설정

### Build & Start 명령어
Railway가 자동으로 감지하지만, 명시적으로 설정하려면:
- Build Command: `yarn build`
- Start Command: `yarn start`

## 3. 환경 변수 설정

Railway 대시보드의 "Variables" 탭에서 다음 환경 변수를 설정:

### 필수 환경 변수
```
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend-domain.com
TOSS_API_BASE_URL=https://apps-in-toss-api.toss.im
```

### 클라이언트 인증서 (두 가지 방법 중 선택)

#### 방법 1: Base64 인코딩 (권장)
```bash
# 로컬에서 인증서를 Base64로 인코딩
cat certs/client-cert.pem | base64
cat certs/client-key.pem | base64
```

Railway 환경 변수에 설정:
```
TOSS_CLIENT_CERT_BASE64=<인코딩된_인증서>
TOSS_CLIENT_KEY_BASE64=<인코딩된_키>
```

#### 방법 2: 파일 경로 (복잡함)
Railway의 파일 시스템에 업로드하고 경로 지정:
```
TOSS_CLIENT_CERT_PATH=/path/to/client-cert.pem
TOSS_CLIENT_KEY_PATH=/path/to/client-key.pem
```

### 복호화 키
```
TOSS_DECRYPT_KEY=<base64_encoded_decrypt_key>
TOSS_AAD=TOSS
```

## 4. 배포 확인

1. Railway 대시보드에서 배포 상태 확인
2. 로그 확인: "Deployments" → "View Logs"
3. Health check: `https://your-railway-url.railway.app/health`

## 5. 프론트엔드 환경 변수 설정

프론트엔드 `.env` 파일에 백엔드 URL 추가:
```
VITE_APP_API_BASE_URL=https://your-railway-url.railway.app
```

## 트러블슈팅

### 클라이언트 인증서 오류
- Base64 인코딩이 올바른지 확인
- 환경 변수 이름이 정확한지 확인 (`TOSS_CLIENT_CERT_BASE64`, `TOSS_CLIENT_KEY_BASE64`)

### CORS 오류
- `ALLOWED_ORIGINS`에 프론트엔드 도메인이 정확히 포함되어 있는지 확인
- 콤마로 구분된 여러 도메인 지원

### 빌드 실패
- `server/package.json`의 빌드 스크립트 확인
- TypeScript 컴파일 오류 확인

