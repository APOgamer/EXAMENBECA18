// Exam Management System
class ExamManager {
    constructor() {
        this.currentExam = null;
        this.timer = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.examType = null;
    }

    // Start Micro Exam
    async startMicroExam(microThemeId = 'potenciacion-racionales') {
        console.log('ExamManager.startMicroExam called with:', microThemeId);
        
        // Check daily attempts
        if (!window.securityManager.checkDailyAttempts('micro')) {
            console.log('Daily attempts exceeded');
            this.showAttemptLimitMessage('micro');
            return;
        }

        // Get theme info
        const themeInfo = MICRO_THEMES_INFO[microThemeId];
        const themeName = themeInfo ? themeInfo.title : 'Tema desconocido';
        console.log('Starting exam for theme:', themeName);

        // Update exam header with theme name
        const examHeader = document.querySelector('#micro-exam .exam-header h2');
        if (examHeader) {
            examHeader.textContent = `🔬 Micro Examen: ${themeName}`;
            console.log('Updated exam header');
        }

        // Initialize exam
        this.examType = 'micro';
        this.currentMicroTheme = microThemeId;
        this.questions = window.questionGenerator.generateMicroExamQuestions(microThemeId, CONFIG.MICRO_EXAM.QUESTIONS);
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        console.log('Generated questions:', this.questions.length);
        
        if (this.questions.length === 0) {
            console.error('❌ No questions generated!');
            window.alertSystem.error('Error: No se pudieron generar las preguntas del examen.');
            return;
        }
        
        console.log('First question sample:', this.questions[0]);

        // Activate security
        window.securityManager.activateExamMode();
        window.securityManager.generateNewSessionKey();

        // Obfuscate answers
        this.questions = window.securityManager.obfuscateAnswers(this.questions);

        // Update UI
        this.updateExamHeader('micro', CONFIG.MICRO_EXAM.TIME_LIMIT);
        this.renderCurrentQuestion();
        this.startTimer(CONFIG.MICRO_EXAM.TIME_LIMIT);

        // Update current exam state
        currentExamState = {
            type: 'micro',
            microTheme: microThemeId,
            questions: this.questions,
            currentQuestion: this.currentQuestionIndex,
            answers: this.userAnswers,
            startTime: this.startTime,
            timeRemaining: CONFIG.MICRO_EXAM.TIME_LIMIT,
            score: 0,
            isActive: true
        };

        // Show success message
        window.alertSystem.success(`Examen iniciado: ${themeName}`);
        console.log('Exam started successfully');
    }

    // Start Complete Exam (placeholder)
    async startCompleteExam() {
        console.log('🎯 startCompleteExam called');
        
        if (!window.securityManager.checkDailyAttempts('complete')) {
            console.log('Daily attempts exceeded for complete exam');
            this.showAttemptLimitMessage('complete');
            return;
        }

        // Update exam header
        const examHeader = document.querySelector('#complete-exam .exam-header h2');
        if (examHeader) {
            examHeader.textContent = `🎯 Examen Completo - Todos los Temas`;
        }

        // For now, start with micro exam questions from both themes
        this.examType = 'complete';
        
        // Generate questions from both available themes
        const potenciacionQuestions = window.questionGenerator.generateMicroExamQuestions('potenciacion-racionales', 20);
        const radicacionQuestions = window.questionGenerator.generateMicroExamQuestions('radicacion-racionales', 20);
        
        console.log('🎯 Potenciacion questions generated:', potenciacionQuestions.length);
        console.log('🎯 Radicacion questions generated:', radicacionQuestions.length);
        
        this.questions = [...potenciacionQuestions, ...radicacionQuestions];
        
        // Shuffle the combined questions
        this.questions = window.questionGenerator.shuffleArray(this.questions);
        
        console.log('Generated complete exam questions:', this.questions.length);
        
        if (this.questions.length === 0) {
            console.error('❌ No questions generated for complete exam!');
            window.alertSystem.error('Error: No se pudieron generar las preguntas del examen completo.');
            return;
        }
        
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        // Activate security
        window.securityManager.activateExamMode();
        window.securityManager.generateNewSessionKey();

        // Obfuscate answers
        this.questions = window.securityManager.obfuscateAnswers(this.questions);

        // Update UI
        this.updateExamHeader('complete', CONFIG.COMPLETE_EXAM.TIME_LIMIT);
        this.renderCurrentQuestion();
        this.startTimer(CONFIG.COMPLETE_EXAM.TIME_LIMIT);

        // Update current exam state
        currentExamState = {
            type: 'complete',
            questions: this.questions,
            currentQuestion: this.currentQuestionIndex,
            answers: this.userAnswers,
            startTime: this.startTime,
            timeRemaining: CONFIG.COMPLETE_EXAM.TIME_LIMIT,
            score: 0,
            isActive: true
        };

        // Show success message
        window.alertSystem.success(`Examen completo iniciado: ${this.questions.length} preguntas`);
        console.log('Complete exam started successfully');
    }

