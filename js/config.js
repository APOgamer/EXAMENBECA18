// Configuration and Constants
const CONFIG = {
    // Exam Settings
    COMPLETE_EXAM: {
        QUESTIONS: 40,
        TIME_LIMIT: 90 * 60, // 90 minutes in seconds
        PASS_SCORE: 70
    },
    MACRO_EXAM: {
        QUESTIONS: 15,
        TIME_LIMIT: 30 * 60, // 30 minutes in seconds
        PASS_SCORE: 70
    },
    MICRO_EXAM: {
        QUESTIONS: 10,
        TIME_LIMIT: 15 * 60, // 15 minutes in seconds
        PASS_SCORE: 70
    },
    
    // Security Settings
    SECURITY: {
        MAX_ATTEMPTS_PER_DAY: 50,
        TAB_SWITCH_WARNING: true,
        DISABLE_RIGHT_CLICK: true,
        DISABLE_TEXT_SELECTION: true,
        BLUR_ON_FOCUS_LOSS: true,
        LOG_SUSPICIOUS_ACTIVITY: true
    },
    
    // Points System
    POINTS: {
        CORRECT_ANSWER: 10,
        WRONG_ANSWER: 0
    },
    
    // Storage Keys
    STORAGE_KEYS: {
        EXAM_HISTORY: 'beca18_exam_history',
        USER_PROGRESS: 'beca18_user_progress',
        ATTEMPT_COUNTER: 'beca18_attempt_counter',
        SECURITY_LOGS: 'beca18_security_logs'
    }
};

// Macro Themes Definition
const MACRO_THEMES = {
    'numeros-operaciones': {
        id: 'numeros-operaciones',
        title: '1️⃣ NÚMEROS Y OPERACIONES',
        description: 'Operaciones con números racionales, notación científica, porcentajes e interés simple',
        microThemes: [
            'potenciacion-racionales',
            'radicacion-racionales', 
            'operaciones-combinadas',
            'aproximacion-redondeo',
            'notacion-cientifica',
            'notacion-exponencial',
            'fraccion-razon',
            'intervalos-numericos',
            'operaciones-intervalos',
            'porcentajes-sucesivos',
            'interes-simple',
            'conversion-longitud',
            'conversion-tiempo',
            'multiplos-submultiplos',
            'evaluacion-descuentos'
        ]
    },
    'algebra': {
        id: 'algebra',
        title: '2️⃣ REGULARIDAD, EQUIVALENCIA Y CAMBIO',
        description: 'Álgebra, funciones, ecuaciones y progresiones',
        microThemes: [
            'proporcionalidad-directa',
            'proporcionalidad-inversa',
            'expresiones-algebraicas',
            'modelacion-algebraica',
            'ecuaciones-lineales',
            'sistemas-ecuaciones',
            'inecuaciones-primer-grado',
            'funcion-lineal',
            'funcion-afin',
            'representacion-grafica',
            'interpretacion-graficos',
            'funcion-cuadratica',
            'ecuaciones-cuadraticas',
            'interpretacion-contextual',
            'progresiones-aritmeticas',
            'progresiones-geometricas',
            'funciones-exponenciales',
            'analisis-graficos'
        ]
    },
    'geometria': {
        id: 'geometria',
        title: '3️⃣ FORMA, MOVIMIENTO Y LOCALIZACIÓN',
        description: 'Geometría, trigonometría y medidas',
        microThemes: [
            'volumen-cilindro',
            'volumen-cono',
            'volumen-esfera',
            'capacidad-cuerpos',
            'relaciones-metricas',
            'puntos-notables',
            'lineas-notables',
            'propiedades-cuadrilateros',
            'clasificacion-cuadrilateros',
            'elementos-circunferencia',
            'longitud-circunferencia',
            'angulos-circunferencia',
            'razones-trigonometricas',
            'aplicacion-trigonometria',
            'poligonos-regulares',
            'propiedades-poligonos'
        ]
    },
    'estadistica': {
        id: 'estadistica',
        title: '4️⃣ GESTIÓN DE DATOS E INCERTIDUMBRE',
        description: 'Estadística, probabilidad y análisis de datos',
        microThemes: [
            'sucesos-aleatorios',
            'suceso-seguro-posible',
            'probabilidad-simple',
            'tablas-frecuencia',
            'tablas-datos-agrupados',
            'graficos-barras',
            'graficos-circulares',
            'graficos-lineas',
            'pictogramas',
            'variables-discretas',
            'variables-continuas',
            'media-aritmetica',
            'mediana',
            'moda',
            'interpretacion-graficos',
            'validacion-conclusiones'
        ]
    }
};

// Micro Themes Detailed Information
const MICRO_THEMES_INFO = {
    'potenciacion-racionales': {
        title: 'Potenciación con números racionales',
        description: 'Operaciones de potenciación utilizando números racionales como base y exponente.',
        explanation: `La potenciación con números racionales involucra elevar fracciones a diferentes exponentes. 
        Las propiedades fundamentales incluyen: a^m × a^n = a^(m+n), (a^m)^n = a^(mn), y a^(-n) = 1/a^n.
        Para fracciones: (a/b)^n = a^n/b^n. Es importante recordar que cualquier número elevado a la potencia 0 es igual a 1.`,
        formulas: [
            '(a/b)^n = a^n/b^n',
            'a^(-n) = 1/a^n',
            'a^0 = 1 (a ≠ 0)'
        ],
        examples: [
            {
                problem: 'Calcular (2/3)^2',
                solution: '(2/3)^2 = 2^2/3^2 = 4/9'
            },
            {
                problem: 'Simplificar (1/2)^(-3)',
                solution: '(1/2)^(-3) = 1/(1/2)^3 = 1/(1/8) = 8'
            },
            {
                problem: 'Evaluar (3/4)^0',
                solution: '(3/4)^0 = 1'
            }
        ]
    },
    'radicacion-racionales': {
        title: 'Radicación de números racionales',
        description: 'Operaciones de radicación con números racionales, incluyendo simplificación y racionalización.',
        explanation: `La radicación es la operación inversa de la potenciación. Para números racionales, aplicamos las propiedades:
        √(a/b) = √a/√b, ⁿ√(a^m) = a^(m/n), y ⁿ√(ab) = ⁿ√a × ⁿ√b.
        La racionalización consiste en eliminar radicales del denominador multiplicando por el conjugado o factor racionalizante apropiado.`,
        formulas: [
            '√(a/b) = √a/√b',
            'ⁿ√(a^m) = a^(m/n)',
            '1/√a = √a/a (racionalización)'
        ],
        examples: [
            {
                problem: 'Calcular √(9/16)',
                solution: '√(9/16) = √9/√16 = 3/4'
            },
            {
                problem: 'Racionalizar 1/√2',
                solution: '1/√2 = 1/√2 × √2/√2 = √2/2'
            },
            {
                problem: 'Simplificar ³√(8/27)',
                solution: '³√(8/27) = ³√8/³√27 = 2/3'
            }
        ]
    }
};

// Current exam state
let currentExamState = {
    type: null, // 'complete', 'macro', 'micro'
    questions: [],
    currentQuestion: 0,
    answers: [],
    startTime: null,
    timeRemaining: 0,
    score: 0,
    isActive: false
};

// Security state
let securityState = {
    tabSwitches: 0,
    focusLosses: 0,
    rightClicks: 0,
    devToolsAttempts: 0,
    suspiciousActivity: [],
    examStartTime: null
};

// MathJax Configuration (fallback if CDN fails)
if (!window.MathJax) {
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
        },
        options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
        }
    };
}