// Main Application Controller
class App {
    constructor() {
        console.log('🏗️ App constructor called');
        this.currentSection = 'landing';
        this.isInitialized = false;
        console.log('🏗️ App constructor completed, calling init...');
        this.init();
    }

    async init() {
        try {
            console.log('🔄 Init method called');
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                console.log('⏳ DOM still loading, waiting...');
                document.addEventListener('DOMContentLoaded', () => {
                    console.log('📄 DOM loaded, calling initialize...');
                    this.initialize();
                });
            } else {
                console.log('📄 DOM already ready, calling initialize...');
                await this.initialize();
            }
        } catch (error) {
            console.error('❌ Error in init method:', error);
            console.error('📍 Error message:', error.message);
            console.error('📍 Error stack:', error.stack);
        }
    }

    async initialize() {
        try {
            console.log('🚀 Starting initialization...');
            
            // Wait a bit for all scripts to load
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('✅ Scripts loading delay completed');
            
            // Check if required components exist
            console.log('🔍 Checking required components...');
            const requiredComponents = ['storageManager', 'securityManager', 'examManager', 'syllabusManager', 'questionGenerator', 'alertSystem'];
            const missingComponents = requiredComponents.filter(comp => !window[comp]);
            
            if (missingComponents.length > 0) {
                throw new Error(`Missing components: ${missingComponents.join(', ')}`);
            }
            console.log('✅ All required components found');
            
            // Initialize storage
            console.log('💾 Initializing storage...');
            await window.storageManager.initDB();
            console.log('✅ Storage initialized successfully');
            
            // Setup navigation
            console.log('🧭 Setting up navigation...');
            this.setupNavigation();
            console.log('✅ Navigation setup completed');
            
            // Setup security
            console.log('🔒 Setting up security...');
            this.setupSecurity();
            console.log('✅ Security setup completed');
            
            // Load initial content
            console.log('📄 Loading initial content...');
            this.loadInitialContent();
            console.log('✅ Initial content loaded');
            
            // Setup keyboard shortcuts
            console.log('⌨️ Setting up keyboard shortcuts...');
            this.setupKeyboardShortcuts();
            console.log('✅ Keyboard shortcuts setup completed');
            
            // Setup window events
            console.log('🪟 Setting up window events...');
            this.setupWindowEvents();
            console.log('✅ Window events setup completed');
            
            this.isInitialized = true;
            console.log('🎉 Beca 18 Platform initialized successfully');
            
        } catch (error) {
            console.error('❌ DETAILED ERROR during initialization:');
            console.error('📍 Error message:', error.message);
            console.error('📍 Error stack:', error.stack);
            console.error('📍 Full error object:', error);
            
            // Show user-friendly error
            if (window.alertSystem) {
                window.alertSystem.error(`Error durante la inicialización: ${error.message}`);
            } else {
                alert(`Error durante la inicialización: ${error.message}`);
            }
        }
    }

    setupNavigation() {
        try {
            console.log('🧭 Starting navigation setup...');
            
            // Setup navigation buttons
            const navButtons = document.querySelectorAll('.nav-btn');
            console.log('🧭 Found nav buttons:', navButtons.length);
            
            navButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const section = e.target.getAttribute('data-section');
                    if (section) {
                        this.showSection(section);
                    }
                });
            });
            console.log('🧭 Nav button listeners added');

            // Setup section-specific initialization
            this.sectionInitializers = {
                'landing': () => this.initLandingSection(),
                'syllabus': () => this.initSyllabusSection(),
                'complete-exam': () => this.initCompleteExamSection(),
                'micro-exam': () => this.initMicroExamSection()
            };
            console.log('🧭 Section initializers created:', Object.keys(this.sectionInitializers));
            
        } catch (error) {
            console.error('❌ Error in setupNavigation:', error);
            throw error;
        }
    }

    setupSecurity() {
        try {
            console.log('🔒 Starting security setup...');
            
            // Security is already initialized in security.js
            // Add any additional security setup here
            
            // Monitor for suspicious activity during exams
            document.addEventListener('keydown', (e) => {
                if (currentExamState.isActive) {
                    this.handleExamKeyPress(e);
                }
            });
            console.log('🔒 Keydown listener added');

            // Handle visibility changes during exams
            document.addEventListener('visibilitychange', () => {
                if (currentExamState.isActive && document.hidden) {
                    this.handleExamFocusLoss();
                }
            });
            console.log('🔒 Visibility change listener added');
            
        } catch (error) {
            console.error('❌ Error in setupSecurity:', error);
            throw error;
        }
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

    loadInitialContent() {
        try {
            console.log('📄 Starting loadInitialContent...');
            
            // Load initial section (landing by default)
            const initialSection = window.location.hash.substring(1) || 'landing';
            console.log('📄 Initial section determined:', initialSection);
            
            this.showSection(initialSection);
            console.log('📄 Section shown successfully');
            
            // Initialize MathJax if available
            console.log('📄 Attempting to render MathJax...');
            this.renderMathJax().then(() => {
                console.log('📄 MathJax rendering completed');
            }).catch(err => {
                console.warn('⚠️ MathJax rendering warning:', err);
            });
            
            console.log('📄 Initial content loaded successfully');
            
        } catch (error) {
            console.error('❌ Error in loadInitialContent:', error);
            throw error;
        }
    }

    showSection(sectionId) {
        try {
            console.log('🔄 showSection called with:', sectionId);
            
            // Don't allow navigation during active exam
            if (currentExamState.isActive && sectionId !== this.currentSection) {
                console.log('🔄 Exam is active, showing confirmation dialog...');
                this.showConfirmDialog(
                    '¿Estás seguro de que quieres salir del examen? Tu progreso se perderá.',
                    'Confirmar salida del examen'
                ).then(confirmed => {
                    if (confirmed) {
                        // End current exam
                        if (window.examManager.timer) {
                            clearInterval(window.examManager.timer);
                        }
                        window.securityManager.deactivateExamMode();
                        currentExamState.isActive = false;
                        this.performSectionChange(sectionId);
                    }
                });
                return;
            }

            console.log('🔄 Proceeding with section change...');
            this.performSectionChange(sectionId);
            
        } catch (error) {
            console.error('❌ Error in showSection:', error);
            console.error('📍 Section ID:', sectionId);
            console.error('📍 Error details:', error.message);
        }
    }

    performSectionChange(sectionId) {
        console.log('Changing to section:', sectionId);
        
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
            console.log('Available initializers:', Object.keys(this.sectionInitializers || {}));
            console.log('Looking for initializer:', sectionId);
            
            if (this.sectionInitializers && this.sectionInitializers[sectionId]) {
                try {
                    console.log('Calling initializer for:', sectionId);
                    this.sectionInitializers[sectionId]();
                } catch (error) {
                    console.error('Error initializing section:', sectionId, error);
                }
            } else {
                console.log('No initializer found for:', sectionId);
            }
            
            // Update URL hash
            window.location.hash = sectionId;
        } else {
            console.error('Section not found:', sectionId);
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
        console.log('Initializing landing section');
        // Update statistics on landing page
        this.updateLandingStats();
    }

    initSyllabusSection() {
        console.log('Initializing syllabus section');
        // Render syllabus
        window.syllabusManager.renderSyllabus();
    }

    initCompleteExamSection() {
        console.log('Initializing complete exam section');
        // Show exam start interface
        this.showExamStartInterface('complete');
    }

    initMicroExamSection() {
        console.log('Initializing micro exam section');
        // Show exam start interface
        this.showExamStartInterface('micro');
    }

    async updateLandingStats() {
        try {
            const stats = await window.storageManager.getExamStatistics();
            
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
        console.log('showExamStartInterface called with:', examType);
        
        const contentElement = document.getElementById(`${examType === 'complete' ? 'complete' : 'micro'}-exam-content`);
        console.log('Content element found:', !!contentElement);
        
        if (!contentElement) return;

        const examConfig = examType === 'complete' ? CONFIG.COMPLETE_EXAM : CONFIG.MICRO_EXAM;
        const examTitle = examType === 'complete' ? 'Examen Completo' : 'Micro Examen';
        const remainingAttempts = window.securityManager.getRemainingAttempts(examType);

        let html = `
            <div class="exam-start-interface">
                <h2>🎯 ${examTitle}</h2>
        `;

        if (examType === 'micro') {
            html += `
                <div class="theme-selection">
                    <h3>📚 Selecciona el Microtema</h3>
                    <div class="theme-options">
                        <div class="theme-option" onclick="app.selectMicroTheme('potenciacion-racionales')">
                            <div class="theme-title">Potenciación con números racionales</div>
                            <div class="theme-description">Operaciones de potenciación con fracciones y exponentes</div>
                        </div>
                        <div class="theme-option" onclick="app.selectMicroTheme('radicacion-racionales')">
                            <div class="theme-title">Radicación de números racionales</div>
                            <div class="theme-description">Raíces, simplificación y racionalización</div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `
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
                        <button class="exam-btn primary" onclick="${examType === 'complete' ? 'window.examManager.startCompleteExam()' : 'window.app.startExam(\'' + examType + '\')'}">
                            🚀 Comenzar Examen
                        </button>
                    ` : `
                        <div class="no-attempts-message">
                            <p>Has agotado tus intentos diarios para este tipo de examen.</p>
                            <p>Podrás intentar nuevamente mañana.</p>
                        </div>
                    `}
                    <button class="exam-btn secondary" onclick="window.app.showSection('landing')">
                        ← Volver al Inicio
                    </button>
                </div>
            </div>
        `;

        contentElement.innerHTML = html;
        console.log('Exam start interface rendered for:', examType);
    }

    startExam(examType) {
        console.log('🚀 startExam called with:', examType);
        
        if (examType === 'complete') {
            console.log('🚀 Starting complete exam...');
            window.examManager.startCompleteExam();
        } else if (examType === 'micro') {
            // For micro exams, we need theme selection first
            console.log('🚀 Micro exam requires theme selection');
            window.alertSystem.info('Por favor selecciona un microtema primero.');
        }
    }

    selectMicroTheme(microThemeId) {
        console.log('Selecting micro theme:', microThemeId);
        
        const remainingAttempts = window.securityManager.getRemainingAttempts('micro');
        console.log('Remaining attempts:', remainingAttempts);
        
        if (remainingAttempts <= 0) {
            window.alertSystem.warning('Has agotado tus intentos diarios para Micro Exámenes. Podrás intentar nuevamente mañana.');
            return;
        }

        const themeName = MICRO_THEMES_INFO[microThemeId]?.title || 'Tema desconocido';
        console.log('Theme name:', themeName);
        
        window.alertSystem.showConfirm({
            title: 'Confirmar Micro Examen',
            message: `¿Deseas iniciar el micro examen de "${themeName}"?`,
            confirmText: 'Iniciar Examen',
            cancelText: 'Cancelar'
        }).then(confirmed => {
            console.log('Confirmation result:', confirmed);
            if (confirmed) {
                try {
                    console.log('Starting micro exam with theme:', microThemeId);
                    window.examManager.startMicroExam(microThemeId);
                } catch (error) {
                    console.error('Error starting micro exam:', error);
                    window.alertSystem.error('Error al iniciar el examen. Por favor, recarga la página e intenta nuevamente.');
                }
            }
        }).catch(error => {
            console.error('Error in confirmation dialog:', error);
            window.alertSystem.error('Error en el sistema de confirmación.');
        });
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
            window.securityManager.logSuspiciousActivity(`key_press_${e.key}`);
        }

        suspiciousCombos.forEach(combo => {
            if (e.ctrlKey === combo.ctrl && 
                e.shiftKey === combo.shift && 
                e.altKey === (combo.alt || false) && 
                e.key === combo.key) {
                window.securityManager.logSuspiciousActivity(`key_combo_${combo.key}`);
            }
        });
    }

    handleExamFocusLoss() {
        window.securityManager.logSuspiciousActivity('exam_focus_loss');
        // Pause exam timer if implemented
        if (window.examManager.pauseExam) {
            window.examManager.pauseExam();
        }
    }

    handleResize() {
        // Handle responsive layout changes
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-layout', isMobile);
    }

    showNotification(message, type = 'info') {
        window.alertSystem.showToast(message, type);
    }

    showErrorMessage(message) {
        window.alertSystem.error(message);
    }

    async showConfirmDialog(message, title = 'Confirmación') {
        return await window.alertSystem.confirm(message, title);
    }

    // Helper method for safe MathJax rendering
    renderMathJax() {
        return new Promise((resolve) => {
            try {
                if (window.MathJax && window.MathJax.typesetPromise) {
                    console.log('📐 Rendering MathJax with typesetPromise...');
                    window.MathJax.typesetPromise().then(() => {
                        console.log('📐 MathJax rendering completed');
                        resolve();
                    }).catch((err) => {
                        console.warn('⚠️ MathJax rendering error:', err);
                        resolve();
                    });
                } else if (window.MathJax && window.MathJax.Hub) {
                    // Fallback for MathJax v2
                    console.log('📐 Rendering MathJax with Hub.Queue...');
                    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, () => {
                        console.log('📐 MathJax v2 rendering completed');
                        resolve();
                    }]);
                } else {
                    console.log('📐 MathJax not available, skipping rendering');
                    resolve();
                }
            } catch (error) {
                console.warn('📐 Error in renderMathJax:', error);
                resolve();
            }
        });
    }
    async exportUserData() {
        try {
            const data = await window.storageManager.exportData();
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
            
            await window.storageManager.importData(data);
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
window.app = new App();

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