    // Start Macro Exam (placeholder)
    async startMacroExam(macroThemeId) {
        if (!window.securityManager.checkDailyAttempts('macro')) {
            this.showAttemptLimitMessage('macro');
            return;
        }

        this.examType = 'macro';
        this.questions = window.questionGenerator.generateMacroExamQuestions(macroThemeId);
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        window.securityManager.activateExamMode();
        window.securityManager.generateNewSessionKey();
        this.questions = window.securityManager.obfuscateAnswers(this.questions);

        this.updateExamHeader('macro', CONFIG.MACRO_EXAM.TIME_LIMIT);
        this.renderCurrentQuestion();
        this.startTimer(CONFIG.MACRO_EXAM.TIME_LIMIT);

        currentExamState = {
            type: 'macro',
            questions: this.questions,
            currentQuestion: this.currentQuestionIndex,
            answers: this.userAnswers,
            startTime: this.startTime,
            timeRemaining: CONFIG.MACRO_EXAM.TIME_LIMIT,
            score: 0,
            isActive: true
        };
    }

    updateExamHeader(examType, timeLimit) {
        const timerElement = document.getElementById(`${examType === 'complete' ? 'complete' : examType === 'macro' ? 'complete' : 'micro'}-timer`);
        const progressElement = document.getElementById(`${examType === 'complete' ? 'complete' : examType === 'macro' ? 'complete' : 'micro'}-progress`);
        
        if (timerElement) {
            timerElement.textContent = this.formatTime(timeLimit);
        }
        
        if (progressElement) {
            const totalQuestions = examType === 'complete' ? CONFIG.COMPLETE_EXAM.QUESTIONS : 
                                 examType === 'macro' ? CONFIG.MACRO_EXAM.QUESTIONS : 
                                 CONFIG.MICRO_EXAM.QUESTIONS;
            progressElement.textContent = `0/${totalQuestions}`;
        }
    }

