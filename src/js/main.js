// src/js/main.js
import { App } from './app.js';
import { Toasts } from './components/Toasts.js';
import '../input.css';

async function startApp() {
    try {
        // Initialize toast notifications
        window.toasts = new Toasts();

        // Create and initialize app
        const app = new App();
        const initialized = await app.initialize();

        if (!initialized) {
            window.toasts.show('Failed to initialize application', 'error');
        }
    } catch (error) {
        console.error('Critical application error:', error);
        document.getElementById('app').innerHTML = `
            <div class="flex items-center justify-center h-screen">
                <div class="text-center">
                    <h1 class="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
                    <p class="text-gray-600">Failed to start the application. Please try refreshing the page.</p>
                </div>
            </div>
        `;
    }
}

// Start the application
startApp();
