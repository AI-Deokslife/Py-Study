// API 설정 파일
// 실제 배포 시에는 이 파일을 .gitignore에 추가하거나 환경변수를 사용하세요

const CONFIG = {
    // Netlify Functions를 통한 API 호출로 변경 (보안 강화)
    GEMINI_API_KEY: null, // 더 이상 클라이언트에서 API 키 노출하지 않음
    
    // Netlify Functions 엔드포인트 URL
    GEMINI_API_URL: '/.netlify/functions/gemini-api'
};

// 설정을 전역으로 노출
window.APP_CONFIG = CONFIG;