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
        // Check daily attempts
        if (!securityManager.checkDailyAttempts('micro')) {
            this.showAttemptLimitMessage('micro');
            return;
        }

        // Initialize exam
        this.examType = 'micro';
        this.questions = questionGenerator.generateMicroExamQuestions(microThemeId, CONFIG.MICRO_EXAM.QUESTIONS);
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        // Activate security
        securityManager.activateExamMode();
        securityManager.generateNewSessionKey();

        // Obfuscate answers
        this.questions = securityManager.obfuscateAnswers(this.questions);

        // Update UI
        this.updateExamHeader('micro', CONFIG.MICRO_EXAM.TIME_LIMIT);
        this.renderCurrentQuestion();
        this.startTimer(CONFIG.MICRO_EXAM.TIME_LIMIT);

        // Update current exam state
        currentExamState = {
            type: 'micro',
            questions: this.questions,
            currentQuestion: this.currentQuestionIndex,
            answers: this.userAnswers,
            startTime: this.startTime,
            timeRemaining: CONFIG.MICRO_EXAM.TIME_LIMIT,
            score: 0,
            isActive: true
        };
    }

    // Start Complete Exam (placeholder)
    async startCompleteExam() {
        if (!securityManager.checkDailyAttempts('complete')) {
            this.showAttemptLimitMessage('complete');
            return;
        }

        // For now, start with micro exam questions
        this.examType = 'complete';
        this.questions = questionGenerator.generateCompleteExamQuestions();
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        securityManager.activateExamMode();
        securityManager.generateNewSessionKey();
        this.questions = securityManager.obfuscateAnswers(this.questions);

        this.updateExamHeader('complete', CONFIG.COMPLETE_EXAM.TIME_LIMIT);
        this.renderCurrentQuestion();
        this.startTimer(CONFIG.COMPLETE_EXAM.TIME_LIMIT);

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
    }

    // Start Macro Exam (placeholder)
    async startMacroExam(macroThemeId) {
        if (!securityManager.checkDailyAttempts('macro')) {
            this.showAttemptLimitMessage('macro');
            return;
        }

        this.examType = 'macro';
        this.questions = questionGenerator.generateMacroExamQuestions(macroThemeId);
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = Date.now();

        securityManager.activateExamMode();
        securityManager.generateNewSessionKey();
        this.questions = securityManager.obfuscateAnswers(this.questions);

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
        const contentElement = document.getElementById(`${this.examType === 'complete' ? 'complete' : this.examType === 'macro' ? 'complete' : 'micro'}-exam-content`);
        if (!contentElement) return;

        if (this.currentQuestionIndex >= this.questions.length) {
            this.finishExam();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const questionNumber = this.currentQuestionIndex + 1;

        let html = `
            <div class="question-card">
                <div class="question-number">${questionNumber}</div>
                <div class="question-text">${question.problem}</div>
                
                ${this.renderQuestionOptions(question)}
                
                <div class="exam-actions">
                    ${this.currentQuestionIndex > 0 ? 
                        `<button class="exam-btn secondary" onclick="examManager.previousQuestion()">
                            ← Anterior
                        </button>` : ''
                    }
                    <button class="exam-btn primary" onclick="examManager.nextQuestion()">
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

        contentElement.innerHTML = html;

        // Re-render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise();
        }

        // Update progress
        this.updateProgress();
    }

    renderQuestionOptions(question) {
        if (question.type === 'multiple_choice') {
            return `
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="option" onclick="examManager.selectOption(${index})" data-option="${index}">
                            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                            <div class="option-text">${option}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'numerical_input') {
            return `
                <div class="numerical-answer">
                    <input type="number" class="numerical-input" id="numerical-answer" 
                           placeholder="Ingresa tu respuesta numérica" 
                           onchange="examManager.handleNumericalAnswer(this.value)">
                </div>
            `;
        }
        
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
            alert('Por favor selecciona una respuesta antes de continuar.');
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
        securityManager.deactivateExamMode();

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
            const correctAnswer = securityManager.decryptAnswer(question.correctAnswer);
            const explanation = securityManager.decryptAnswer(question.explanation);
            
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
            await storageManager.saveExamResult(results);
            
            // Update micro theme progress if it's a micro exam
            if (this.examType === 'micro') {
                await storageManager.updateMicroThemeProgress(
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
                        <div class="score-item-value">${securityManager.getRemainingAttempts(this.examType)}</div>
                        <div class="score-item-label">Intentos Restantes Hoy</div>
                    </div>
                </div>
                
                <div class="exam-actions">
                    <button class="exam-btn primary" onclick="examManager.reviewAnswers()">
                        📋 Revisar Respuestas
                    </button>
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
        const contentElement = document.getElementById(`${this.examType === 'complete' ? 'complete' : this.examType === 'macro' ? 'complete' : 'micro'}-exam-content`);
        if (!contentElement || !this.currentExam) return;

        // This would show a detailed review of all questions and answers
        // For now, show a simple message
        alert('Función de revisión de respuestas próximamente disponible.');
    }

    startNewExam() {
        if (this.examType === 'micro') {
            this.startMicroExam();
        } else if (this.examType === 'complete') {
            this.startCompleteExam();
        } else if (this.examType === 'macro') {
            this.startMacroExam('numeros-operaciones');
        }
    }

    showAttemptLimitMessage(examType) {
        const remaining = securityManager.getRemainingAttempts(examType);
        const examName = examType === 'micro' ? 'Micro Examen' : 
                        examType === 'complete' ? 'Examen Completo' : 'Examen de Macrotema';
        
        alert(`Has alcanzado el límite diario de intentos para ${examName}. Intentos restantes: ${remaining}`);
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
const examManager = new ExamManager();