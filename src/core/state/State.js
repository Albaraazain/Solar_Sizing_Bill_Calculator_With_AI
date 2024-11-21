// src/core/state/State.js

import { eventBus } from '../events/EventBus';

class State {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = new Map();
    }

    setState(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;

        // Publish state change event
        eventBus.publish('state:change', {
            key,
            oldValue,
            newValue: value
        });

        // Call specific key listeners
        if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(listener => {
                listener(value, oldValue);
            });
        }
    }

    getState(key) {
        return this.state[key];
    }

    // Watch specific key changes
    watch(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);

        return () => {
            if (this.listeners.has(key)) {
                this.listeners.get(key).delete(callback);
            }
        };
    }

    // For testing and cleanup
    clearState() {
        this.state = {};
        this.listeners.clear();
    }
}

// Create initial application state structure
const initialState = {
    user: null,
    billData: null,
    quoteData: null,
    ui: {
        loading: false,
        error: null,
        currentRoute: '/'
    }
};

export const appState = new State(initialState);
