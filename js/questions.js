// Question Generator for Potenciación y Radicación con números racionales
class QuestionGenerator {
    constructor() {
        this.currentMicroTheme = 'potenciacion-racionales';
    }

    // Generate questions for the current micro theme
    generateMicroExamQuestions(microTheme = 'potenciacion-racionales', count = 10) {
        console.log('🎲 generateMicroExamQuestions called with:', microTheme, count);

        const questions = [];
        const usedQuestions = new Set();

        while (questions.length < count) {
            let question;

            try {
                if (microTheme === 'potenciacion-racionales') {
                    question = this.generatePotenciacionQuestion();
                } else if (microTheme === 'radicacion-racionales') {
                    question = this.generateRadicacionQuestion();
                } else {
                    question = this.generatePotenciacionQuestion(); // fallback
                }

                console.log('🎲 Generated question:', question.id, question.type);

                const questionKey = JSON.stringify(question.problem);

                if (!usedQuestions.has(questionKey)) {
                    usedQuestions.add(questionKey);
                    questions.push(question);
                    console.log('🎲 Added question', questions.length, 'of', count);
                } else {
                    console.log('🎲 Duplicate question, regenerating...');
                }
            } catch (error) {
                console.error('❌ Error generating question:', error);
                // Add a simple fallback question to avoid infinite loop
                question = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'multiple_choice',
                    difficulty: 'básico',
                    problem: 'Pregunta de prueba',
                    options: ['A', 'B', 'C', 'D'],
                    correctAnswer: 'A',
                    explanation: 'Explicación de prueba',
                    points: 10
                };
                questions.push(question);
                console.log('🎲 Added fallback question due to error');
            }
        }

