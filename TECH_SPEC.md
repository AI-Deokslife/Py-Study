# 기술 명세서: PyStudy - AI 코칭 기반 파이썬 학습 플랫폼

## 📋 문서 정보

| 항목 | 내용 |
|------|------|
| **문서명** | PyStudy Technical Specification |
| **버전** | v1.0 |
| **작성일** | 2025-01-28 |
| **작성자** | Lee Eun Deok |
| **대상 독자** | 개발자, 기술 담당자 |

---

## 1. 시스템 아키텍처

### 1.1 전체 아키텍처 개요

```
┌─────────────────┐    HTTPS     ┌──────────────────┐
│   사용자 브라우저   │ ──────────→ │   PyStudy 웹앱    │
│   (Frontend)    │              │   (Static Site)   │
└─────────────────┘              └──────────────────┘
                                          │
                                          │ REST API
                                          ▼
                                 ┌──────────────────┐
                                 │ Google Gemini API │
                                 │   (AI Service)    │
                                 └──────────────────┘
```

### 1.2 아키텍처 특징
- **클라이언트 사이드 SPA**: 모든 로직이 브라우저에서 실행
- **정적 호스팅 가능**: 별도 서버 없이 CDN으로 배포 가능
- **API 기반 AI 연동**: Google Gemini API를 직접 호출
- **상태 비저장**: 사용자 데이터는 로컬 메모리에만 저장

---

## 2. 기술 스택 상세

### 2.1 Frontend 기술 스택

#### Core Technologies
```javascript
// HTML5
- Semantic Elements: <main>, <section>, <article>
- Accessibility: ARIA attributes, semantic structure
- Meta Tags: Responsive viewport, SEO optimization

// CSS3
- Modern Layout: Flexbox, CSS Grid
- Responsive Design: Mobile-first approach
- Animations: CSS Transitions, Transform
- Custom Properties: CSS Variables for theming

// JavaScript ES6+
- Module System: ES6 Modules
- Async Programming: Promises, async/await
- DOM Manipulation: Modern DOM APIs
- Event Handling: Event delegation, custom events
```

#### External Libraries
```html
<!-- Styling Framework -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">

<!-- Code Syntax Highlighting -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>

<!-- Markdown Rendering -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
```

### 2.2 개발 도구 및 환경

#### Development Environment
```bash
# 권장 개발 환경
- Editor: VS Code + Extensions
  - Live Server: Real-time preview
  - Prettier: Code formatting
  - ESLint: Code quality
  - Tailwind CSS IntelliSense

# Local Development Server
- Python HTTP Server: `python -m http.server`
- Node.js serve: `npx serve .`
- VS Code Live Server Extension

# Browser Developer Tools
- Chrome DevTools: Debugging, Performance
- Firefox Developer Tools: CSS Grid debugging
- Safari Web Inspector: iOS testing
```

---

## 3. 프론트엔드 아키텍처

### 3.1 파일 구조

```
PyStudy/
├── index.html              # 메인 애플리케이션 파일
├── config.js               # API 설정 (실제 키 포함)
├── config.example.js       # API 설정 템플릿
├── README.md              # 프로젝트 문서
├── PRD.md                 # 제품 요구사항 문서
└── TECH_SPEC.md           # 기술 명세서 (현재 파일)
```

### 3.2 HTML 구조

#### 3.2.1 Document Structure
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- Meta Tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI 코칭 기반 파이썬 학습</title>
    
    <!-- External Resources -->
    <!-- Tailwind CSS, Fonts, Libraries -->
    
    <!-- Internal Styles -->
    <style>/* Custom CSS */</style>
</head>
<body class="bg-gray-100 text-gray-800">
    <!-- Application Container -->
    <div class="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        <!-- Header -->
        <header><!-- Title and Description --></header>
        
        <!-- Step 1: Quiz Generator -->
        <div class="step-card"><!-- Problem Generation Interface --></div>
        
        <!-- Step 2-4: Problem Solving Interface (Hidden by default) -->
        <div id="project-section" class="hidden">
            <!-- Generated Problem Display -->
            <!-- Code Input Interface -->
            <!-- Model Answer Display -->
        </div>
        
        <!-- Footer -->
        <footer><!-- Copyright and Credits --></footer>
    </div>
    
    <!-- Modals -->
    <!-- Alert Modal, Explanation Modal -->
    
    <!-- JavaScript -->
    <script>/* Application Logic */</script>
