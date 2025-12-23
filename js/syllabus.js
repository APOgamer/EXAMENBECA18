// Syllabus Management System
class SyllabusManager {
    constructor() {
        this.currentExpandedMacro = null;
        this.currentExpandedMicro = null;
    }

    // Helper method for safe MathJax rendering
    renderMathJax() {
        try {
            if (window.app && typeof window.app.renderMathJax === 'function') {
                return window.app.renderMathJax();
            } else if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                return window.this.renderMathJax();
            } else {
                console.log('MathJax not available or not ready');
                return Promise.resolve();
            }
        } catch (error) {
            console.warn('Error rendering MathJax in syllabus:', error);
            return Promise.resolve();
        }
    }

    renderSyllabus() {
        const container = document.getElementById('syllabus-content');
        if (!container) return;

        let html = '';
        
        Object.values(MACRO_THEMES).forEach(macroTheme => {
            html += this.renderMacroTheme(macroTheme);
        });

        container.innerHTML = html;
        this.attachEventListeners();
    }

    renderMacroTheme(macroTheme) {
        const isExpanded = this.currentExpandedMacro === macroTheme.id;
        
        return `
            <div class="macro-theme ${isExpanded ? 'expanded' : ''}" data-macro="${macroTheme.id}">
                <div class="macro-theme-header" onclick="syllabusManager.toggleMacroTheme('${macroTheme.id}')">
                    <div class="macro-theme-title">${macroTheme.title}</div>
                    <div class="expand-icon">${isExpanded ? '▲' : '▼'}</div>
                </div>
                <div class="micro-themes">
                    <div class="macro-description">
                        <p>${macroTheme.description}</p>
                    </div>
                    ${this.renderMicroThemes(macroTheme)}
                </div>
            </div>
        `;
    }

    renderMicroThemes(macroTheme) {
        let html = '';
        
        macroTheme.microThemes.forEach(microThemeId => {
            const microThemeInfo = MICRO_THEMES_INFO[microThemeId];
            const isExpanded = this.currentExpandedMicro === microThemeId;
            
            if (microThemeInfo) {
                html += `
                    <div class="micro-theme ${isExpanded ? 'expanded' : ''}" data-micro="${microThemeId}">
                        <div class="micro-theme-header" onclick="syllabusManager.toggleMicroTheme('${microThemeId}')">
                            <div class="micro-theme-title">${microThemeInfo.title}</div>
                            <div class="expand-icon">${isExpanded ? '▲' : '▼'}</div>
                        </div>
                        <div class="micro-theme-content">
                            ${this.renderMicroThemeContent(microThemeInfo)}
                        </div>
                    </div>
                `;
            } else {
                // Placeholder for micro themes not yet implemented
                html += `
                    <div class="micro-theme" data-micro="${microThemeId}">
                        <div class="micro-theme-header">
                            <div class="micro-theme-title">${this.formatMicroThemeName(microThemeId)}</div>
                            <div class="expand-icon">🚧</div>
                        </div>
                    </div>
                `;
            }
        });
        
        return html;
    }

    renderMicroThemeContent(microThemeInfo) {
        return `
            <div class="explanation">
                <h4>📖 Explicación</h4>
                <p>${microThemeInfo.explanation}</p>
                
                ${microThemeInfo.formulas ? `
                    <h4>📐 Fórmulas Principales</h4>
                    <ul>
                        ${microThemeInfo.formulas.map(formula => `<li>$${formula}$</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
            
            <div class="examples">
                <h4>💡 Ejemplos</h4>
                ${this.renderExamples(microThemeInfo.examples)}
            </div>
            
            <div class="micro-exercises">
                <h4>🎯 Micro Ejercicios de Práctica</h4>
                <div class="exercise-container" id="exercise-${microThemeInfo.title.replace(/\s+/g, '-').toLowerCase()}">
                    <button class="exercise-btn" onclick="syllabusManager.generateMicroExercise('${Object.keys(MICRO_THEMES_INFO).find(key => MICRO_THEMES_INFO[key].title === microThemeInfo.title)}')">
                        Generar Ejercicio
                    </button>
                </div>
            </div>
            
            <div class="practice-link">
                <button class="cta-button secondary" onclick="startMicroExam('${Object.keys(MICRO_THEMES_INFO).find(key => MICRO_THEMES_INFO[key].title === microThemeInfo.title)}')">
                    🎯 Examen de este tema
                </button>
            </div>
        `;
    }

    renderExamples(examples) {
        if (!examples || examples.length === 0) {
            return '<p>Ejemplos próximamente...</p>';
        }

        return examples.map((example, index) => `
            <div class="example">
                <div class="example-title">Ejemplo ${index + 1}</div>
                <div class="example-problem">
                    <strong>Problema:</strong> ${example.problem}
                </div>
                <div class="example-solution">
                    <strong>Solución:</strong> ${example.solution}
                </div>
            </div>
        `).join('');
    }

    toggleMacroTheme(macroThemeId) {
        const macroElement = document.querySelector(`[data-macro="${macroThemeId}"]`);
        if (!macroElement) return;

        if (this.currentExpandedMacro === macroThemeId) {
            // Collapse current macro theme
            this.currentExpandedMacro = null;
            macroElement.classList.remove('expanded');
        } else {
            // Collapse previously expanded macro theme
            if (this.currentExpandedMacro) {
                const prevElement = document.querySelector(`[data-macro="${this.currentExpandedMacro}"]`);
                if (prevElement) {
                    prevElement.classList.remove('expanded');
                }
            }
            
            // Expand new macro theme
            this.currentExpandedMacro = macroThemeId;
            macroElement.classList.add('expanded');
            
            // Collapse any expanded micro theme
            this.currentExpandedMicro = null;
            document.querySelectorAll('.micro-theme.expanded').forEach(el => {
                el.classList.remove('expanded');
            });
        }

        // Update expand icons
        this.updateExpandIcons();
        
        // Re-render MathJax
        if (window.MathJax) {
            this.renderMathJax();
        }
    }

    toggleMicroTheme(microThemeId) {
        const microElement = document.querySelector(`[data-micro="${microThemeId}"]`);
        if (!microElement) return;

        if (this.currentExpandedMicro === microThemeId) {
            // Collapse current micro theme
            this.currentExpandedMicro = null;
            microElement.classList.remove('expanded');
        } else {
            // Collapse previously expanded micro theme
            if (this.currentExpandedMicro) {
                const prevElement = document.querySelector(`[data-micro="${this.currentExpandedMicro}"]`);
                if (prevElement) {
                    prevElement.classList.remove('expanded');
                }
            }
            
            // Expand new micro theme
            this.currentExpandedMicro = microThemeId;
            microElement.classList.add('expanded');
        }

        // Update expand icons
        this.updateExpandIcons();
        
        // Re-render MathJax
        if (window.MathJax) {
            this.renderMathJax();
        }
    }

    updateExpandIcons() {
        // Update macro theme icons
        document.querySelectorAll('.macro-theme').forEach(element => {
            const icon = element.querySelector('.macro-theme-header .expand-icon');
            const isExpanded = element.classList.contains('expanded');
            if (icon) {
                icon.textContent = isExpanded ? '▲' : '▼';
            }
        });

        // Update micro theme icons
        document.querySelectorAll('.micro-theme').forEach(element => {
            const icon = element.querySelector('.micro-theme-header .expand-icon');
            const isExpanded = element.classList.contains('expanded');
            if (icon && !icon.textContent.includes('🚧')) {
                icon.textContent = isExpanded ? '▲' : '▼';
            }
        });
    }

    attachEventListeners() {
        // Event listeners are handled by onclick attributes in the HTML
        // This method can be used for additional event handling if needed
    }

    formatMicroThemeName(microThemeId) {
        // Convert kebab-case to readable format
        return microThemeId
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    searchSyllabus(query) {
        if (!query || query.length < 2) {
            this.renderSyllabus();
            return;
        }

        const container = document.getElementById('syllabus-content');
        if (!container) return;

        const searchResults = this.performSearch(query.toLowerCase());
        
        if (searchResults.length === 0) {
            container.innerHTML = `
                <div class="search-results">
                    <h3>🔍 Resultados de búsqueda para: "${query}"</h3>
                    <p>No se encontraron resultados. Intenta con otros términos.</p>
                    <button class="cta-button" onclick="syllabusManager.renderSyllabus()">
                        Ver todo el temario
                    </button>
                </div>
            `;
            return;
        }

        let html = `
            <div class="search-results">
                <h3>🔍 Resultados de búsqueda para: "${query}"</h3>
                <p>Se encontraron ${searchResults.length} resultado(s)</p>
                <button class="cta-button secondary" onclick="syllabusManager.renderSyllabus()">
                    Ver todo el temario
                </button>
            </div>
        `;

        searchResults.forEach(result => {
            html += this.renderSearchResult(result);
        });

        container.innerHTML = html;
        
        // Re-render MathJax
        if (window.MathJax) {
            this.renderMathJax();
        }
    }

    performSearch(query) {
        const results = [];

        Object.values(MACRO_THEMES).forEach(macroTheme => {
            // Search in macro theme
            if (macroTheme.title.toLowerCase().includes(query) ||
                macroTheme.description.toLowerCase().includes(query)) {
                results.push({
                    type: 'macro',
                    theme: macroTheme,
                    relevance: 'high'
                });
            }

            // Search in micro themes
            macroTheme.microThemes.forEach(microThemeId => {
                const microThemeInfo = MICRO_THEMES_INFO[microThemeId];
                if (microThemeInfo) {
                    const searchableText = `
                        ${microThemeInfo.title} 
                        ${microThemeInfo.description} 
                        ${microThemeInfo.explanation}
                    `.toLowerCase();

                    if (searchableText.includes(query)) {
                        results.push({
                            type: 'micro',
                            theme: macroTheme,
                            microTheme: microThemeInfo,
                            microThemeId: microThemeId,
                            relevance: microThemeInfo.title.toLowerCase().includes(query) ? 'high' : 'medium'
                        });
                    }
                }
            });
        });

        // Sort by relevance
        return results.sort((a, b) => {
            const relevanceOrder = { high: 3, medium: 2, low: 1 };
            return relevanceOrder[b.relevance] - relevanceOrder[a.relevance];
        });
    }

    renderSearchResult(result) {
        if (result.type === 'macro') {
            return `
                <div class="search-result macro-result">
                    <h4>${result.theme.title}</h4>
                    <p>${result.theme.description}</p>
                    <div class="result-actions">
                        <button class="exam-btn secondary" onclick="startMacroExam('${result.theme.id}')">
                            Examen del tema
                        </button>
                    </div>
                </div>
            `;
        } else {
            return `
                <div class="search-result micro-result">
                    <h4>${result.microTheme.title}</h4>
                    <p><strong>Tema:</strong> ${result.theme.title}</p>
                    <p>${result.microTheme.description}</p>
                    <div class="result-actions">
                        <button class="exam-btn secondary" onclick="startMicroExam('${result.microThemeId}')">
                            Micro examen
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Get progress for a micro theme (placeholder)
    async getMicroThemeProgress(microThemeId) {
        try {
            return await storageManager.getMicroThemeProgress(microThemeId);
        } catch (error) {
            console.error('Error getting micro theme progress:', error);
            return null;
        }
    }

    // Generate micro exercise for syllabus section
    generateMicroExercise(microThemeId) {
        const container = document.getElementById(`exercise-${MICRO_THEMES_INFO[microThemeId].title.replace(/\s+/g, '-').toLowerCase()}`);
        if (!container) return;

        // Generate a practice question (different from exam questions)
        let exercise;
        if (microThemeId === 'potenciacion-racionales') {
            exercise = this.generatePracticeExercise('potenciacion');
        } else if (microThemeId === 'radicacion-racionales') {
            exercise = this.generatePracticeExercise('radicacion');
        } else {
            exercise = this.generatePracticeExercise('potenciacion');
        }

        container.innerHTML = `
            <div class="practice-exercise">
                <div class="exercise-problem">
                    <strong>Ejercicio:</strong> ${exercise.problem}
                </div>
                <div class="exercise-options">
                    ${exercise.options.map((option, index) => `
                        <button class="exercise-option" onclick="syllabusManager.checkExerciseAnswer('${exercise.id}', ${index}, '${exercise.correctAnswer}', '${exercise.explanation.replace(/'/g, "\\'")}')">
                            ${String.fromCharCode(65 + index)}) ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="exercise-feedback" id="feedback-${exercise.id}"></div>
                <button class="exercise-btn secondary" onclick="syllabusManager.generateMicroExercise('${microThemeId}')">
                    Nuevo Ejercicio
                </button>
            </div>
        `;

        // Re-render MathJax
        if (window.MathJax) {
            this.renderMathJax();
        }
    }

    generatePracticeExercise(type) {
        if (type === 'potenciacion') {
            return this.generatePotenciacionPractice();
        } else if (type === 'radicacion') {
            return this.generateRadicacionPractice();
        }
    }

    generatePotenciacionPractice() {
        const exercises = [
            {
                problem: 'Evalúa: $(\\frac{1}{3})^2$',
                options: ['1/9', '1/6', '2/3', '1/3'],
                correctAnswer: '1/9',
                explanation: 'Para elevar una fracción al cuadrado, elevamos tanto el numerador como el denominador: (1/3)² = 1²/3² = 1/9'
            },
            {
                problem: 'Simplifica: $(\\frac{2}{5})^{-1}$',
                options: ['5/2', '2/5', '-2/5', '1'],
                correctAnswer: '5/2',
                explanation: 'Un exponente negativo significa que debemos invertir la fracción: (2/5)⁻¹ = 1÷(2/5) = 5/2'
            },
            {
                problem: 'Calcula: $(0.5)^3$',
                options: ['0.125', '0.25', '1.5', '0.5'],
                correctAnswer: '0.125',
                explanation: 'Multiplicamos 0.5 tres veces: 0.5 × 0.5 × 0.5 = 0.125'
            },
            {
                problem: 'Evalúa: $(\\frac{3}{4})^0$',
                options: ['1', '0', '3/4', '4/3'],
                correctAnswer: '1',
                explanation: 'Cualquier número (excepto cero) elevado a la potencia 0 siempre es igual a 1'
            },
            {
                problem: 'Calcula: $(\\frac{1}{2})^{-2}$',
                options: ['4', '1/4', '-4', '2'],
                correctAnswer: '4',
                explanation: 'Exponente negativo invierte la fracción: (1/2)⁻² = (2/1)² = 2² = 4'
            }
        ];

        const exercise = exercises[Math.floor(Math.random() * exercises.length)];
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...exercise
        };
    }

    generateRadicacionPractice() {
        const exercises = [
            {
                problem: 'Calcula: $\\sqrt{\\frac{4}{25}}$',
                options: ['2/5', '4/25', '1/5', '2/25'],
                correctAnswer: '2/5',
                explanation: 'La raíz de una fracción es igual a la raíz del numerador dividida por la raíz del denominador: √(4/25) = √4/√25 = 2/5'
            },
            {
                problem: 'Racionaliza: $\\frac{1}{\\sqrt{3}}$',
                options: ['√3/3', '1/3', '√3', '3/√3'],
                correctAnswer: '√3/3',
                explanation: 'Para racionalizar, multiplicamos arriba y abajo por √3: (1/√3) × (√3/√3) = √3/3'
            },
            {
                problem: 'Simplifica: $\\sqrt{18}$',
                options: ['3√2', '2√3', '√18', '6'],
                correctAnswer: '3√2',
                explanation: 'Buscamos factores cuadrados perfectos: 18 = 9 × 2, entonces √18 = √(9×2) = √9 × √2 = 3√2'
            },
            {
                problem: 'Calcula: $\\sqrt{\\frac{1}{4}}$',
                options: ['1/2', '1/4', '2', '4'],
                correctAnswer: '1/2',
                explanation: 'La raíz cuadrada de 1/4 es: √(1/4) = √1/√4 = 1/2'
            },
            {
                problem: 'Simplifica: $\\sqrt{50}$',
                options: ['5√2', '2√5', '√50', '10'],
                correctAnswer: '5√2',
                explanation: 'Factorizamos: 50 = 25 × 2, entonces √50 = √(25×2) = √25 × √2 = 5√2'
            }
        ];

        const exercise = exercises[Math.floor(Math.random() * exercises.length)];
        return {
            id: Math.random().toString(36).substr(2, 9),
            ...exercise
        };
    }

    checkExerciseAnswer(exerciseId, selectedIndex, correctAnswer, explanation) {
        const feedbackElement = document.getElementById(`feedback-${exerciseId}`);
        const options = document.querySelectorAll('.exercise-option');
        
        // Disable all options
        options.forEach(option => option.disabled = true);
        
        // Get selected answer
        const selectedOption = options[selectedIndex];
        const selectedAnswer = selectedOption.textContent.substring(3); // Remove "A) " prefix
        
        // Check if correct
        const isCorrect = selectedAnswer === correctAnswer;
        
        // Style the selected option
        selectedOption.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Highlight correct answer if wrong was selected
        if (!isCorrect) {
            options.forEach(option => {
                if (option.textContent.substring(3) === correctAnswer) {
                    option.classList.add('correct');
                }
            });
        }
        
        // Clean explanation from any code-like content
        const cleanExplanation = explanation
            .replace(/Math input error/g, 'Error en la entrada matemática')
            .replace(/sqrt/g, '√')
            .replace(/times/g, '×')
            .replace(/\\frac/g, '')
            .replace(/\\sqrt/g, '√')
            .replace(/\\times/g, '×')
            .replace(/\{|\}/g, '')
            .replace(/\\/g, '');
        
        // Show feedback
        feedbackElement.innerHTML = `
            <div class="feedback ${isCorrect ? 'success' : 'error'}">
                <div class="feedback-result">
                    ${isCorrect ? '✅ ¡Correcto! Excelente trabajo.' : '❌ Respuesta incorrecta'}
                </div>
                <div class="feedback-explanation">
                    <strong>Explicación:</strong> ${cleanExplanation}
                </div>
                ${!isCorrect ? `
                    <div class="feedback-tip">
                        <strong>💡 Consejo:</strong> La respuesta correcta es <strong>${correctAnswer}</strong>. Revisa el procedimiento paso a paso.
                    </div>
                ` : ''}
            </div>
        `;
        
        // Re-render MathJax
        if (window.MathJax) {
            this.renderMathJax();
        }
    }
}

// Global syllabus manager instance
window.syllabusManager = new SyllabusManager();

// Global functions for syllabus interaction
function startMicroExam(microThemeId) {
    // Switch to micro exam section and start exam
    showSection('micro-exam');
    if (window.examManager) {
        examManager.startMicroExam(microThemeId);
    }
}

function startMacroExam(macroThemeId) {
    // Switch to macro exam section and start exam
    showSection('complete-exam'); // Using complete exam section for now
    if (window.examManager) {
        examManager.startMacroExam(macroThemeId);
    }
}
