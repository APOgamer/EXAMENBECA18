// IndexedDB Storage Manager
class StorageManager {
    constructor() {
        this.dbName = 'Beca18ExamDB';
        this.dbVersion = 1;
        this.db = null;
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            
            request.onerror = () => {
                console.error('Error opening database');
                reject(request.error);
            };
            
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('examHistory')) {
                    const examStore = db.createObjectStore('examHistory', { keyPath: 'id', autoIncrement: true });
                    examStore.createIndex('date', 'date', { unique: false });
                    examStore.createIndex('type', 'type', { unique: false });
                    examStore.createIndex('score', 'score', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('userProgress')) {
                    const progressStore = db.createObjectStore('userProgress', { keyPath: 'microTheme' });
                    progressStore.createIndex('macroTheme', 'macroTheme', { unique: false });
                    progressStore.createIndex('accuracy', 'accuracy', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('securityLogs')) {
                    const securityStore = db.createObjectStore('securityLogs', { keyPath: 'id', autoIncrement: true });
                    securityStore.createIndex('timestamp', 'timestamp', { unique: false });
                    securityStore.createIndex('activity', 'activity', { unique: false });
                }
                
                if (!db.objectStoreNames.contains('userSettings')) {
                    db.createObjectStore('userSettings', { keyPath: 'key' });
                }
            };
        });
    }

    // Exam History Methods
    async saveExamResult(examData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['examHistory'], 'readwrite');
            const store = transaction.objectStore('examHistory');
            
            const examResult = {
                type: examData.type,
                macroTheme: examData.macroTheme || null,
                microTheme: examData.microTheme || null,
                score: examData.score,
                totalQuestions: examData.totalQuestions,
                correctAnswers: examData.correctAnswers,
                timeSpent: examData.timeSpent,
                date: new Date().toISOString(),
                passed: examData.score >= CONFIG.COMPLETE_EXAM.PASS_SCORE,
                answers: examData.answers,
                securityEvents: examData.securityEvents || []
            };
            
            const request = store.add(examResult);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getExamHistory(limit = 50) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['examHistory'], 'readonly');
            const store = transaction.objectStore('examHistory');
            const index = store.index('date');
            
            const request = index.openCursor(null, 'prev');
            const results = [];
            let count = 0;
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && count < limit) {
                    results.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getExamStatistics() {
        const history = await this.getExamHistory();
        
        const stats = {
            totalExams: history.length,
            passedExams: history.filter(exam => exam.passed).length,
            averageScore: 0,
            bestScore: 0,
            totalTimeSpent: 0,
            examsByType: {},
            recentActivity: history.slice(0, 10)
        };
        
        if (history.length > 0) {
            stats.averageScore = history.reduce((sum, exam) => sum + exam.score, 0) / history.length;
            stats.bestScore = Math.max(...history.map(exam => exam.score));
            stats.totalTimeSpent = history.reduce((sum, exam) => sum + exam.timeSpent, 0);
            
            // Group by exam type
            history.forEach(exam => {
                if (!stats.examsByType[exam.type]) {
                    stats.examsByType[exam.type] = {
                        count: 0,
                        averageScore: 0,
                        passed: 0
                    };
                }
                stats.examsByType[exam.type].count++;
                stats.examsByType[exam.type].averageScore += exam.score;
                if (exam.passed) stats.examsByType[exam.type].passed++;
            });
            
            // Calculate averages
            Object.keys(stats.examsByType).forEach(type => {
                const typeStats = stats.examsByType[type];
                typeStats.averageScore = typeStats.averageScore / typeStats.count;
            });
        }
        
        return stats;
    }

    // User Progress Methods
    async updateMicroThemeProgress(microTheme, macroTheme, results) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userProgress'], 'readwrite');
            const store = transaction.objectStore('userProgress');
            
            // Get existing progress
            const getRequest = store.get(microTheme);
            
            getRequest.onsuccess = () => {
                let progress = getRequest.result || {
                    microTheme: microTheme,
                    macroTheme: macroTheme,
                    attempts: 0,
                    totalQuestions: 0,
                    correctAnswers: 0,
                    accuracy: 0,
                    bestScore: 0,
                    averageTime: 0,
                    lastAttempt: null,
                    timeSpent: 0
                };
                
                // Update progress
                progress.attempts++;
                progress.totalQuestions += results.totalQuestions;
                progress.correctAnswers += results.correctAnswers;
                progress.accuracy = (progress.correctAnswers / progress.totalQuestions) * 100;
                progress.bestScore = Math.max(progress.bestScore, results.score);
                progress.timeSpent += results.timeSpent;
                progress.averageTime = progress.timeSpent / progress.attempts;
                progress.lastAttempt = new Date().toISOString();
                
                const putRequest = store.put(progress);
                
                putRequest.onsuccess = () => {
                    resolve(progress);
                };
                
                putRequest.onerror = () => {
                    reject(putRequest.error);
                };
            };
            
            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    async getMicroThemeProgress(microTheme) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userProgress'], 'readonly');
            const store = transaction.objectStore('userProgress');
            
            const request = store.get(microTheme);
            
            request.onsuccess = () => {
                resolve(request.result || null);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getMacroThemeProgress(macroTheme) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userProgress'], 'readonly');
            const store = transaction.objectStore('userProgress');
            const index = store.index('macroTheme');
            
            const request = index.getAll(macroTheme);
            
            request.onsuccess = () => {
                const microThemes = request.result;
                
                if (microThemes.length === 0) {
                    resolve(null);
                    return;
                }
                
                const totalAttempts = microThemes.reduce((sum, mt) => sum + mt.attempts, 0);
                const totalQuestions = microThemes.reduce((sum, mt) => sum + mt.totalQuestions, 0);
                const totalCorrect = microThemes.reduce((sum, mt) => sum + mt.correctAnswers, 0);
                const totalTime = microThemes.reduce((sum, mt) => sum + mt.timeSpent, 0);
                
                const progress = {
                    macroTheme: macroTheme,
                    microThemesCompleted: microThemes.length,
                    totalMicroThemes: MACRO_THEMES[macroTheme].microThemes.length,
                    completionPercentage: (microThemes.length / MACRO_THEMES[macroTheme].microThemes.length) * 100,
                    overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
                    totalAttempts: totalAttempts,
                    totalTimeSpent: totalTime,
                    averageScore: microThemes.reduce((sum, mt) => sum + mt.bestScore, 0) / microThemes.length,
                    microThemes: microThemes
                };
                
                resolve(progress);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Security Logs Methods
    async saveSecurityLog(logEntry) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['securityLogs'], 'readwrite');
            const store = transaction.objectStore('securityLogs');
            
            const request = store.add(logEntry);
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getSecurityLogs(limit = 100) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['securityLogs'], 'readonly');
            const store = transaction.objectStore('securityLogs');
            const index = store.index('timestamp');
            
            const request = index.openCursor(null, 'prev');
            const results = [];
            let count = 0;
            
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor && count < limit) {
                    results.push(cursor.value);
                    count++;
                    cursor.continue();
                } else {
                    resolve(results);
                }
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // User Settings Methods
    async saveSetting(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userSettings'], 'readwrite');
            const store = transaction.objectStore('userSettings');
            
            const request = store.put({ key: key, value: value });
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getSetting(key, defaultValue = null) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userSettings'], 'readonly');
            const store = transaction.objectStore('userSettings');
            
            const request = store.get(key);
            
            request.onsuccess = () => {
                resolve(request.result ? request.result.value : defaultValue);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Data Export/Import Methods
    async exportData() {
        const [examHistory, userProgress, securityLogs, userSettings] = await Promise.all([
            this.getExamHistory(1000),
            this.getAllProgress(),
            this.getSecurityLogs(1000),
            this.getAllSettings()
        ]);
        
        return {
            exportDate: new Date().toISOString(),
            version: this.dbVersion,
            data: {
                examHistory,
                userProgress,
                securityLogs,
                userSettings
            }
        };
    }

    async importData(exportedData) {
        // Validate data structure
        if (!exportedData.data || !exportedData.version) {
            throw new Error('Invalid data format');
        }
        
        const { examHistory, userProgress, securityLogs, userSettings } = exportedData.data;
        
        // Import exam history
        if (examHistory && Array.isArray(examHistory)) {
            for (const exam of examHistory) {
                await this.saveExamResult(exam);
            }
        }
        
        // Import user progress
        if (userProgress && Array.isArray(userProgress)) {
            for (const progress of userProgress) {
                await this.updateMicroThemeProgress(
                    progress.microTheme,
                    progress.macroTheme,
                    {
                        totalQuestions: progress.totalQuestions,
                        correctAnswers: progress.correctAnswers,
                        score: progress.bestScore,
                        timeSpent: progress.timeSpent
                    }
                );
            }
        }
        
        // Import user settings
        if (userSettings && Array.isArray(userSettings)) {
            for (const setting of userSettings) {
                await this.saveSetting(setting.key, setting.value);
            }
        }
        
        return true;
    }

    async getAllProgress() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userProgress'], 'readonly');
            const store = transaction.objectStore('userProgress');
            
            const request = store.getAll();
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async getAllSettings() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['userSettings'], 'readonly');
            const store = transaction.objectStore('userSettings');
            
            const request = store.getAll();
            
            request.onsuccess = () => {
                resolve(request.result);
            };
            
            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    // Clear all data
    async clearAllData() {
        const stores = ['examHistory', 'userProgress', 'securityLogs', 'userSettings'];
        
        for (const storeName of stores) {
            await new Promise((resolve, reject) => {
                const transaction = this.db.transaction([storeName], 'readwrite');
                const store = transaction.objectStore(storeName);
                
                const request = store.clear();
                
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
        
        return true;
    }
}

// Global storage manager instance
window.storageManager = new StorageManager();