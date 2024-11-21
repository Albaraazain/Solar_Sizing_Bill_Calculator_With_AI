// src/js/app.js
import { Router } from './router.js';
import { Api } from '../api/index.js';
import { eventBus } from './core/events/EventBus.js';
import { ErrorHandler } from './core/utils/ErrorHandler.js';

export class App {
    constructor() {
        this.router = null;
        this.setupErrorHandling();
        this.setupEventListeners();
    }

    async initialize() {
        try {
            // Initialize API layer
            const apiInitialized = await Api.initialize();
            if (!apiInitialized) {
                throw new Error('API initialization failed');
            }

            // Initialize router after API is ready
            this.router = new Router();
            window.router = this.router; // For global access

            // Start the application
            this.router.navigate();

            return true;
        } catch (error) {
            ErrorHandler.handle(error);
            return false;
        }
    }

    setupErrorHandling() {
        window.onerror = (msg, url, line, col, error) => {
            ErrorHandler.handle(error || new Error(msg));
        };

        window.onunhandledrejection = (event) => {
            ErrorHandler.handle(event.reason);
        };
    }

    setupEventListeners() {
        // Handle authentication events
        eventBus.subscribe('auth:unauthorized', () => {
            this.handleUnauthorized();
        });

        eventBus.subscribe('auth:session-expired', () => {
            this.handleSessionExpired();
        });

        // Handle API errors
        eventBus.subscribe('error', (error) => {
            this.handleError(error);
        });
    }

    handleUnauthorized() {
        window.toasts?.show('Please log in to continue', 'error');
        this.router?.push('/login');
    }

    handleSessionExpired() {
        window.toasts?.show('Your session has expired. Please log in again.', 'warning');
        this.router?.push('/login');
    }

    handleError(error) {
        // Handle different types of errors appropriately
        switch (error.code) {
            case 'NETWORK_ERROR':
                window.toasts?.show('Network error. Please check your connection.', 'error');
                break;
            case 'SERVER_ERROR':
                window.toasts?.show('Server error. Please try again later.', 'error');
                break;
            default:
                window.toasts?.show(error.message || 'An error occurred', 'error');
        }
    }
}
