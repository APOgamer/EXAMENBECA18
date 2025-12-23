// Security and Anti-Tampering System
class SecurityManager {
    constructor() {
        this.isExamActive = false;
        this.securityOverlay = document.getElementById('security-overlay');
        this.initializeSecurity();
    }

    initializeSecurity() {
        // Disable right-click context menu during exams
        document.addEventListener('contextmenu', (e) => {
            if (this.isExamActive && CONFIG.SECURITY.DISABLE_RIGHT_CLICK) {
                e.preventDefault();
                this.logSuspiciousActivity('right_click_attempt');
                return false;
            }
        });

        // Disable text selection during exams
        document.addEventListener('selectstart', (e) => {
            if (this.isExamActive && CONFIG.SECURITY.DISABLE_TEXT_SELECTION) {
                e.preventDefault();
                return false;
            }
        });

        // Disable drag and drop
        document.addEventListener('dragstart', (e) => {
            if (this.isExamActive) {
                e.preventDefault();
                return false;
            }
        });

        // Monitor tab visibility changes
        document.addEventListener('visibilitychange', () => {
            if (this.isExamActive && document.hidden) {
                this.handleTabSwitch();
            }
        });

        // Monitor window focus
        window.addEventListener('blur', () => {
            if (this.isExamActive) {
                this.handleFocusLoss();
            }
        });

        window.addEventListener('focus', () => {
            if (this.isExamActive) {
                this.handleFocusReturn();
            }
        });

        // Disable common keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isExamActive) {
                this.handleKeyboardShortcuts(e);
            }
        });

        // Monitor for dev tools
        this.monitorDevTools();
    }

    activateExamMode() {
        this.isExamActive = true;
        document.body.classList.add('exam-mode', 'no-select');
        securityState.examStartTime = Date.now();
        this.createWatermark();
        this.showSecurityIndicator();
        this.logSuspiciousActivity('exam_started');
    }

    deactivateExamMode() {
        this.isExamActive = false;
        document.body.classList.remove('exam-mode', 'no-select', 'blur-content');
        this.removeWatermark();
        this.hideSecurityIndicator();
        this.hideSecurityOverlay();
        this.hideTabWarning();
        this.logSuspiciousActivity('exam_ended');
    }

    handleTabSwitch() {
        securityState.tabSwitches++;
        this.logSuspiciousActivity('tab_switch');
        
        if (CONFIG.SECURITY.TAB_SWITCH_WARNING) {
            this.showTabWarning();
        }
        
        if (CONFIG.SECURITY.BLUR_ON_FOCUS_LOSS) {
            document.body.classList.add('blur-content');
        }
    }

    handleFocusLoss() {
        securityState.focusLosses++;
        this.logSuspiciousActivity('focus_loss');
        
        if (CONFIG.SECURITY.BLUR_ON_FOCUS_LOSS) {
            document.body.classList.add('blur-content');
        }
    }

    handleFocusReturn() {
        document.body.classList.remove('blur-content');
        this.hideTabWarning();
    }

    handleKeyboardShortcuts(e) {
        // Disable F12 (Dev Tools)
        if (e.key === 'F12') {
            e.preventDefault();
            this.logSuspiciousActivity('f12_attempt');
            this.showSecurityWarning('Herramientas de desarrollador deshabilitadas durante el examen');
            return false;
        }

        // Disable Ctrl+Shift+I (Dev Tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
            e.preventDefault();
            this.logSuspiciousActivity('dev_tools_shortcut');
            this.showSecurityWarning('Herramientas de desarrollador deshabilitadas durante el examen');
            return false;
        }

        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            this.logSuspiciousActivity('view_source_attempt');
            this.showSecurityWarning('Ver código fuente deshabilitado durante el examen');
            return false;
        }

        // Disable Ctrl+S (Save Page)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.logSuspiciousActivity('save_page_attempt');
            return false;
        }

        // Disable Ctrl+A (Select All)
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            this.logSuspiciousActivity('select_all_attempt');
            return false;
        }

        // Disable Ctrl+C (Copy)
        if (e.ctrlKey && e.key === 'c') {
            e.preventDefault();
            this.logSuspiciousActivity('copy_attempt');
            return false;
        }

        // Disable Ctrl+V (Paste)
        if (e.ctrlKey && e.key === 'v') {
            e.preventDefault();
            this.logSuspiciousActivity('paste_attempt');
            return false;
        }

        // Disable Alt+Tab (Task Switch)
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            this.logSuspiciousActivity('alt_tab_attempt');
            return false;
        }
    }

    monitorDevTools() {
        // Monitor console access
        let devtools = {open: false, orientation: null};
        const threshold = 160;

        setInterval(() => {
            if (this.isExamActive) {
                if (window.outerHeight - window.innerHeight > threshold || 
                    window.outerWidth - window.innerWidth > threshold) {
                    if (!devtools.open) {
                        devtools.open = true;
                        this.logSuspiciousActivity('dev_tools_opened');
                        this.showSecurityWarning('Herramientas de desarrollador detectadas');
                    }
                } else {
                    devtools.open = false;
                }
            }
        }, 500);

        // Override console methods
        const originalLog = console.log;
        console.log = (...args) => {
            if (this.isExamActive) {
                this.logSuspiciousActivity('console_access');
                return;
            }
            originalLog.apply(console, args);
        };
    }

    createWatermark() {
        const watermark = document.createElement('div');
        watermark.id = 'exam-watermark';
        watermark.className = 'exam-watermark';
        watermark.textContent = `BECA18 ${new Date().toLocaleString()}`;
        document.body.appendChild(watermark);
    }

    removeWatermark() {
        const watermark = document.getElementById('exam-watermark');
        if (watermark) {
            watermark.remove();
        }
    }

    showSecurityIndicator() {
        let indicator = document.getElementById('security-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'security-indicator';
            indicator.className = 'security-indicator';
            indicator.textContent = '🔒 MODO SEGURO';
            document.body.appendChild(indicator);
        }
        indicator.classList.add('active');
    }

    hideSecurityIndicator() {
        const indicator = document.getElementById('security-indicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }

    showTabWarning() {
        let warning = document.getElementById('tab-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'tab-warning';
            warning.className = 'tab-warning';
            warning.innerHTML = '⚠️ ADVERTENCIA: Mantén el foco en la ventana del examen';
            document.body.appendChild(warning);
        }
        warning.classList.add('show');
        
        setTimeout(() => {
            warning.classList.remove('show');
        }, 3000);
    }

    hideTabWarning() {
        const warning = document.getElementById('tab-warning');
        if (warning) {
            warning.classList.remove('show');
        }
    }

    showSecurityWarning(message) {
        const overlay = document.getElementById('security-overlay');
        const messageElement = overlay.querySelector('.security-message p');
        messageElement.textContent = message;
        overlay.classList.remove('hidden');
    }

    hideSecurityOverlay() {
        this.securityOverlay.classList.add('hidden');
    }

    logSuspiciousActivity(activity) {
        if (!CONFIG.SECURITY.LOG_SUSPICIOUS_ACTIVITY) return;

        const logEntry = {
            timestamp: Date.now(),
            activity: activity,
            examTime: this.isExamActive ? Date.now() - securityState.examStartTime : null,
            userAgent: navigator.userAgent
        };

        securityState.suspiciousActivity.push(logEntry);
        
        // Store in localStorage
        const logs = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.SECURITY_LOGS) || '[]');
        logs.push(logEntry);
        
        // Keep only last 100 entries
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem(CONFIG.STORAGE_KEYS.SECURITY_LOGS, JSON.stringify(logs));

        // Show activity log in development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.showActivityLog(activity);
        }
    }

    showActivityLog(activity) {
        let log = document.getElementById('activity-log');
        if (!log) {
            log = document.createElement('div');
            log.id = 'activity-log';
            log.className = 'activity-log';
            document.body.appendChild(log);
        }
        
        const timestamp = new Date().toLocaleTimeString();
        log.innerHTML += `${timestamp}: ${activity}<br>`;
        log.scrollTop = log.scrollHeight;
        log.classList.add('show');
        
        setTimeout(() => {
            log.classList.remove('show');
        }, 5000);
    }

    checkDailyAttempts(examType) {
        const today = new Date().toDateString();
        const attempts = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.ATTEMPT_COUNTER) || '{}');
        
        if (!attempts[today]) {
            attempts[today] = {};
        }
        
        if (!attempts[today][examType]) {
            attempts[today][examType] = 0;
        }
        
        if (attempts[today][examType] >= CONFIG.SECURITY.MAX_ATTEMPTS_PER_DAY) {
            return false;
        }
        
        attempts[today][examType]++;
        localStorage.setItem(CONFIG.STORAGE_KEYS.ATTEMPT_COUNTER, JSON.stringify(attempts));
        
        return true;
    }

    getRemainingAttempts(examType) {
        const today = new Date().toDateString();
        const attempts = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.ATTEMPT_COUNTER) || '{}');
        
        if (!attempts[today] || !attempts[today][examType]) {
            return CONFIG.SECURITY.MAX_ATTEMPTS_PER_DAY;
        }
        
        return Math.max(0, CONFIG.SECURITY.MAX_ATTEMPTS_PER_DAY - attempts[today][examType]);
    }

    // Answer obfuscation methods
    obfuscateAnswers(questions) {
        return questions.map(question => {
            const obfuscated = {...question};
            
            // Encrypt correct answer
            obfuscated.correctAnswer = this.encryptAnswer(question.correctAnswer);
            
            // Remove explanation temporarily
            obfuscated.explanation = this.encryptAnswer(question.explanation);
            
            return obfuscated;
        });
    }

    encryptAnswer(answer) {
        // Simple encryption using session-based key
        const sessionKey = this.getSessionKey();
        // Convert to UTF-8 bytes first, then to base64 to handle special characters
        const data = JSON.stringify({
            data: answer,
            key: sessionKey,
            timestamp: Date.now()
        });
        
        // Use TextEncoder to handle UTF-8 characters properly
        const encoder = new TextEncoder();
        const bytes = encoder.encode(data);
        
        // Convert bytes to base64
        let binary = '';
        bytes.forEach(byte => binary += String.fromCharCode(byte));
        return btoa(binary);
    }

    decryptAnswer(encryptedAnswer) {
        try {
            // Decode from base64 to bytes, then to UTF-8 string
            const binary = atob(encryptedAnswer);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            
            // Use TextDecoder to handle UTF-8 characters properly
            const decoder = new TextDecoder();
            const jsonString = decoder.decode(bytes);
            const decoded = JSON.parse(jsonString);
            if (decoded.key === this.getSessionKey()) {
                return decoded.data;
            }
        } catch (e) {
            console.error('Decryption failed');
        }
        return null;
    }

    getSessionKey() {
        if (!this.sessionKey) {
            this.sessionKey = Math.random().toString(36).substring(2, 15) + 
                            Math.random().toString(36).substring(2, 15);
        }
        return this.sessionKey;
    }

    // Generate new session key for each exam
    generateNewSessionKey() {
        this.sessionKey = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
    }
}

// Global security manager instance
window.securityManager = new SecurityManager();

// Global functions for security overlay
function hideSecurityOverlay() {
    securityManager.hideSecurityOverlay();
}