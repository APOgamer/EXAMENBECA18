// Syllabus Management System
class SyllabusManager {
    constructor() {
        this.currentExpandedMacro = null;
        this.currentExpandedMicro = null;
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
            
            <div class="practice-link">
                <button class="cta-button secondary" onclick="startMicroExam('${microThemeInfo.title}')">
                    🎯 Practicar este tema
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
            MathJax.typesetPromise();
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
            MathJax.typesetPromise();
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
            MathJax.typesetPromise();
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

    // Add progress indicators to syllabus (future enhancement)
    addProgressIndicators() {
        // This method would add visual progress indicators to each micro theme
        // showing completion percentage, best score, etc.
    }
}

// Global syllabus manager instance
const syllabusManager = new SyllabusManager();

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