        console.log('🎲 Final questions generated:', questions.length);
        return questions;
    }

    generatePotenciacionQuestion() {
        const questionTypes = [
            'basic_fraction_power',
            'negative_exponent',
            'zero_exponent',
            'mixed_operations',
            'word_problem',
            'comparison'
        ];

        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        switch (type) {
            case 'basic_fraction_power':
                return this.generateBasicFractionPower();
            case 'negative_exponent':
                return this.generateNegativeExponent();
            case 'zero_exponent':
                return this.generateZeroExponent();
            case 'mixed_operations':
                return this.generateMixedOperations();
            case 'word_problem':
                return this.generateWordProblem();
            case 'comparison':
                return this.generateComparison();
            default:
                return this.generateBasicFractionPower();
        }
    }

    generateBasicFractionPower() {
        const numerators = [2, 3, 5, 7];
        const denominators = [3, 4, 5, 8, 9];
        const exponents = [2, 3, 4];

        const numerator = numerators[Math.floor(Math.random() * numerators.length)];
        let denominator = denominators[Math.floor(Math.random() * denominators.length)];
        const exponent = exponents[Math.floor(Math.random() * exponents.length)];

        // Ensure numerator != denominator for non-trivial fractions
        while (numerator === denominator) {
            denominator = denominators[Math.floor(Math.random() * denominators.length)];
        }

        const resultNum = Math.pow(numerator, exponent);
        const resultDen = Math.pow(denominator, exponent);

        // Simplify if possible
        const gcd = this.gcd(resultNum, resultDen);
        const simplifiedNum = resultNum / gcd;
        const simplifiedDen = resultDen / gcd;

        const correctAnswer = simplifiedDen === 1 ? simplifiedNum.toString() : `${simplifiedNum}/${simplifiedDen}`;

        const options = [
            correctAnswer,
            `${resultNum}/${resultDen}`, // unsimplified version
            `${Math.pow(numerator + 1, exponent)}/${Math.pow(denominator, exponent)}`,
            `${numerator * exponent}/${denominator * exponent}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'intermedio',
            problem: `Calcular y simplificar: (${numerator}/${denominator})^${exponent}`,
            options: this.shuffleArray(options),
            correctAnswer: correctAnswer,
            explanation: `Para elevar una fracción a una potencia, elevamos tanto el numerador como el denominador: (${numerator}/${denominator})^${exponent} = ${numerator}^${exponent}/${denominator}^${exponent} = ${resultNum}/${resultDen}${gcd > 1 ? ` = ${correctAnswer}` : ''}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateNegativeExponent() {
        const numerator = Math.floor(Math.random() * 4) + 2;
        const denominator = Math.floor(Math.random() * 4) + 3;
        const exponent = Math.floor(Math.random() * 3) + 1;

        const resultNum = Math.pow(denominator, exponent);
        const resultDen = Math.pow(numerator, exponent);

        const options = [
            `${resultNum}/${resultDen}`,
            `${resultDen}/${resultNum}`,
            `${numerator}/${denominator}`,
            `${Math.pow(numerator, exponent)}/${Math.pow(denominator, exponent)}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Calcular: (${numerator}/${denominator})^(-${exponent})`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para un exponente negativo, invertimos la fracción y cambiamos el signo: (${numerator}/${denominator})^(-${exponent}) = (${denominator}/${numerator})^${exponent} = ${resultNum}/${resultDen}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateZeroExponent() {
        const numerator = Math.floor(Math.random() * 9) + 1;
        let denominator = Math.floor(Math.random() * 9) + 1;

        while (denominator === numerator) {
            denominator = Math.floor(Math.random() * 9) + 1;
        }

        const options = ['1', '0', `${numerator}/${denominator}`, `${numerator + denominator}`];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'básico',
            problem: `Calcular: (${numerator}/${denominator})^0`,
            options: this.shuffleArray(options),
            correctAnswer: '1',
            explanation: `Cualquier número diferente de cero elevado a la potencia 0 es igual a 1: (${numerator}/${denominator})^0 = 1`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateMixedOperations() {
        const num1 = Math.floor(Math.random() * 3) + 2;
        const den1 = Math.floor(Math.random() * 3) + 3;
        const exp1 = Math.floor(Math.random() * 3) + 1;
        const exp2 = Math.floor(Math.random() * 3) + 1;

        const resultNum = Math.pow(num1, exp1 + exp2);
        const resultDen = Math.pow(den1, exp1 + exp2);

        const options = [
            `${resultNum}/${resultDen}`,
            `${Math.pow(num1, exp1)}/${Math.pow(den1, exp1)}`,
            `${Math.pow(num1, exp2)}/${Math.pow(den1, exp2)}`,
            `${resultNum + 1}/${resultDen}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Calcular: (${num1}/${den1})^${exp1} × (${num1}/${den1})^${exp2}`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Cuando multiplicamos potencias con la misma base, sumamos los exponentes: (${num1}/${den1})^${exp1} × (${num1}/${den1})^${exp2} = (${num1}/${den1})^${exp1 + exp2} = ${resultNum}/${resultDen}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateWordProblem() {
        const scenarios = [
            {
                context: 'Una bacteria se reproduce duplicándose cada hora. Si inicialmente hay 1/8 de bacteria por mililitro',
                question: '¿Cuántas bacterias por mililitro habrá después de 3 horas?',
                base: { num: 1, den: 8 },
                multiplier: 8, // 2^3 for doubling 3 times
                correctAnswer: '1'
            },
            {
                context: 'Un papel de grosor 3/4 mm se dobla por la mitad repetidamente',
                question: '¿Cuál será su grosor después de 2 dobleces?',
                base: { num: 3, den: 4 },
                multiplier: 4, // 2^2 for doubling thickness 2 times
                correctAnswer: '3'
            },
            {
                context: 'Una inversión pierde 1/3 de su valor cada año. Si inicialmente vale 9/16 del capital',
                question: '¿Qué fracción del capital original quedará después de 2 años?',
                base: { num: 2, den: 3 }, // remaining fraction after losing 1/3
                initialValue: { num: 9, den: 16 },
                correctAnswer: '1/4'
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        const options = [
            scenario.correctAnswer,
            `${scenario.base.num}/${scenario.base.den}`,
            `${scenario.base.num * 2}/${scenario.base.den}`,
            `${scenario.base.num}/${scenario.base.den * 2}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `${scenario.context}. ${scenario.question}`,
            options: this.shuffleArray(options),
            correctAnswer: scenario.correctAnswer,
            explanation: `La respuesta se obtiene aplicando las propiedades de potenciación según el contexto del problema.`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateComparison() {
        const fractions = [
            { num: 1, den: 2 },
            { num: 1, den: 3 },
            { num: 2, den: 3 },
            { num: 1, den: 4 },
            { num: 3, den: 4 }
        ];

        const frac1 = fractions[Math.floor(Math.random() * fractions.length)];
        const frac2 = fractions[Math.floor(Math.random() * fractions.length)];
        const exp = Math.floor(Math.random() * 3) + 2;

        const result1 = Math.pow(frac1.num, exp) / Math.pow(frac1.den, exp);
        const result2 = Math.pow(frac2.num, exp) / Math.pow(frac2.den, exp);

        let correctAnswer;
        if (result1 > result2) {
            correctAnswer = `(${frac1.num}/${frac1.den})^${exp} > (${frac2.num}/${frac2.den})^${exp}`;
        } else if (result1 < result2) {
            correctAnswer = `(${frac1.num}/${frac1.den})^${exp} < (${frac2.num}/${frac2.den})^${exp}`;
        } else {
            correctAnswer = `(${frac1.num}/${frac1.den})^${exp} = (${frac2.num}/${frac2.den})^${exp}`;
        }

        const options = [
            `(${frac1.num}/${frac1.den})^${exp} > (${frac2.num}/${frac2.den})^${exp}`,
            `(${frac1.num}/${frac1.den})^${exp} < (${frac2.num}/${frac2.den})^${exp}`,
            `(${frac1.num}/${frac1.den})^${exp} = (${frac2.num}/${frac2.den})^${exp}`,
            'No se puede determinar'
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Comparar: (${frac1.num}/${frac1.den})^${exp} y (${frac2.num}/${frac2.den})^${exp}`,
            options: this.shuffleArray(options),
            correctAnswer: correctAnswer,
            explanation: `Calculamos cada potencia: (${frac1.num}/${frac1.den})^${exp} = ${result1.toFixed(4)} y (${frac2.num}/${frac2.den})^${exp} = ${result2.toFixed(4)}. Por lo tanto: ${correctAnswer}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    // Radicación questions
    generateRadicacionQuestion() {
        const questionTypes = [
            'basic_square_root',
            'cube_root',
            'rationalization',
            'radical_operations',
            'word_problem_radicals'
        ];

        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];

        switch (type) {
            case 'basic_square_root':
                return this.generateBasicSquareRoot();
            case 'cube_root':
                return this.generateCubeRoot();
            case 'rationalization':
                return this.generateRationalization();
            case 'radical_operations':
                return this.generateRadicalOperations();
            case 'word_problem_radicals':
                return this.generateRadicalWordProblem();
            default:
                return this.generateBasicSquareRoot();
        }
    }

    generateBasicSquareRoot() {
        const perfectSquares = [4, 9, 16, 25, 36, 49, 64, 81, 100];
        const numerator = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];
        const denominator = perfectSquares[Math.floor(Math.random() * perfectSquares.length)];

        const resultNum = Math.sqrt(numerator);
        const resultDen = Math.sqrt(denominator);

        const options = [
            `${resultNum}/${resultDen}`,
            `${resultNum + 1}/${resultDen}`,
            `${resultNum}/${resultDen + 1}`,
            `${Math.sqrt(numerator + 1)}/${Math.sqrt(denominator)}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'básico',
            problem: `Calcular: √(${numerator}/${denominator})`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para calcular la raíz cuadrada de una fracción: √(${numerator}/${denominator}) = √${numerator}/√${denominator} = ${resultNum}/${resultDen}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateCubeRoot() {
        const perfectCubes = [8, 27, 64, 125];
        const numerator = perfectCubes[Math.floor(Math.random() * perfectCubes.length)];
        const denominator = perfectCubes[Math.floor(Math.random() * perfectCubes.length)];

        const resultNum = Math.cbrt(numerator);
        const resultDen = Math.cbrt(denominator);

        const options = [
            `${resultNum}/${resultDen}`,
            `${resultNum + 1}/${resultDen}`,
            `${resultNum}/${resultDen + 1}`,
            `${Math.cbrt(numerator + 1)}/${Math.cbrt(denominator)}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'intermedio',
            problem: `Calcular: ∛(${numerator}/${denominator})`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para calcular la raíz cúbica de una fracción: ∛(${numerator}/${denominator}) = ∛${numerator}/∛${denominator} = ${resultNum}/${resultDen}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRationalization() {
        const denominators = [2, 3, 5, 6, 7];
        const denominator = denominators[Math.floor(Math.random() * denominators.length)];

        const options = [
            `√${denominator}/${denominator}`,
            `1/√${denominator}`,
            `√${denominator}`,
            `${denominator}/√${denominator}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Racionalizar: 1/√${denominator}`,
            options: this.shuffleArray(options),
            correctAnswer: `√${denominator}/${denominator}`,
            explanation: `Para racionalizar, multiplicamos numerador y denominador por √${denominator}: (1/√${denominator}) × (√${denominator}/√${denominator}) = √${denominator}/${denominator}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRadicalOperations() {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;

        const result = Math.sqrt(a * b);
        const isInteger = Number.isInteger(result);

        const correctAnswer = isInteger ? result.toString() : `√${a * b}`;

        const options = [
            correctAnswer,
            `√${a} + √${b}`,
            `√${a + b}`,
            `${Math.floor(result) + 1}`
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'intermedio',
            problem: `Calcular: √${a} × √${b}`,
            options: this.shuffleArray(options),
            correctAnswer: correctAnswer,
            explanation: `Aplicamos la propiedad √a × √b = √(ab): √${a} × √${b} = √${a * b}${isInteger ? ` = ${result}` : ''}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRadicalWordProblem() {
        const scenarios = [
            {
                context: 'Un terreno cuadrado tiene área de 49/64 hectáreas',
                question: '¿Cuál es la longitud de cada lado?',
                correctAnswer: '7/8'
            },
            {
                context: 'Un cubo tiene volumen de 27/125 metros cúbicos',
                question: '¿Cuál es la longitud de su arista?',
                correctAnswer: '3/5'
            },
            {
                context: 'La velocidad de escape es v = √(25/9) km/s',
                question: '¿Cuál es el valor numérico?',
                correctAnswer: '5/3'
            }
        ];

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        const options = [
            scenario.correctAnswer,
            '1/2',
            '2/3',
            '3/4'
        ];

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `${scenario.context}. ${scenario.question}`,
            options: this.shuffleArray(options),
            correctAnswer: scenario.correctAnswer,
            explanation: `La respuesta se obtiene aplicando las propiedades de radicación según el contexto del problema.`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    // Utility functions
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Generate questions for other exam types
    generateCompleteExamQuestions() {
        return this.generateMicroExamQuestions('potenciacion-racionales', 10);
    }

    generateMacroExamQuestions(macroTheme) {
        return this.generateMicroExamQuestions('potenciacion-racionales', 10);
    }
}

// Global question generator instance
window.questionGenerator = new QuestionGenerator();