// Question Generator for Potenciación con números racionales
class QuestionGenerator {
    constructor() {
        this.currentMicroTheme = 'potenciacion-racionales';
    }

    // Generate 10 unique questions for the current micro theme
    generateMicroExamQuestions(microTheme = 'potenciacion-racionales', count = 10) {
        const questions = [];
        const usedQuestions = new Set();
        
        while (questions.length < count) {
            const question = this.generatePotenciacionQuestion();
            const questionKey = JSON.stringify(question.problem);
            
            if (!usedQuestions.has(questionKey)) {
                usedQuestions.add(questionKey);
                questions.push(question);
            }
        }
        
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
            problem: `Calcular: $\\left(\\frac{${numerator}}{${denominator}}\\right)^{${exponent}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para elevar una fracción a una potencia, elevamos tanto el numerador como el denominador a esa potencia:
            $\\left(\\frac{${numerator}}{${denominator}}\\right)^{${exponent}} = \\frac{${numerator}^{${exponent}}}{${denominator}^{${exponent}}} = \\frac{${resultNum}}{${resultDen}}$`,
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
            problem: `Calcular: $\\left(\\frac{${numerator}}{${denominator}}\\right)^{-${exponent}}$`,
            options: this.shuffleArray(options),
            correctAnswer: `${resultNum}/${resultDen}`,
            explanation: `Para un exponente negativo, invertimos la fracción y cambiamos el signo del exponente:
            $\\left(\\frac{${numerator}}{${denominator}}\\right)^{-${exponent}} = \\left(\\frac{${denominator}}{${numerator}}\\right)^{${exponent}} = \\frac{${denominator}^{${exponent}}}{${numerator}^{${exponent}}} = \\frac{${resultNum}}{${resultDen}}$`,
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
}

// Global question generator instance
const questionGenerator = new QuestionGenerator();