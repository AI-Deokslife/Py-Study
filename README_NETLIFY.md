# 파이썬 학습 플랫폼 - Netlify 배포 가이드

## 보안 개선사항

이 프로젝트는 API 키 보안을 위해 Netlify Functions를 사용하도록 개선되었습니다.

### 변경사항

1. **API 키 보안화**: 클라이언트 사이드에서 API 키가 노출되지 않음
2. **Netlify Functions 추가**: 서버 사이드에서 Gemini API 호출
3. **환경변수 사용**: API 키를 안전하게 관리

## Netlify 배포 방법

### 1. 저장소 준비
```bash
git init
git add .
git commit -m "Initial commit with Netlify Functions"
git remote add origin <your-repository-url>
git push -u origin main
```

### 2. Netlify에서 사이트 생성
1. Netlify 대시보드에서 "New site from Git" 선택
2. GitHub/GitLab 저장소 연결
3. 빌드 설정:
   - Build command: (비워둠 또는 `echo "No build needed"`)
   - Publish directory: `.` (현재 디렉토리)

### 3. 환경변수 설정 (중요!)
Netlify 사이트 설정에서 Environment Variables 추가:
```
GEMINI_API_KEY = your_actual_gemini_api_key_here
```

### 4. 배포 확인
- Functions가 올바르게 배포되었는지 확인: `/.netlify/functions/gemini-api`
- 브라우저 개발자 도구에서 API 호출이 Netlify Functions로 이동했는지 확인

## 로컬 개발

### 1. Netlify CLI 설치
```bash
npm install -g netlify-cli
```

### 2. 로컬 환경변수 설정
`.env` 파일 생성 (`.env.example` 참고):
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 로컬 서버 실행
```bash
netlify dev
```

## 보안 체크리스트

- ✅ API 키가 클라이언트 코드에 노출되지 않음
- ✅ Netlify Functions를 통한 서버 사이드 API 호출
- ✅ 환경변수로 API 키 관리
- ✅ CORS 헤더 적절히 설정
- ✅ 에러 처리 개선

## 파일 구조

```
PyStudy2/
├── index.html              # 메인 웹 애플리케이션
├── config.js              # 클라이언트 설정 (API 키 제거됨)
├── netlify.toml           # Netlify 설정
├── .env.example           # 환경변수 예시
├── netlify/
│   └── functions/
│       └── gemini-api.js  # Gemini API 프록시 함수
└── README_NETLIFY.md      # 이 파일
```

## 주요 기능

- 파이썬 문제 자동 생성 (초급/중급/고급/리팩토링 챌린지)
- AI 코칭 및 최적화 제안
- 초보자/숙련자용 모범 답안 제공
- 상세한 코드 설명 모달

## 주의사항

1. `.env` 파일은 절대 Git에 커밋하지 마세요
2. API 키는 반드시 Netlify 환경변수에 설정하세요
3. 로컬 개발 시에만 `.env` 파일을 사용하세요