</body>
</html>
```

#### 3.2.2 CSS 아키텍처

**Tailwind CSS Utility Classes**
```css
/* Layout */
.w-full, .max-w-4xl, .mx-auto     /* Container layout */
.flex, .grid, .space-x-*, .gap-*  /* Flexbox and Grid */

/* Responsive Design */
.sm:*, .md:*, .lg:*               /* Breakpoint prefixes */
.grid-cols-2, .sm:grid-cols-3     /* Responsive grid */

/* Components */
.step-card                        /* Custom component class */
.prose                           /* Typography for markdown content */

/* State */
.hidden, .disabled               /* Visibility and interaction states */
```

**Custom CSS Variables**
```css
:root {
  /* Color Palette */
  --color-primary-green: #10b981;
  --color-primary-blue: #3b82f6;
  --color-gray-50: #f9fafb;
  --color-gray-900: #111827;
  
  /* Typography */
  --font-family-primary: 'Noto Sans KR', sans-serif;
  --font-family-mono: 'Courier New', 'Monaco', 'Consolas', monospace;
  
  /* Spacing */
  --spacing-unit: 0.25rem;
  --container-padding: 1rem;
}
```

### 3.3 JavaScript 아키텍처

#### 3.3.1 모듈 구조
```javascript
// Global Namespace
window.APP_CONFIG = CONFIG;

// Application State
let currentQuiz = null;

// DOM Element References
const elements = {
    projectSection: document.getElementById('project-section'),
    generateQuizBtn: document.getElementById('generate-quiz-btn'),
    // ... other elements
};

// Core Functions
async function fetchAIQuiz(topics, difficulty) { /* ... */ }
async function getAIFeedback(prompt, button, spinner, output) { /* ... */ }
function updateUIWithNewQuiz(quiz) { /* ... */ }
function showExplanationModal(title, isLoading, type) { /* ... */ }

// Event Handlers
function handleGenerateQuiz() { /* ... */ }
function toggleAnswer() { /* ... */ }

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners
    // Initialize UI state
});
```

#### 3.3.2 상태 관리

**Application State**
```javascript
// Current Quiz Data
const currentQuiz = {
    id: "timestamp_based_unique_id",
    category: "selected_topic",
    title: "문제 제목",
    description: "마크다운 형식 문제 설명",
    answer_beginner: "초보자용 코드",
    answer_expert: "숙련자용 코드",
    inefficient_code: "비효율적 코드 (리팩토링용)",
    refactored_code: "개선된 코드 (리팩토링용)"
};

// UI State
const uiState = {
    isQuizGenerated: false,
    isAnswerVisible: false,
    activeModal: null,
    loadingStates: {
        generateQuiz: false,
        aiCoaching: false,
        codeOptimization: false
    }
};
```

#### 3.3.3 이벤트 시스템

**Event Delegation Pattern**
```javascript
// Centralized event handling
document.addEventListener('click', (event) => {
    const target = event.target;
    
    // Button click handlers
    if (target.id === 'generate-quiz-btn') {
        handleGenerateQuiz();
    } else if (target.id === 'ai-coach-btn') {
        handleAICoaching();
    } else if (target.id === 'show-answer-btn') {
        toggleAnswer();
    }
    // ... other handlers
});

// Custom Events
const customEvents = {
    QUIZ_GENERATED: 'quizGenerated',
    ANSWER_SHOWN: 'answerShown',
    MODAL_OPENED: 'modalOpened'
};