    renderCurrentQuestion() {
        console.log('🎯 renderCurrentQuestion called');
        console.log('🎯 Current question index:', this.currentQuestionIndex);
        console.log('🎯 Total questions:', this.questions.length);
        
        const contentElement = document.getElementById(`${this.examType === 'complete' ? 'complete' : this.examType === 'macro' ? 'complete' : 'micro'}-exam-content`);
        console.log('🎯 Content element found:', !!contentElement);
        
        if (!contentElement) {
            console.error('❌ Content element not found for exam type:', this.examType);
            return;
        }

        if (this.currentQuestionIndex >= this.questions.length) {
            console.log('🎯 No more questions, finishing exam');
            this.finishExam();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        console.log('🎯 Current question:', question);
        
        if (!question) {
            console.error('❌ Question not found at index:', this.currentQuestionIndex);
            return;
        }
        
        const questionNumber = this.currentQuestionIndex + 1;

        let html = `
            <div class="question-card">
                <div class="question-number">${questionNumber}</div>
                <div class="question-text">${question.problem}</div>
                
                ${this.renderQuestionOptions(question)}
                
                <div class="exam-actions">
                    ${this.currentQuestionIndex > 0 ? 
                        `<button class="exam-btn secondary" onclick="window.examManager.previousQuestion()">
                            ← Anterior
                        </button>` : ''
                    }
                    <button class="exam-btn primary" onclick="window.examManager.nextQuestion()">
                        ${this.currentQuestionIndex < this.questions.length - 1 ? 'Siguiente →' : 'Finalizar Examen'}
                    </button>
                </div>
                
                <div class="explanation-panel" id="explanation-${question.id}">
                    <div class="explanation-title">
                        ✅ Explicación
                    </div>
                    <div class="explanation-text" id="explanation-text-${question.id}">
                        <!-- Explanation will be shown after answer -->
                    </div>
                </div>
            </div>
        `;

        console.log('🎯 Setting HTML content...');
        contentElement.innerHTML = html;
        console.log('🎯 HTML content set successfully');

        // Re-render MathJax
        console.log('🎯 Attempting to render MathJax...');
        if (window.app && window.app.renderMathJax) {
            window.app.renderMathJax().then(() => {
                console.log('🎯 MathJax rendering completed for question');
            });
        } else {
            console.log('🎯 MathJax rendering not available');
        }

        // Update progress
        this.updateProgress();
        console.log('🎯 Question rendered successfully');
    }

    renderQuestionOptions(question) {
        console.log('🎯 renderQuestionOptions called with:', question.type);
        
        if (question.type === 'multiple_choice') {
            const optionsHtml = `
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="option" onclick="window.examManager.selectOption(${index})" data-option="${index}">
                            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                            <div class="option-text">${option}</div>
                        </div>
                    `).join('')}
                </div>
            `;
            console.log('🎯 Generated options HTML for multiple choice');
            return optionsHtml;
        } else if (question.type === 'numerical_input') {
            const numericalHtml = `
                <div class="numerical-answer">
                    <input type="number" class="numerical-input" id="numerical-answer" 
                           placeholder="Ingresa tu respuesta numérica" 
                           onchange="window.examManager.handleNumericalAnswer(this.value)">
                </div>
            `;
            console.log('🎯 Generated options HTML for numerical input');
            return numericalHtml;
        }
        
        console.log('🎯 Unknown question type, returning empty');
        return '';
    }

    selectOption(optionIndex) {
        // Remove previous selections
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Select current option
        const selectedOption = document.querySelector(`[data-option="${optionIndex}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Store answer
        const question = this.questions[this.currentQuestionIndex];
        this.userAnswers[this.currentQuestionIndex] = {
            questionId: question.id,
            selectedOption: optionIndex,
            answer: question.options[optionIndex],
            timestamp: Date.now()
        };
    }

    handleNumericalAnswer(value) {
        const question = this.questions[this.currentQuestionIndex];
        this.userAnswers[this.currentQuestionIndex] = {
            questionId: question.id,
            answer: value,
            timestamp: Date.now()
        };
    }

    nextQuestion() {
        // Check if answer is provided
        if (!this.userAnswers[this.currentQuestionIndex]) {
            window.alertSystem.warning('Por favor selecciona una respuesta antes de continuar.');
            return;
        }

        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.renderCurrentQuestion();
        } else {
            this.finishExam();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderCurrentQuestion();
            
            // Restore previous answer if exists
            const previousAnswer = this.userAnswers[this.currentQuestionIndex];
            if (previousAnswer && previousAnswer.selectedOption !== undefined) {
                setTimeout(() => {
                    const option = document.querySelector(`[data-option="${previousAnswer.selectedOption}"]`);
                    if (option) {
                        option.classList.add('selected');
                    }
                }, 100);
            }
        }
    }

    updateProgress() {
        const progressElement = document.getElementById(`${this.examType === 'complete' ? 'complete' : this.examType === 'macro' ? 'complete' : 'micro'}-progress`);
        if (progressElement) {
            const totalQuestions = this.questions.length;
            const answeredQuestions = this.userAnswers.filter(answer => answer).length;
            progressElement.textContent = `${answeredQuestions}/${totalQuestions}`;
        }
    }

    startTimer(timeLimit) {
        let timeRemaining = timeLimit;
        const timerElement = document.getElementById(`${this.examType === 'complete' ? 'complete' : this.examType === 'macro' ? 'complete' : 'micro'}-timer`);
        
        this.timer = setInterval(() => {
            timeRemaining--;
            
            if (timerElement) {
                timerElement.textContent = this.formatTime(timeRemaining);
                
                // Add time pressure styling when less than 5 minutes
                if (timeRemaining < 300) {
                    timerElement.classList.add('time-pressure');
                }
            }
            
            if (timeRemaining <= 0) {
                this.finishExam();
            }
        }, 1000);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    async finishExam() {
        // Stop timer
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // Deactivate security
        window.securityManager.deactivateExamMode();

        // Calculate results
        const results = this.calculateResults();

        // Save results
        await this.saveExamResults(results);

        // Show results
        this.showResults(results);

        // Reset exam state
        currentExamState.isActive = false;
    }

    calculateResults() {
        let correctAnswers = 0;
        const detailedResults = [];

        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const correctAnswer = window.securityManager.decryptAnswer(question.correctAnswer);
            const explanation = window.securityManager.decryptAnswer(question.explanation);
            
            let isCorrect = false;
            
            if (userAnswer) {
                if (question.type === 'multiple_choice') {
                    isCorrect = userAnswer.answer === correctAnswer;
                } else if (question.type === 'numerical_input') {
                    // Allow for small numerical differences
                    const userValue = parseFloat(userAnswer.answer);
                    const correctValue = parseFloat(correctAnswer);
                    isCorrect = Math.abs(userValue - correctValue) < 0.01;
                }
            }

            if (isCorrect) {
                correctAnswers++;
            }

            detailedResults.push({
                questionId: question.id,
                question: question.problem,
                userAnswer: userAnswer ? userAnswer.answer : 'Sin respuesta',
                correctAnswer: correctAnswer,
                isCorrect: isCorrect,
                explanation: explanation,
                points: isCorrect ? CONFIG.POINTS.CORRECT_ANSWER : CONFIG.POINTS.WRONG_ANSWER
            });
        });

