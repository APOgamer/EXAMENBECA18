// Question Generator for Potenciación con números racionales
class QuestionGenerator {
    constructor() {
        this.currentMicroTheme = 'potenciacion-racionales';
    }

    // Generate 10 unique questions for the current micro theme
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
            'decimal_base',
            'comparison',
            'word_problem',
            'simplification',
            'multiple_operations',
            'rational_exponent'
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
            case 'decimal_base':
                return this.generateDecimalBase();
            case 'comparison':
                return this.generateComparison();
            case 'word_problem':
                return this.generateWordProblem();
            case 'simplification':
                return this.generateSimplification();
            case 'multiple_operations':
                return this.generateMultipleOperations();
            case 'rational_exponent':
                return this.generateRationalExponent();
            default:
                return this.generateBasicFractionPower();
        }
    }

    generateBasicFractionPower() {
        const numerator = Math.floor(Math.random() * 5) + 1;
        const denominator = Math.floor(Math.random() * 5) + 2;
        const exponent = Math.floor(Math.random() * 4) + 2;
        
        const resultNum = Math.pow(numerator, exponent);
        const resultDen = Math.pow(denominator, exponent);
        
        const options = [
            `${resultNum}/${resultDen}`,
            `${resultNum + 1}/${resultDen}`,
            `${resultNum}/${resultDen + 1}`,
            `${Math.pow(numerator + 1, exponent)}/${Math.pow(denominator, exponent)}`
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'básico',
            problem: `Calcular: (${numerator}/${denominator})^${exponent}`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para elevar una fracción a una potencia, elevamos tanto el numerador como el denominador a esa potencia: (${numerator}/${denominator})^${exponent} = ${numerator}^${exponent}/${denominator}^${exponent} = ${resultNum}/${resultDen}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateNegativeExponent() {
        const numerator = Math.floor(Math.random() * 4) + 1;
        const denominator = Math.floor(Math.random() * 4) + 2;
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
            difficulty: 'intermedio',
            problem: `Calcular: (${numerator}/${denominator})^(-${exponent})`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para un exponente negativo, invertimos la fracción y cambiamos el signo del exponente: (${numerator}/${denominator})^(-${exponent}) = (${denominator}/${numerator})^${exponent} = ${denominator}^${exponent}/${numerator}^${exponent} = ${resultNum}/${resultDen}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateZeroExponent() {
        const numerator = Math.floor(Math.random() * 9) + 1;
        const denominator = Math.floor(Math.random() * 9) + 1;
        
        while (denominator === numerator) {
            denominator = Math.floor(Math.random() * 9) + 1;
        }
        
        const options = ['1', '0', `${numerator}/${denominator}`, `${numerator + denominator}`];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'básico',
            problem: `Calcular: $\\left(\\frac{${numerator}}{${denominator}}\\right)^{0}$`,
            options: this.shuffleArray(options),
            correctAnswer: '1',
            explanation: `Cualquier número diferente de cero elevado a la potencia 0 es igual a 1:
            $\\left(\\frac{${numerator}}{${denominator}}\\right)^{0} = 1$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateMixedOperations() {
        const num1 = Math.floor(Math.random() * 3) + 1;
        const den1 = Math.floor(Math.random() * 3) + 2;
        const exp1 = Math.floor(Math.random() * 3) + 1;
        const exp2 = Math.floor(Math.random() * 3) + 1;
        
        const result1 = Math.pow(num1, exp1) / Math.pow(den1, exp1);
        const result2 = Math.pow(num1, exp2) / Math.pow(den1, exp2);
        const finalResult = result1 * result2;
        
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
            difficulty: 'intermedio',
            problem: `Calcular: $\\left(\\frac{${num1}}{${den1}}\\right)^{${exp1}} \\times \\left(\\frac{${num1}}{${den1}}\\right)^{${exp2}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Cuando multiplicamos potencias con la misma base, sumamos los exponentes:
            $\\left(\\frac{${num1}}{${den1}}\\right)^{${exp1}} \\times \\left(\\frac{${num1}}{${den1}}\\right)^{${exp2}} = \\left(\\frac{${num1}}{${den1}}\\right)^{${exp1}+${exp2}} = \\left(\\frac{${num1}}{${den1}}\\right)^{${exp1 + exp2}} = \\frac{${resultNum}}{${resultDen}}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateDecimalBase() {
        const decimals = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        const decimal = decimals[Math.floor(Math.random() * decimals.length)];
        const exponent = Math.floor(Math.random() * 3) + 2;
        
        const result = Math.pow(decimal, exponent);
        const roundedResult = Math.round(result * 1000) / 1000;
        
        const options = [
            roundedResult.toString(),
            (roundedResult + 0.001).toString(),
            (roundedResult - 0.001).toString(),
            (decimal * exponent).toString()
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'intermedio',
            problem: `Calcular: $(${decimal})^{${exponent}}$`,
            options: this.shuffleArray(options),
            correctAnswer: roundedResult.toString(),
            explanation: `Para calcular la potencia de un decimal:
            $(${decimal})^{${exponent}} = ${decimal} \\times ${decimal}${exponent > 2 ? ' \\times ' + decimal : ''} = ${roundedResult}$`,
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
        
        let comparison, correctAnswer;
        if (result1 > result2) {
            comparison = '>';
            correctAnswer = `$\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}} > \\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}}$`;
        } else if (result1 < result2) {
            comparison = '<';
            correctAnswer = `$\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}} < \\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}}$`;
        } else {
            comparison = '=';
            correctAnswer = `$\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}} = \\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}}$`;
        }
        
        const options = [
            `$\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}} > \\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}}$`,
            `$\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}} < \\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}}$`,
            `$\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}} = \\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}}$`,
            'No se puede determinar'
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Comparar: $\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}}$ y $\\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}}$`,
            options: this.shuffleArray(options),
            correctAnswer: correctAnswer,
            explanation: `Calculamos cada potencia:
            $\\left(\\frac{${frac1.num}}{${frac1.den}}\\right)^{${exp}} = \\frac{${Math.pow(frac1.num, exp)}}{${Math.pow(frac1.den, exp)}} = ${result1.toFixed(4)}$
            $\\left(\\frac{${frac2.num}}{${frac2.den}}\\right)^{${exp}} = \\frac{${Math.pow(frac2.num, exp)}}{${Math.pow(frac2.den, exp)}} = ${result2.toFixed(4)}$
            Por lo tanto: ${correctAnswer}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateWordProblem() {
        const scenarios = [
            {
                context: 'Una bacteria se divide en dos cada hora. Si inicialmente hay $\\frac{1}{4}$ de bacteria',
                question: '¿Cuántas bacterias habrá después de 3 horas?',
                base: { num: 1, den: 4 },
                exponent: 3,
                operation: 'multiply'
            },
            {
                context: 'Un papel se dobla por la mitad repetidamente. Su grosor inicial es $\\frac{2}{3}$ mm',
                question: '¿Cuál será su grosor después de 2 dobleces?',
                base: { num: 2, den: 3 },
                exponent: 2,
                operation: 'multiply'
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const result = Math.pow(scenario.base.num, scenario.exponent) / Math.pow(scenario.base.den, scenario.exponent);
        
        const options = [
            `${Math.pow(scenario.base.num, scenario.exponent)}/${Math.pow(scenario.base.den, scenario.exponent)}`,
            `${scenario.base.num * scenario.exponent}/${scenario.base.den}`,
            `${scenario.base.num}/${scenario.base.den * scenario.exponent}`,
            `${scenario.base.num + scenario.exponent}/${scenario.base.den + scenario.exponent}`
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `${scenario.context}. ${scenario.question}`,
            options: this.shuffleArray(options),
            correctAnswer: `${Math.pow(scenario.base.num, scenario.exponent)}/${Math.pow(scenario.base.den, scenario.exponent)}`,
            explanation: `La respuesta se obtiene elevando la fracción inicial a la potencia correspondiente:
            $\\left(\\frac{${scenario.base.num}}{${scenario.base.den}}\\right)^{${scenario.exponent}} = \\frac{${Math.pow(scenario.base.num, scenario.exponent)}}{${Math.pow(scenario.base.den, scenario.exponent)}}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateSimplification() {
        const num = Math.floor(Math.random() * 4) + 2;
        const den = Math.floor(Math.random() * 4) + 2;
        const exp1 = Math.floor(Math.random() * 3) + 2;
        const exp2 = Math.floor(Math.random() * 3) + 1;
        
        const gcd = this.gcd(Math.pow(num, exp1), Math.pow(den, exp1));
        const simplifiedNum = Math.pow(num, exp1) / gcd;
        const simplifiedDen = Math.pow(den, exp1) / gcd;
        
        const options = [
            `${simplifiedNum}/${simplifiedDen}`,
            `${Math.pow(num, exp1)}/${Math.pow(den, exp1)}`,
            `${num}/${den}`,
            `${simplifiedNum + 1}/${simplifiedDen}`
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'intermedio',
            problem: `Simplificar: $\\left(\\frac{${num}}{${den}}\\right)^{${exp1}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${simplifiedNum}/${simplifiedDen}`,
            explanation: `Primero calculamos la potencia y luego simplificamos:
            $\\left(\\frac{${num}}{${den}}\\right)^{${exp1}} = \\frac{${Math.pow(num, exp1)}}{${Math.pow(den, exp1)}}$
            Simplificando por el MCD(${Math.pow(num, exp1)}, ${Math.pow(den, exp1)}) = ${gcd}:
            $\\frac{${Math.pow(num, exp1)}}{${Math.pow(den, exp1)}} = \\frac{${simplifiedNum}}{${simplifiedDen}}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateMultipleOperations() {
        const num = Math.floor(Math.random() * 3) + 1;
        const den = Math.floor(Math.random() * 3) + 2;
        const exp1 = Math.floor(Math.random() * 3) + 1;
        const exp2 = Math.floor(Math.random() * 3) + 1;
        
        const resultExp = exp1 * exp2;
        const resultNum = Math.pow(num, resultExp);
        const resultDen = Math.pow(den, resultExp);
        
        const options = [
            `${resultNum}/${resultDen}`,
            `${Math.pow(num, exp1)}/${Math.pow(den, exp1)}`,
            `${Math.pow(num, exp2)}/${Math.pow(den, exp2)}`,
            `${Math.pow(num, exp1 + exp2)}/${Math.pow(den, exp1 + exp2)}`
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Calcular: $\\left[\\left(\\frac{${num}}{${den}}\\right)^{${exp1}}\\right]^{${exp2}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Cuando elevamos una potencia a otra potencia, multiplicamos los exponentes:
            $\\left[\\left(\\frac{${num}}{${den}}\\right)^{${exp1}}\\right]^{${exp2}} = \\left(\\frac{${num}}{${den}}\\right)^{${exp1} \\times ${exp2}} = \\left(\\frac{${num}}{${den}}\\right)^{${resultExp}} = \\frac{${resultNum}}{${resultDen}}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRationalExponent() {
        const bases = [4, 8, 9, 16, 25, 27];
        const base = bases[Math.floor(Math.random() * bases.length)];
        const expNum = 1;
        const expDen = Math.floor(Math.random() * 3) + 2;
        
        const result = Math.pow(base, expNum / expDen);
        const roundedResult = Math.round(result * 100) / 100;
        
        const options = [
            roundedResult.toString(),
            (roundedResult + 0.5).toString(),
            (base / expDen).toString(),
            Math.sqrt(base).toString()
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Calcular: $${base}^{\\frac{${expNum}}{${expDen}}}$`,
            options: this.shuffleArray(options),
            correctAnswer: roundedResult.toString(),
            explanation: `Un exponente fraccionario $\\frac{1}{n}$ equivale a la raíz n-ésima:
            $${base}^{\\frac{${expNum}}{${expDen}}} = \\sqrt[${expDen}]{${base}} = ${roundedResult}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    // Generate questions for Radicación de números racionales
    generateRadicacionQuestion() {
        const questionTypes = [
            'basic_square_root',
            'cube_root',
            'rationalization',
            'simplification',
            'mixed_radicals',
            'radical_operations',
            'radical_equations',
            'comparison_radicals',
            'word_problem_radicals',
            'nth_root'
        ];
        
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        switch (type) {
            case 'basic_square_root':
                return this.generateBasicSquareRoot();
            case 'cube_root':
                return this.generateCubeRoot();
            case 'rationalization':
                return this.generateRationalization();
            case 'simplification':
                return this.generateRadicalSimplification();
            case 'mixed_radicals':
                return this.generateMixedRadicals();
            case 'radical_operations':
                return this.generateRadicalOperations();
            case 'radical_equations':
                return this.generateRadicalEquations();
            case 'comparison_radicals':
                return this.generateRadicalComparison();
            case 'word_problem_radicals':
                return this.generateRadicalWordProblem();
            case 'nth_root':
                return this.generateNthRoot();
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
            problem: `Calcular: $\\sqrt{\\frac{${numerator}}{${denominator}}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para calcular la raíz cuadrada de una fracción, aplicamos la propiedad:
            $\\sqrt{\\frac{${numerator}}{${denominator}}} = \\frac{\\sqrt{${numerator}}}{\\sqrt{${denominator}}} = \\frac{${resultNum}}{${resultDen}}$`,
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
            problem: `Calcular: $\\sqrt[3]{\\frac{${numerator}}{${denominator}}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para calcular la raíz cúbica de una fracción:
            $\\sqrt[3]{\\frac{${numerator}}{${denominator}}} = \\frac{\\sqrt[3]{${numerator}}}{\\sqrt[3]{${denominator}}} = \\frac{${resultNum}}{${resultDen}}$`,
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
            difficulty: 'intermedio',
            problem: `Racionalizar: $\\frac{1}{\\sqrt{${denominator}}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `√${denominator}/${denominator}`,
            explanation: `Para racionalizar, multiplicamos numerador y denominador por $\\sqrt{${denominator}}$:
            $\\frac{1}{\\sqrt{${denominator}}} \\times \\frac{\\sqrt{${denominator}}}{\\sqrt{${denominator}}} = \\frac{\\sqrt{${denominator}}}{${denominator}}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRadicalSimplification() {
        const bases = [12, 18, 20, 24, 28, 32, 45, 50, 72, 98];
        const base = bases[Math.floor(Math.random() * bases.length)];
        
        // Find the simplified form
        let simplified = this.simplifyRadical(base);
        
        const options = [
            simplified,
            `√${base}`,
            `${Math.floor(Math.sqrt(base))}√${base - Math.floor(Math.sqrt(base))**2}`,
            `${Math.floor(Math.sqrt(base)) + 1}√${Math.floor(base/4)}`
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'intermedio',
            problem: `Simplificar: $\\sqrt{${base}}$`,
            options: this.shuffleArray(options),
            correctAnswer: simplified,
            explanation: `Para simplificar $\\sqrt{${base}}$, buscamos factores cuadrados perfectos:
            ${this.getSimplificationSteps(base)}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateMixedRadicals() {
        const coeff1 = Math.floor(Math.random() * 4) + 1;
        const coeff2 = Math.floor(Math.random() * 4) + 1;
        const radical = Math.floor(Math.random() * 10) + 2;
        
        const result = coeff1 + coeff2;
        
        const options = [
            `${result}√${radical}`,
            `${coeff1 * coeff2}√${radical}`,
            `${coeff1}√${radical * coeff2}`,
            `√${(coeff1 + coeff2) * radical}`
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'básico',
            problem: `Calcular: $${coeff1}\\sqrt{${radical}} + ${coeff2}\\sqrt{${radical}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${result}√${radical}`,
            explanation: `Sumamos los coeficientes de radicales semejantes:
            $${coeff1}\\sqrt{${radical}} + ${coeff2}\\sqrt{${radical}} = (${coeff1} + ${coeff2})\\sqrt{${radical}} = ${result}\\sqrt{${radical}}$`,
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
            problem: `Calcular: $\\sqrt{${a}} \\times \\sqrt{${b}}$`,
            options: this.shuffleArray(options),
            correctAnswer: correctAnswer,
            explanation: `Aplicamos la propiedad $\\sqrt{a} \\times \\sqrt{b} = \\sqrt{ab}$:
            $\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{${a} \\times ${b}} = \\sqrt{${a * b}}${isInteger ? ` = ${result}` : ''}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRadicalEquations() {
        const x = Math.floor(Math.random() * 8) + 1;
        const constant = Math.floor(Math.random() * 5) + 1;
        const result = x * x + constant;
        
        const options = [
            x.toString(),
            (x + 1).toString(),
            (x - 1).toString(),
            (x * 2).toString()
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Resolver: $\\sqrt{x + ${constant}} = ${x}$`,
            options: this.shuffleArray(options),
            correctAnswer: x.toString(),
            explanation: `Elevamos al cuadrado ambos lados:
            $(\\sqrt{x + ${constant}})^2 = ${x}^2$
            $x + ${constant} = ${x * x}$
            $x = ${x * x} - ${constant} = ${result - constant}$
            Verificamos: $\\sqrt{${x} + ${constant}} = \\sqrt{${result}} = ${x}$ ✓`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRadicalComparison() {
        const values = [
            { expr: '√4', value: 2 },
            { expr: '√9', value: 3 },
            { expr: '√16', value: 4 },
            { expr: '2√2', value: 2 * Math.sqrt(2) },
            { expr: '3√3', value: 3 * Math.sqrt(3) }
        ];
        
        const val1 = values[Math.floor(Math.random() * values.length)];
        const val2 = values[Math.floor(Math.random() * values.length)];
        
        let comparison, correctAnswer;
        if (val1.value > val2.value) {
            comparison = '>';
            correctAnswer = `${val1.expr} > ${val2.expr}`;
        } else if (val1.value < val2.value) {
            comparison = '<';
            correctAnswer = `${val1.expr} < ${val2.expr}`;
        } else {
            comparison = '=';
            correctAnswer = `${val1.expr} = ${val2.expr}`;
        }
        
        const options = [
            `${val1.expr} > ${val2.expr}`,
            `${val1.expr} < ${val2.expr}`,
            `${val1.expr} = ${val2.expr}`,
            'No se puede determinar'
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Comparar: $${val1.expr}$ y $${val2.expr}$`,
            options: this.shuffleArray(options),
            correctAnswer: correctAnswer,
            explanation: `Calculamos los valores aproximados:
            $${val1.expr} \\approx ${val1.value.toFixed(3)}$
            $${val2.expr} \\approx ${val2.value.toFixed(3)}$
            Por lo tanto: $${correctAnswer}$`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateRadicalWordProblem() {
        const scenarios = [
            {
                context: 'Un cuadrado tiene área de',
                area: 25,
                question: '¿Cuál es la longitud de su lado?',
                answer: 5
            },
            {
                context: 'La diagonal de un cuadrado mide',
                diagonal: 6,
                question: '¿Cuál es la longitud de su lado?',
                answer: Math.round((6 / Math.sqrt(2)) * 100) / 100
            }
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const value = scenario.area || scenario.diagonal;
        
        const options = [
            scenario.answer.toString(),
            (scenario.answer + 1).toString(),
            (scenario.answer - 1).toString(),
            (scenario.answer * 2).toString()
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `${scenario.context} ${value} unidades cuadradas. ${scenario.question}`,
            options: this.shuffleArray(options),
            correctAnswer: scenario.answer.toString(),
            explanation: `${scenario.area ? 
                `Si el área es ${value}, entonces lado = √${value} = ${scenario.answer}` :
                `Si la diagonal es ${value}, entonces lado = ${value}/√2 = ${scenario.answer}`}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    generateNthRoot() {
        const roots = [3, 4, 5];
        const n = roots[Math.floor(Math.random() * roots.length)];
        const bases = n === 3 ? [8, 27, 64, 125] : n === 4 ? [16, 81, 256] : [32, 243];
        const base = bases[Math.floor(Math.random() * bases.length)];
        
        const result = Math.pow(base, 1/n);
        
        const options = [
            result.toString(),
            (result + 1).toString(),
            (result - 1).toString(),
            Math.floor(base/n).toString()
        ];
        
        return {
            id: Math.random().toString(36).substr(2, 9),
            type: 'multiple_choice',
            difficulty: 'avanzado',
            problem: `Calcular: $\\sqrt[${n}]{${base}}$`,
            options: this.shuffleArray(options),
            correctAnswer: result.toString(),
            explanation: `$\\sqrt[${n}]{${base}} = ${base}^{1/${n}} = ${result}$
            Verificación: ${result}^${n} = ${base}`,
            points: CONFIG.POINTS.CORRECT_ANSWER
        };
    }

    // Utility functions for radicals
    simplifyRadical(n) {
        let factor = 1;
        let remaining = n;
        
        for (let i = 2; i * i <= n; i++) {
            while (remaining % (i * i) === 0) {
                factor *= i;
                remaining /= (i * i);
            }
        }
        
        if (factor === 1) {
            return `√${n}`;
        } else if (remaining === 1) {
            return factor.toString();
        } else {
            return `${factor}√${remaining}`;
        }
    }

    getSimplificationSteps(n) {
        let steps = '';
        let factor = 1;
        let remaining = n;
        
        for (let i = 2; i * i <= n; i++) {
            if (remaining % (i * i) === 0) {
                steps += `${n} = ${i * i} × ${remaining / (i * i)}, `;
                factor *= i;
                remaining /= (i * i);
            }
        }
        
        if (factor > 1) {
            steps += `por lo tanto √${n} = ${factor}√${remaining}`;
        } else {
            steps = `${n} no tiene factores cuadrados perfectos, por lo que √${n} ya está simplificado`;
        }
        
        return steps;
    }

    gcd(a, b) {
        while (b !== 0) {
            let temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Generate questions for other exam types (placeholder for future implementation)
    generateCompleteExamQuestions() {
        // This would generate 40 questions across all macro themes
        // For now, return 10 questions from current micro theme
        return this.generateMicroExamQuestions('potenciacion-racionales', 10);
    }

    generateMacroExamQuestions(macroTheme) {
        // This would generate 15 questions from the specified macro theme
        // For now, return 10 questions from current micro theme
        return this.generateMicroExamQuestions('potenciacion-racionales', 10);
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

    // Format mathematical expressions for better display
    formatMathExpression(expression) {
        // Convert common patterns to more readable format
        return expression
            .replace(/\^(-?\d+)/g, '<sup>$1</sup>')
            .replace(/(\d+)\/(\d+)/g, '<span class="fraction"><span class="numerator">$1</span><span class="denominator">$2</span></span>')
            .replace(/√(\d+)/g, '√<span style="text-decoration: overline;">$1</span>')
            .replace(/×/g, ' × ')
            .replace(/\+/g, ' + ')
            .replace(/-/g, ' - ');
    }
}

// Global question generator instance
window.questionGenerator = new QuestionGenerator();