// Event dispatching
function dispatchCustomEvent(eventType, detail) {
    document.dispatchEvent(new CustomEvent(eventType, { detail }));
}
```

---

## 4. API 연동 명세

### 4.1 Google Gemini API

#### 4.1.1 API 기본 정보
```javascript
// API Configuration
const API_CONFIG = {
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    MODEL: 'gemini-1.5-flash',
    ENDPOINT: '/models/gemini-1.5-flash:generateContent',
    
    // Rate Limits (Free Tier)
    REQUESTS_PER_DAY: 1500,
    REQUESTS_PER_MINUTE: 15,
    
    // Token Limits
    INPUT_TOKEN_LIMIT: 32768,
    OUTPUT_TOKEN_LIMIT: 8192
};
```

#### 4.1.2 요청 구조
```javascript
// Request Payload Structure
const requestPayload = {
    contents: [
        {
            role: "user",
            parts: [
                {
                    text: "AI 프롬프트 텍스트"
                }
            ]
        }
    ],
    generationConfig: {
        temperature: 0.7,           // 창의성 수준
        topK: 40,                  // 토큰 선택 범위
        topP: 0.95,                // 누적 확률 임계값
        maxOutputTokens: 2048      // 최대 출력 토큰
    }
};
```

#### 4.1.3 응답 처리
```javascript
// Response Structure
const apiResponse = {
    candidates: [
        {
            content: {
                parts: [
                    {
                        text: "AI 생성 텍스트"
                    }
                ]
            },
            finishReason: "STOP",
            index: 0,
            safetyRatings: [/* ... */]
        }
    ]
};

// Response Processing
async function processAPIResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    if (result.candidates && result.candidates.length > 0) {
        const rawText = result.candidates[0].content.parts[0].text;
        
        // JSON 파싱 (문제 생성 응답의 경우)
        const cleanedText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    }
    
    throw new Error('Invalid API response format');
}
```

### 4.2 AI 프롬프트 엔지니어링

#### 4.2.1 문제 생성 프롬프트
```javascript
// Dynamic Prompt Generation
function generateProblemPrompt(topics, difficulty, randomSeed) {
    const contexts = ['게임', '음식', '여행', /* ... 30개 항목 */];
    const scenarios = ['관리 시스템', '계산기', /* ... 15개 항목 */];
    const dataTypes = ['점수', '가격', '시간', /* ... 15개 항목 */];
    
    const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const randomDataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
    
    return `
**시드: ${randomSeed}**

${difficulty} 난이도의 완전히 새로운 파이썬 문제를 생성하세요.
주제: ${topics.join(', ')}
상황 키워드: ${randomContext}, ${randomScenario}, ${randomDataType}

**주제 제한 규칙 (매우 중요):**
선택된 주제: ${topics.join(', ')}
- 이 문제는 반드시 선택된 주제만을 다뤄야 합니다
- 다른 주제의 개념을 사용하면 안 됩니다

다음 JSON으로만 응답:
{
    "id": "${randomSeed}",
    "category": "${topics[0]}",
    "title": "문제 제목",
    "description": "상세한 문제 설명 (마크다운)",
    "answer_beginner": "초보자 코드",
    "answer_expert": "고급 코드"
}

모든 텍스트는 한글로, JSON 내 줄바꿈은 \\n으로 이스케이프하세요.
`;
}
```

#### 4.2.2 코드 피드백 프롬프트
```javascript
// AI Coaching Prompt
function generateCoachingPrompt(problemDescription, userCode) {
    return `
You are a friendly Python coding tutor. 
A student is solving the following problem: "${problemDescription}". 
The student's code is: 
\`\`\`python
${userCode}
\`\`\`

Please provide hints without giving away the answer. 
Point out errors, suggest better approaches, or praise good parts. 
Use Korean with a friendly tone. 
**Format your response in Markdown.** 
Never show the complete answer code.
`;
}