        const totalQuestions = this.questions.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const timeSpent = Math.floor((Date.now() - this.startTime) / 1000);
        const passed = score >= CONFIG.MICRO_EXAM.PASS_SCORE;

        return {
            type: this.examType,
            totalQuestions: totalQuestions,
            correctAnswers: correctAnswers,
            score: score,
            timeSpent: timeSpent,
            passed: passed,
            detailedResults: detailedResults,
            securityEvents: securityState.suspiciousActivity.length
        };
    }

    async saveExamResults(results) {
        try {
            // Save to IndexedDB
            await window.storageManager.saveExamResult(results);
            
            // Update micro theme progress if it's a micro exam
            if (this.examType === 'micro') {
                await window.storageManager.updateMicroThemeProgress(
                    'potenciacion-racionales',
                    'numeros-operaciones',
                    results
                );
            }
        } catch (error) {
            console.error('Error saving exam results:', error);
        }
    }

    showResults(results) {
        const contentElement = document.getElementById(`${this.examType === 'complete' ? 'complete' : this.examType === 'macro' ? 'complete' : 'micro'}-exam-content`);
        if (!contentElement) return;

        const html = `
            <div class="results-panel">
                <h2>🎯 Resultados del Examen</h2>
                
                <div class="score-display ${results.passed ? 'pass' : 'fail'}">
                    ${results.score}%
                </div>
                
                <div class="score-message">
                    ${results.passed ? 
                        '🎉 ¡Felicitaciones! Has aprobado el examen.' : 
                        '📚 Sigue practicando. Puedes intentarlo nuevamente.'
                    }
                </div>
                
                <div class="score-breakdown">
                    <div class="score-item">
                        <div class="score-item-value">${results.correctAnswers}</div>
                        <div class="score-item-label">Respuestas Correctas</div>
                    </div>
                    <div class="score-item">
                        <div class="score-item-value">${results.totalQuestions - results.correctAnswers}</div>
                        <div class="score-item-label">Respuestas Incorrectas</div>
                    </div>
                    <div class="score-item">
                        <div class="score-item-value">${this.formatTime(results.timeSpent)}</div>
                        <div class="score-item-label">Tiempo Utilizado</div>
                    </div>
                    <div class="score-item">
                        <div class="score-item-value">${window.securityManager.getRemainingAttempts(this.examType)}</div>
                        <div class="score-item-label">Intentos Restantes Hoy</div>
                    </div>
                </div>
                
                <div class="exam-actions">
                    <button class="exam-btn secondary" onclick="examManager.startNewExam()">
                        🔄 Nuevo Examen
                    </button>
                    <button class="exam-btn secondary" onclick="showSection('landing')">
                        🏠 Volver al Inicio
                    </button>
                </div>
            </div>
        `;

        contentElement.innerHTML = html;
    }

    reviewAnswers() {
        // Función deshabilitada por seguridad
        window.alertSystem.warning('Esta función no está disponible para mantener la integridad del examen.');
    }

    startNewExam() {
        if (this.examType === 'micro') {
            // Return to theme selection for micro exams
            window.app.showSection('micro-exam');
        } else if (this.examType === 'complete') {
            this.startCompleteExam();
        } else if (this.examType === 'macro') {
            this.startMacroExam('numeros-operaciones');
        }
    }

    showAttemptLimitMessage(examType) {
        const remaining = window.securityManager.getRemainingAttempts(examType);
        const examName = examType === 'micro' ? 'Micro Examen' : 
                        examType === 'complete' ? 'Examen Completo' : 'Examen de Macrotema';
        
        window.alertSystem.warning(`Has alcanzado el límite diario de intentos para ${examName}. Intentos restantes: ${remaining}`);
    }

    // Pause/Resume exam (for focus loss)
    pauseExam() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    resumeExam() {
        if (currentExamState.isActive && currentExamState.timeRemaining > 0) {
            this.startTimer(currentExamState.timeRemaining);
        }
    }
}

// Global exam manager instance
window.examManager = new ExamManager();
