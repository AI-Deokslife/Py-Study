// API 설정 예시 파일
// 이 파일을 config.js로 복사하고 실제 API 키를 입력하세요

const CONFIG = {
    // Google Gemini API 키를 여기에 설정
    GEMINI_API_KEY: 'YOUR_GOOGLE_API_KEY_HERE',
    
    // API URL 설정 (Gemini 2.5 Flash 사용 - 최신 버전, 개선된 성능과 효율성)
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
};

// 설정을 전역으로 노출
window.APP_CONFIG = CONFIG;