// Code Optimization Prompt
function generateOptimizationPrompt(problemDescription, userCode) {
    return `
You are an expert Python code optimizer. 
Analyze the following Python code in the context of the problem: "${problemDescription}". 
The student's code is: 
\`\`\`python
${userCode}
\`\`\`

Provide specific suggestions to improve its performance (time complexity, space complexity) 
and make it more Pythonic. Explain why your suggestions are better. 
Use Korean with a professional but easy-to-understand tone. 
**Format your response in Markdown.**
`;
}
```

---

## 5. UI/UX 구현 명세

### 5.1 반응형 디자인

#### 5.1.1 브레이크포인트
```css
/* Tailwind CSS Breakpoints */
/* Default: Mobile First (< 640px) */
sm: 640px   /* Small devices (tablets) */
md: 768px   /* Medium devices (small laptops) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
```

#### 5.1.2 레이아웃 적응
```html
<!-- Responsive Grid Example -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
    <!-- Topic selection checkboxes -->
</div>

<!-- Responsive Button Layout -->
<div class="flex flex-wrap gap-2 mt-4">
    <button class="w-full sm:w-auto flex-grow">AI 코칭 받기</button>
    <button class="w-full sm:w-auto flex-grow">코드 최적화</button>
</div>
```

### 5.2 컴포넌트 시스템

#### 5.2.1 Step Card Component
```css
.step-card {
    background-color: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.step-number {
    background-color: #10B981;
    color: white;
    border-radius: 9999px;
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin-right: 0.75rem;
    flex-shrink: 0;
}
```

#### 5.2.2 Modal System
```javascript
// Modal Management
const modalSystem = {
    activeModal: null,
    
    show(modalId, config = {}) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.activeModal = modalId;
        
        // Apply type-specific styling
        if (config.type) {
            this.applyTypeStyles(modal, config.type);
        }
    },
    
    hide(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        this.activeModal = null;
    },
    
    applyTypeStyles(modal, type) {
        const colors = {
            beginner: {
                bg: 'from-green-500 to-emerald-600',
                spinner: 'border-green-200 border-t-green-500'
            },
            expert: {
                bg: 'from-blue-500 to-indigo-600',
                spinner: 'border-blue-200 border-t-blue-500'
            }
        };
        
        const color = colors[type];
        if (color) {
            const header = modal.querySelector('.bg-gradient-to-r');
            header.className = `bg-gradient-to-r ${color.bg} text-white p-6 flex items-center justify-between`;
        }
    }
};
```

### 5.3 코드 스타일링

#### 5.3.1 Syntax Highlighting
```javascript
// Highlight.js Integration
function highlightCode() {
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
}

// Custom highlighting for Python
hljs.configure({
    languages: ['python'],
    ignoreUnescapedHTML: true
});
```

#### 5.3.2 Code Formatting
```css
/* Code Block Styling */
.prose pre {
    background: #1e293b !important;
    color: #f8fafc !important;
    padding: 1.5rem;
    border-radius: 0.75rem;
    overflow-x: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    border: 2px solid #475569;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Prevent horizontal scrolling */
.prose pre code {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Courier New', 'Monaco', 'Consolas', monospace;
}
```

---

## 6. 성능 최적화

### 6.1 로딩 성능

#### 6.1.1 리소스 최적화
```html
<!-- Font Loading Optimization -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Critical CSS Inlining -->
<style>
/* Critical styles for above-the-fold content */
</style>

<!-- Non-critical CSS Loading -->
<link rel="stylesheet" href="styles.css" media="print" onload="this.media='all'">
```

#### 6.1.2 JavaScript 최적화
```javascript
// Debounced API calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for non-critical features
const lazyLoadModal = () => {
    if (!document.getElementById('explanation-modal')) {
        // Create modal elements only when needed
        createExplanationModal();
    }
};
```

### 6.2 렌더링 성능

#### 6.2.1 DOM 조작 최적화
```javascript
// Batch DOM updates
function updateUI(data) {
    // Start batch update
    const fragment = document.createDocumentFragment();
    
    // Build DOM structure in memory
    data.forEach(item => {
        const element = createElement(item);
        fragment.appendChild(element);
    });
    
    // Single DOM insertion
    container.appendChild(fragment);
}

// Use requestAnimationFrame for smooth animations
function animateElement(element, properties) {
    requestAnimationFrame(() => {
        Object.assign(element.style, properties);
    });
}
```

#### 6.2.2 메모리 관리
```javascript
// Event listener cleanup
const cleanup = () => {
    // Remove event listeners
    document.removeEventListener('click', handleClick);
    
    // Clear timers
    clearTimeout(timerId);
    clearInterval(intervalId);
    
    // Clear references
    currentQuiz = null;
    elements = {};
};

// Prevent memory leaks in closures
function createHandler(data) {
    return function handler(event) {
        // Use data directly, don't capture large objects
        processEvent(event, data.id);
    };
}
```

---

## 7. 보안 고려사항

### 7.1 클라이언트 사이드 보안

#### 7.1.1 API 키 보안
```javascript
// API 키 노출 위험 최소화
const API_CONFIG = {
    // ⚠️ Current implementation (not ideal for production)
    apiKey: window.APP_CONFIG?.GEMINI_API_KEY,
    
    // ✅ Recommended for production
    // Use environment variables or server proxy
    getApiKey() {
        return process.env.GEMINI_API_KEY || this.apiKey;
    }
};

// API 요청 보안 헤더
const secureApiRequest = async (url, payload) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', // CSRF 방지
            'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(payload)
    });
    
    return response;
};
```

#### 7.1.2 입력 검증 및 새니타이징
```javascript
// 사용자 입력 검증
function validateUserInput(input) {
    // Length validation
    if (input.length > 10000) {
        throw new Error('입력이 너무 깁니다.');
    }
    
    // Basic sanitization
    const sanitized = input
        .replace(/<script/gi, '&lt;script')
        .replace(/javascript:/gi, '');
    
    return sanitized;
}

