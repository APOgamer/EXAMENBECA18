// Professional Alert System
class AlertSystem {
    constructor() {
        this.alertOverlay = document.getElementById('alert-overlay');
        this.alertModal = document.getElementById('alert-modal');
        this.alertIcon = document.getElementById('alert-icon');
        this.alertTitle = document.getElementById('alert-title');
        this.alertMessage = document.getElementById('alert-message');
        this.alertCancel = document.getElementById('alert-cancel');
        this.alertConfirm = document.getElementById('alert-confirm');
        this.toastContainer = document.getElementById('toast-container');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Close alert when clicking overlay
        this.alertOverlay.addEventListener('click', (e) => {
            if (e.target === this.alertOverlay) {
                this.hideAlert();
            }
        });

        // ESC key to close alert
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.alertOverlay.classList.contains('show')) {
                this.hideAlert();
            }
        });
    }

    // Show alert dialog
    showAlert(options = {}) {
        const {
            type = 'info',
            title = 'Información',
            message = '',
            confirmText = 'Aceptar',
            cancelText = 'Cancelar',
            showCancel = false,
            onConfirm = null,
            onCancel = null
        } = options;

        // Set icon based on type
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        this.alertIcon.textContent = icons[type] || icons.info;
        this.alertIcon.className = `alert-icon ${type}`;
        
        // Set content
        this.alertTitle.textContent = title;
        this.alertMessage.textContent = message;
        this.alertConfirm.textContent = confirmText;
        this.alertCancel.textContent = cancelText;

        // Show/hide cancel button
        this.alertCancel.style.display = showCancel ? 'block' : 'none';

        // Set up event handlers
        this.alertConfirm.onclick = () => {
            this.hideAlert();
            if (onConfirm) onConfirm();
        };

        this.alertCancel.onclick = () => {
            this.hideAlert();
            if (onCancel) onCancel();
        };

        // Show alert
        this.alertOverlay.classList.add('show');
        this.alertConfirm.focus();
    }

    hideAlert() {
        this.alertOverlay.classList.remove('show');
    }

    // Show confirmation dialog
    showConfirm(options = {}) {
        return new Promise((resolve) => {
            this.showAlert({
                ...options,
                type: options.type || 'warning',
                showCancel: true,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });
    }

    // Show toast notification
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };

        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${titles[type]}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">×</button>
        `;

        // Add close functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.removeToast(toast);
        });

        // Add to container
        this.toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.removeToast(toast);
            }, duration);
        }

        return toast;
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Convenience methods
    success(message, duration) {
        return this.showToast(message, 'success', duration);
    }

    error(message, duration) {
        return this.showToast(message, 'error', duration);
    }

    warning(message, duration) {
        return this.showToast(message, 'warning', duration);
    }

    info(message, duration) {
        return this.showToast(message, 'info', duration);
    }

    // Replace native alert
    alert(message, title = 'Información') {
        return new Promise((resolve) => {
            this.showAlert({
                title,
                message,
                onConfirm: resolve
            });
        });
    }

    // Replace native confirm
    confirm(message, title = 'Confirmación') {
        return this.showConfirm({
            title,
            message,
            confirmText: 'Sí',
            cancelText: 'No'
        });
    }

    // Show loading alert
    showLoading(message = 'Cargando...') {
        this.showAlert({
            title: 'Procesando',
            message: `<div class="loading-spinner"></div> ${message}`,
            confirmText: '',
            showCancel: false
        });
        
        // Hide confirm button for loading
        this.alertConfirm.style.display = 'none';
    }

    hideLoading() {
        this.hideAlert();
    }
}

// Global alert system instance
window.alertSystem = new AlertSystem();

// Override native alert and confirm
window.alert = (message) => alertSystem.alert(message);
window.confirm = (message) => alertSystem.confirm(message);