// src/js/components/ReferenceInputPage/ReferenceInputPage.js
import { Api } from '/src/api/index.js';
import { animations } from '../../utils/animations.js';

// src/js/components/ReferenceInputPage/ReferenceInputPage.js
export class ReferenceInputPage {
    constructor() {
        this.state = {
            provider: '',
            referenceNumber: '',
            whatsapp: '',
            isLoading: false,
            error: null
        };

        this.injectBaseStyles();
    }
        handleInputChange(event) {
        const { id, value } = event.target;
        this.setState({ [id]: value });
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
    
        if (newState.error !== undefined || newState.isLoading !== undefined) {
            // Only rerender the form if error or loading state changes
            this.updateFormState();
        }
    }
    

    render() {
        console.log('Rendering ReferenceInputPage');  // Debug log
        const app = document.getElementById('app');
        if (!app) {
            console.error('App element not found');
            return;
        }

        app.innerHTML = this.getTemplate();
        this.attachEventListeners();
    }

    getTemplate() {
        return `
            <div class="main-content">
                <!-- Logo Section -->
                <div class="logo-section">
                    <img src="/src/assets/logo.svg" alt="Logo" class="logo-icon -ml-8 -mt-8" style="width: 13rem; height: 13rem;" />
                </div>

                <!-- Main Layout -->
                <div class="layout-grid">
                    <!-- Form Section -->
                    <div class="form-section">
                        <div class="form-container">
                            <h2 class="form-title">Get your quote</h2>
                            ${this.getFormTemplate()}
                        </div>
                    </div>

                    <!-- Right Content Section -->
                    <div class="right-section">
                        ${this.getRightContentTemplate()}
                    </div>
                </div>
            </div>
        `;
    }

    getFormTemplate() {
        return `
            <form id="quote-form" class="space-y-6">
                <!-- Provider Field -->
                <div class="form-group">
                    <label class="form-label" for="provider">
                        Choose your electricity Provider
                    </label>
                    <input 
                        type="text" 
                        id="provider"
                        class="form-input"
                        placeholder="e.g., MEPCO"
                        value="${this.state.provider}"
                        ${this.state.isLoading ? "disabled" : ""}
                    >
                </div>

                <!-- Reference Number Field -->
                <div class="form-group">
                    <label class="form-label" for="referenceNumber">
                        Enter your bill reference number
                    </label>
                    <input 
                        type="text" 
                        id="referenceNumber"
                        class="form-input"
                        placeholder="Enter reference number"
                        value="${this.state.referenceNumber}"
                        ${this.state.isLoading ? "disabled" : ""}
                    >
                </div>

                <!-- WhatsApp Field -->
                <div class="form-group">
                    <label class="form-label" for="whatsapp">
                        Enter your WhatsApp phone Number
                    </label>
                    <input 
                        type="tel" 
                        id="whatsapp"
                        class="form-input"
                        placeholder="+92 XXX XXXXXXX"
                        value="${this.state.whatsapp}"
                        ${this.state.isLoading ? "disabled" : ""}
                    >
                </div>

                <!-- Submit Button -->
                <button 
                    type="submit" 
                    class="submit-button"
                    ${this.state.isLoading ? "disabled" : ""}
                >
                    ${this.state.isLoading ? this.getLoadingTemplate() : "Generate Quote"}
                </button>

                ${this.state.error ? this.getErrorTemplate() : ""}
            </form>
        `;
    }

    getRightContentTemplate() {
        return `
            <div class="right-content">
                <p>
                    Our AI tool quickly provides
                    <br>the ideal system size and
                    <br>savings estimate—no
                    <br>in-person consultation
                    <br>needed. Get the fastest
                    <br>solar quote in Pakistan!
                </p>
            </div>
            <div class="powered-by">
                POWERED BY AI
            </div>
        `;
    }

    getLoadingTemplate() {
        return `
            <span>Processing</span>
            <div class="spinner"></div>
        `;
    }

    getErrorTemplate() {
        return `
            <div class="error-message">
                ${this.state.error}
            </div>
        `;
    }

    attachEventListeners() {
        const form = document.getElementById('quote-form');
        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        const inputs = document.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('input', this.handleInput.bind(this));
        });
    }

    handleInput(event) {
        const { id, value } = event.target;
        this.state[id] = value; // Update the state directly without triggering re-render
    }
    

    async handleSubmit(event) {
        event.preventDefault();
        if (this.state.isLoading) return;

        try {
            this.setState({ isLoading: true, error: null });

            // Validate reference number
            const validationResult = await Api.bill.validateReferenceNumber(
                this.state.referenceNumber
            );

            if (!validationResult.data.isValid) {
                print('Invalid reference number');
                throw new Error('Invalid reference number');              
            }

            // Store reference number in sessionStorage for persistence
            sessionStorage.setItem('currentReferenceNumber', this.state.referenceNumber);

            window.router.push('/bill-review');
        } catch (error) {
            this.setState({
                error: error.message || 'Failed to process reference number',
                isLoading: false
            });
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.updateFormState();
    }

    updateFormState() {
        const form = document.getElementById('quote-form');
        if (!form) return;
        form.innerHTML = this.getFormTemplate();
        this.attachEventListeners();
    }

    injectBaseStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .main-content {
                min-height: 100vh;
                background-color: var(--color-bg);
            }

            .layout-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                min-height: 100vh;
            }

            .form-section {
                padding: 2rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .form-container {
                max-width: 28rem;
                width: 100%;
            }

            .form-title {
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--color-fg);
                margin-bottom: 1.5rem;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-label {
                display: block;
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--color-fg);
                margin-bottom: 0.5rem;
            }

            .form-input {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 1px solid #e5e7eb;
                border-radius: 0.375rem;
                font-size: 0.875rem;
                transition: border-color 0.2s;
            }

            .form-input:focus {
                border-color: var(--color-primary);
                outline: none;
            }

            .submit-button {
                width: 100%;
                padding: 0.75rem 1.5rem;
                background-color: var(--color-primary);
                color: white;
                border: none;
                border-radius: 0.375rem;
                font-weight: 500;
                cursor: pointer;
                transition: background-color 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .submit-button:hover {
                background-color: var(--color-primary-dark);
            }

            .submit-button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .right-section {
                background-color: var(--color-primary);
                color: white;
                padding: 2rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            .right-content {
                font-size: 1.5rem;
                line-height: 1.4;
            }

            .powered-by {
                margin-top: 2rem;
                font-size: 0.875rem;
                opacity: 0.8;
            }

            .error-message {
                margin-top: 1rem;
                padding: 0.75rem;
                background-color: #fee2e2;
                border: 1px solid #ef4444;
                border-radius: 0.375rem;
                color: #dc2626;
                font-size: 0.875rem;
            }

            .spinner {
                width: 1.25rem;
                height: 1.25rem;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }

            @media (max-width: 768px) {
                .layout-grid {
                    grid-template-columns: 1fr;
                }

                .right-section {
                    display: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}