// HTML 출력 새니타이징
function safeInnerHTML(element, content) {
    // Use textContent for plain text
    element.textContent = content;
    
    // Or use trusted markdown parser
    element.innerHTML = marked.parse(content, {
        sanitize: true,
        gfm: true
    });
}
```

### 7.2 데이터 프라이버시

#### 7.2.1 로컬 데이터 관리
```javascript
// 사용자 데이터 로컬 저장만 사용
const dataManager = {
    // Session storage for temporary data
    saveTemporary(key, data) {
        sessionStorage.setItem(key, JSON.stringify(data));
    },
    
    // No persistent storage of sensitive data
    clearOnUnload() {
        window.addEventListener('beforeunload', () => {
            sessionStorage.clear();
            // Clear any sensitive variables
            currentQuiz = null;
            userCodeInput.value = '';
        });
    }
};
```

#### 7.2.2 API 통신 보안
```javascript
// HTTPS 강제
function enforceHTTPS() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
}

// 요청 타임아웃 설정
const API_TIMEOUT = 30000; // 30 seconds

async function secureApiCall(url, payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('요청 시간이 초과되었습니다.');
        }
        throw error;
    }
}
```

---

## 8. 테스팅 전략

### 8.1 단위 테스트

#### 8.1.1 Core Functions Testing
```javascript
// Test Framework: Jest (example)
describe('AI Quiz Generation', () => {
    test('should generate valid quiz data', async () => {
        const topics = ['입력', '출력'];
        const difficulty = '초급';
        
        const quiz = await fetchAIQuiz(topics, difficulty);
        
        expect(quiz).toHaveProperty('id');
        expect(quiz).toHaveProperty('title');
        expect(quiz).toHaveProperty('description');
        expect(quiz).toHaveProperty('answer_beginner');
        expect(quiz).toHaveProperty('answer_expert');
    });
    
    test('should handle API errors gracefully', async () => {
        // Mock failed API response
        global.fetch = jest.fn().mockRejectedValue(new Error('API Error'));
        
        await expect(fetchAIQuiz(['입력'], '초급')).rejects.toThrow();
    });
});
```

#### 8.1.2 UI Component Testing
```javascript
describe('Modal System', () => {
    test('should show and hide modals correctly', () => {
        const modal = document.createElement('div');
        modal.id = 'test-modal';
        modal.classList.add('hidden');
        document.body.appendChild(modal);
        
        showExplanationModal('Test Title');
        expect(modal.classList.contains('hidden')).toBe(false);
        
        hideExplanationModal();
        expect(modal.classList.contains('hidden')).toBe(true);
    });
});
```

### 8.2 통합 테스트

#### 8.2.1 E2E Testing (Cypress example)
```javascript
describe('PyStudy E2E Tests', () => {
    it('should complete full learning flow', () => {
        cy.visit('/');
        
        // Select difficulty and topic
        cy.get('#level-beginner').click();
        cy.get('input[value="입력"]').check();
        
        // Generate quiz
        cy.get('#generate-quiz-btn').click();
        cy.get('#project-section').should('be.visible');
        
        // Write code
        cy.get('#user-code-input').type('print("Hello World")');
        
        // Get AI feedback
        cy.get('#ai-coach-btn').click();
        cy.get('#ai-feedback').should('be.visible');
        
        // Check answers
        cy.get('#show-answer-btn').click();
        cy.get('#answer-container').should('be.visible');
    });
});
```

### 8.3 성능 테스트

#### 8.3.1 Lighthouse Integration
```javascript
// Performance monitoring
const performanceMetrics = {
    measurePageLoad() {
        performance.mark('page-start');
        
        window.addEventListener('load', () => {
            performance.mark('page-end');
            performance.measure('page-load', 'page-start', 'page-end');
            
            const measurement = performance.getEntriesByName('page-load')[0];
            console.log('Page load time:', measurement.duration);
        });
    },
    
    measureAPIResponse() {
        performance.mark('api-start');
        
        return async (apiCall) => {
            const result = await apiCall();
            performance.mark('api-end');
            performance.measure('api-response', 'api-start', 'api-end');
            
            return result;
        };
    }
};
```

---

## 9. 배포 및 운영

### 9.1 빌드 프로세스

#### 9.1.1 정적 사이트 최적화
```bash
# Build script example
#!/bin/bash

