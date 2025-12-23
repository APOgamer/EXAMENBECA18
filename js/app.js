// Main Application Controller
class App {
    constructor() {
        this.currentSection = 'landing';
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initialize());
            } else {
                await this.initialize();
            }
        } catch (error) {
            console.error('Error initializing app:', error);
            this.showErrorMessage('Error al inicializar la aplicación');
        }
    }

    async initialize() {
        try {
            // Initialize storage
            await storageManager.initDB();
            
            // Setup navigation
            this.setupNavigation();
            
            // Setup security
            this.setupSecurity();
            
            // Load initial content
            this.loadInitialContent();
            
            // Setup keyboard shortcuts
            this.setupKeyboardShortcuts();
            
            // Setup window events
            this.setupWindowEvents();
            
            this.isInitialized = true;
            console.log('Beca 18 Platform initialized successfully');
            
        } catch (error) {
            console.error('Error during initialization:', error);
            this.showErrorMessage('Error durante la inicialización');
        }
    }

    setupNavigation() {
        // Setup navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Setup section-specific initialization
        this.sectionInitializers = {
            'landing': () => this.initLandingSection(),
            'syllabus': () => this.initSyllabusSection(),
            'complete-exam': () => this.initCompleteExamSection(),
            'micro-exam': () => this.initMicroExamSection()
        };
    }

    setupSecurity() {
        // Security is already initialized in security.js
        // Add any additional security setup here
        
        // Monitor for suspicious activity during exams
        document.addEventListener('keydown', (e) => {
            if (currentExamState.isActive) {
                this.handleExamKeyPress(e);
            }
        });

        // Handle visibility changes during exams
        document.addEventListener('visibilitychange', () => {
            if (currentExamState.isActive && document.hidden) {
                this.handleExamFocusLoss();
            }
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Don't handle shortcuts during exams
            if (currentExamState.isActive) return;

            // Alt + 1-4 for quick navigation
            if (e.altKey && !e.ctrlKey && !e.shiftKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.showSection('landing');
                        break;
                    case '2':
                        e.preventDefault();
                        this.showSection('syllabus');
                        break;
                    case '3':
                        e.preventDefault();
                        this.showSection('complete-exam');
                        break;
                    case '4':
                        e.preventDefault();
                        this.showSection('micro-exam');
                        break;
                }
            }

            // Escape to go back to landing
            if (e.key === 'Escape' && this.currentSection !== 'landing') {
                this.showSection('landing');
            }
        });
    }

    setupWindowEvents() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle before unload (warn if exam is active)
        window.addEventListener('beforeunload', (e) => {
            if (currentExamState.isActive) {
                e.preventDefault();
                e.returnValue = '¿Estás seguro de que quieres salir? Tu progreso en el examen se perderá.';
                return e.returnValue;
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.showNotification('Conexión restaurada', 'success');
        });

        window.addEventListener('offline', () => {
            this.showNotification('Sin conexión a internet. La plataforma seguirá funcionando.', 'warning');
        });
    }

    showSection(sectionId) {
        // Don't allow navigation during active exam
        if (currentExamState.isActive && sectionId !== this.currentSection) {
            const confirmLeave = confirm('¿Estás seguro de que quieres salir del examen? Tu progreso se perderá.');
            if (!confirmLeave) {
                return;
            }
            // End current exam
            if (examManager.timer) {
                clearInterval(examManager.timer);
            }
            securityManager.deactivateExamMode();
            currentExamState.isActive = false;
        }

        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Update navigation
            this.updateNavigation(sectionId);
            
            // Initialize section if needed
            if (this.sectionInitializers[sectionId]) {
                this.sectionInitializers[sectionId]();
            }
            
            // Update URL hash
            window.location.hash = sectionId;
        }
    }

    updateNavigation(activeSection) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === activeSection) {
                btn.classList.add('active');
            }
        });
    }

    // Section Initializers
    initLandingSection() {
        // Update statistics on landing page
        this.updateLandingStats();
    }

    initSyllabusSection() {
        // Render syllabus
        syllabusManager.renderSyllabus();
    }

    initCompleteExamSection() {
        // Show exam start interface
        this.showExamStartInterface('complete');
    }

    initMicroExamSection() {
        // Show exam start interface
        this.showExamStartInterface('micro');
    }

    async updateLandingStats() {
        try {
            const stats = await storageManager.getExamStatistics();
            
            // Update stats display if elements exist
            const statsElements = {
                totalExams: document.querySelector('.total-exams'),
                averageScore: document.querySelector('.average-score'),
                bestScore: document.querySelector('.best-score')
            };

            if (statsElements.totalExams) {
                statsElements.totalExams.textContent = stats.totalExams;
            }
            if (statsElements.averageScore) {
                statsElements.averageScore.textContent = `${Math.round(stats.averageScore)}%`;
            }
            if (statsElements.bestScore) {
                statsElements.bestScore.textContent = `${stats.bestScore}%`;
            }
        } catch (error) {
            console.error('Error updating landing stats:', error);
        }
    }

    showExamStartInterface(examType) {
        const contentElement = document.getElementById(`${examType === 'complete' ? 'complete' : 'micro'}-exam-content`);
        if (!contentElement) return;

        const examConfig = examType === 'complete' ? CONFIG.COMPLETE_EXAM : CONFIG.MICRO_EXAM;
        const examTitle = examType === 'complete' ? 'Examen Completo' : 'Micro Examen: Potenciación con números racionales';
        const remainingAttempts = securityManager.getRemainingAttempts(examType);

        const html = `
            <div class="exam-start-interface">
                <h2>🎯 ${examTitle}</h2>
                
                <div class="exam-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-value">${examConfig.QUESTIONS}</div>
                            <div class="info-label">Preguntas</div>
                        </div>
                        <div class="info-item">
                            <div class="info-value">${Math.floor(examConfig.TIME_LIMIT / 60)}</div>
                            <div class="info-label">Minutos</div>
                        </div>
                        <div class="info-item">
                            <div class="info-value">${examConfig.PASS_SCORE}%</div>
                            <div class="info-label">Para Aprobar</div>
                        </div>
                        <div class="info-item">
                            <div class="info-value">${remainingAttempts}</div>
                            <div class="info-label">Intentos Restantes</div>
                        </div>
                    </div>
                </div>

                <div class="exam-instructions">
                    <h3>📋 Instrucciones</h3>
                    <ul>
                        <li>Lee cada pregunta cuidadosamente antes de responder</li>
                        <li>Puedes navegar entre preguntas usando los botones</li>
                        <li>El examen se enviará automáticamente al finalizar el tiempo</li>
                        <li>Mantén el foco en esta ventana durante el examen</li>
                        <li>No uses herramientas externas o calculadoras</li>
                    </ul>
                </div>

                <div class="security-notice">
                    <h3>🔒 Aviso de Seguridad</h3>
                    <p>Este examen cuenta con medidas de seguridad activas. Se registrará cualquier actividad sospechosa como cambios de ventana, intentos de acceso a herramientas de desarrollador, o comportamientos inusuales.</p>
                </div>

                <div class="exam-actions">
                    ${remainingAttempts > 0 ? `
                        <button class="exam-btn primary" onclick="app.startExam('${examType}')">
                            🚀 Comenzar Examen
                        </button>
                    ` : `
                        <div class="no-attempts-message">
                            <p>Has agotado tus intentos diarios para este tipo de examen.</p>
                            <p>Podrás intentar nuevamente mañana.</p>
                        </div>
                    `}
                    <button class="exam-btn secondary" onclick="app.showSection('landing')">
                        ← Volver al Inicio
                    </button>
                </div>
            </div>
        `;

        contentElement.innerHTML = html;
    }

    startExam(examType) {
        if (examType === 'complete') {
            examManager.startCompleteExam();
        } else if (examType === 'micro') {
            examManager.startMicroExam();
        }
    }

    handleExamKeyPress(e) {
        // Log suspicious key combinations during exam
        const suspiciousKeys = ['F12', 'F11'];
        const suspiciousCombos = [
            { ctrl: true, shift: true, key: 'I' },
            { ctrl: true, shift: true, key: 'J' },
            { ctrl: true, shift: true, key: 'C' },
            { ctrl: true, key: 'u' },
            { alt: true, key: 'Tab' }
        ];

        if (suspiciousKeys.includes(e.key)) {
            securityManager.logSuspiciousActivity(`key_press_${e.key}`);
        }

        suspiciousCombos.forEach(combo => {
            if (e.ctrlKey === combo.ctrl && 
                e.shiftKey === combo.shift && 
                e.altKey === (combo.alt || false) && 
                e.key === combo.key) {
                securityManager.logSuspiciousActivity(`key_combo_${combo.key}`);
            }
        });
    }

    handleExamFocusLoss() {
        securityManager.logSuspiciousActivity('exam_focus_loss');
        // Pause exam timer if implemented
        if (examManager.pauseExam) {
            examManager.pauseExam();
        }
    }

    handleResize() {
        // Handle responsive layout changes
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-layout', isMobile);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    showErrorMessage(message) {
        this.showNotification(message, 'error');
    }

    // Data export/import functions
    async exportUserData() {
        try {
            const data = await storageManager.exportData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `beca18_data_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Datos exportados exitosamente', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showErrorMessage('Error al exportar datos');
        }
    }

    async importUserData(file) {
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            await storageManager.importData(data);
            this.showNotification('Datos importados exitosamente', 'success');
            
            // Refresh current section
            if (this.sectionInitializers[this.currentSection]) {
                this.sectionInitializers[this.currentSection]();
            }
        } catch (error) {
            console.error('Error importing data:', error);
            this.showErrorMessage('Error al importar datos');
        }
    }
}

// Global app instance
const app = new App();

// Global functions for HTML onclick handlers
function showSection(sectionId) {
    app.showSection(sectionId);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // App is already initialized in constructor
    console.log('DOM loaded, app should be ready');
});

// Handle hash changes for direct navigation
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        app.showSection(hash);
    }
});

// Load initial section from hash
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        app.showSection(hash);
    }
});