# 1. HTML minification
html-minifier --collapse-whitespace --remove-comments index.html -o dist/index.html

# 2. CSS optimization
postcss styles.css --use autoprefixer --use cssnano -o dist/styles.min.css

# 3. JavaScript minification
terser script.js --compress --mangle -o dist/script.min.js

# 4. Asset optimization
imagemin src/images/* --out-dir=dist/images

echo "Build completed successfully!"
```

#### 9.1.2 환경별 설정
```javascript
// Environment configuration
const env = {
    development: {
        API_URL: 'https://generativelanguage.googleapis.com/v1beta',
        DEBUG: true,
        LOG_LEVEL: 'debug'
    },
    production: {
        API_URL: 'https://generativelanguage.googleapis.com/v1beta',
        DEBUG: false,
        LOG_LEVEL: 'error'
    }
};

const currentEnv = env[process.env.NODE_ENV || 'development'];
```

### 9.2 호스팅 옵션

#### 9.2.1 정적 호스팅 서비스
```yaml
# Netlify configuration (_netlify.toml)
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

# Vercel configuration (vercel.json)
{
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

#### 9.2.2 CDN 최적화
```html
<!-- Resource hints for performance -->
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="preconnect" href="https://generativelanguage.googleapis.com">

<!-- Critical resource preloading -->
<link rel="preload" href="https://cdn.tailwindcss.com" as="style">
<link rel="preload" href="config.js" as="script">
```

### 9.3 모니터링 및 분석

#### 9.3.1 에러 트래킹
```javascript
// Error monitoring
const errorTracker = {
    init() {
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    },
    
    handleError(event) {
        const errorData = {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logError(errorData);
    },
    
    handlePromiseRejection(event) {
        const errorData = {
            type: 'unhandled-promise-rejection',
            reason: event.reason,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        
        this.logError(errorData);
    },
    
    logError(errorData) {
        // Send to logging service
        console.error('Application Error:', errorData);
        
        // In production, send to external service
        // fetch('/api/errors', {
        //     method: 'POST',
        //     body: JSON.stringify(errorData)
        // });
    }
};
```

#### 9.3.2 사용자 분석
```javascript
// Usage analytics
const analytics = {
    trackEvent(category, action, label, value) {
        const eventData = {
            category,
            action,
            label,
            value,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId(),
            userId: this.getUserId()
        };
        
        // Send to analytics service
        this.sendEvent(eventData);
    },
    
    trackPageView(page) {
        this.trackEvent('Navigation', 'Page View', page);
    },
    
    trackQuizGeneration(difficulty, topics) {
        this.trackEvent('Learning', 'Quiz Generated', `${difficulty}: ${topics.join(',')}`);
    },
    
    trackAIInteraction(type, success) {
        this.trackEvent('AI', type, success ? 'Success' : 'Failure');
    }
};
```

---

## 10. 향후 기술 로드맵

### 10.1 Phase 2: Backend Integration

#### 10.1.1 서버리스 아키텍처
```javascript
// Serverless function for API proxy (Vercel/Netlify)
export default async function handler(req, res) {
    const { prompt, type } = req.body;
    
    // Server-side API key management
    const apiKey = process.env.GEMINI_API_KEY;
    
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] })
        });
        
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'API request failed' });
    }
}
```

#### 10.1.2 데이터베이스 통합
```sql
-- User progress tracking schema
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    quiz_data JSONB,
    user_code TEXT,
    success BOOLEAN,
    difficulty VARCHAR(20),
    topics TEXT[],
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_progress (
    user_id UUID REFERENCES users(id),
    topic VARCHAR(50),
    level INTEGER DEFAULT 1,
    total_attempts INTEGER DEFAULT 0,
    successful_attempts INTEGER DEFAULT 0,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, topic)
);
```

### 10.2 Phase 3: Advanced Features

#### 10.2.1 실시간 코드 실행
```javascript
// WebAssembly Python interpreter integration
const pythonExecutor = {
    async init() {
        this.pyodide = await loadPyodide();
        await this.pyodide.loadPackage(['numpy', 'pandas']); // Common packages
    },
    
    async executeCode(code) {
        try {
            // Capture stdout
            this.pyodide.runPython(`
                import sys
                from io import StringIO
                old_stdout = sys.stdout
                sys.stdout = buffer = StringIO()
            `);
            
            // Execute user code
            this.pyodide.runPython(code);
            
            // Get output
            const output = this.pyodide.runPython(`
                sys.stdout = old_stdout
                buffer.getvalue()
            `);
            
            return { success: true, output };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
};
```

#### 10.2.2 AI 개인화 시스템
```javascript
// Personalized AI tutor
const personalizedAI = {
    userProfile: {
        learningStyle: 'visual', // visual, auditory, kinesthetic
        proficiencyLevel: 1,     // 1-10 scale
        preferredTopics: [],
        weakAreas: [],
        strongAreas: []
    },
    
    generatePersonalizedPrompt(basePrompt, userProfile) {
        const personalizations = {
            visual: "include diagrams and visual explanations",
            auditory: "use step-by-step verbal explanations",
            kinesthetic: "provide hands-on coding examples"
        };
        
        const styleInstruction = personalizations[userProfile.learningStyle];
        const levelAdjustment = this.getLevelAdjustment(userProfile.proficiencyLevel);
        
        return `${basePrompt}
        
        Personal Learning Style: ${styleInstruction}
        Proficiency Level: ${levelAdjustment}
        Focus on weak areas: ${userProfile.weakAreas.join(', ')}
        `;
    },
    
    updateProfile(attemptData) {
        // Machine learning logic to update user profile
        // based on quiz attempts and success patterns
    }
};
```

---

## 11. 결론

PyStudy는 현대적인 웹 기술과 AI를 결합하여 혁신적인 학습 경험을 제공하는 플랫폼입니다. 클라이언트 사이드 아키텍처로 시작하여 점진적으로 서버리스 백엔드와 고급 AI 기능을 통합할 계획입니다.

### 핵심 기술적 성과
- **순수 프론트엔드**: 복잡한 서버 인프라 없이도 강력한 AI 기능 구현
- **반응형 설계**: 모든 디바이스에서 일관된 사용자 경험
- **모듈화된 구조**: 유지보수와 확장이 용이한 코드베이스
- **성능 최적화**: 빠른 로딩과 부드러운 상호작용

### 확장 가능성
- 서버리스 아키텍처로의 자연스러운 마이그레이션
- 마이크로서비스 패턴 적용 가능
- AI 모델 교체 및 다중 AI 지원
- 실시간 협업 기능 추가 가능

이 기술 명세서는 개발팀이 PyStudy를 이해하고 발전시키는 데 필요한 모든 기술적 정보를 제공합니다.

---

**문서 정보**
- 최종 수정일: 2025-01-28
- 다음 리뷰일: 2025-02-28
- 기술 담당자: Lee Eun Deok