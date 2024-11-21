// src/core/state/__tests__/State.test.js
const { appState } = require('../State');
const { eventBus } = require('../../events/EventBus');

describe('State Management', () => {
    beforeEach(() => {
        appState.clearState();
        eventBus.clear();
    });

    test('setState and getState', () => {
        appState.setState('testKey', 'testValue');
        expect(appState.getState('testKey')).toBe('testValue');
    });

    test('state change event emission', done => {
        eventBus.subscribe('state:change', ({ key, oldValue, newValue }) => {
            expect(key).toBe('testKey');
            expect(oldValue).toBeUndefined();
            expect(newValue).toBe('testValue');
            done();
        });

        appState.setState('testKey', 'testValue');
    });

    test('watch specific key changes', () => {
        const mockCallback = jest.fn();

        const unwatch = appState.watch('testKey', mockCallback);
        appState.setState('testKey', 'testValue');

        expect(mockCallback).toHaveBeenCalledWith('testValue', undefined);

        unwatch();
        appState.setState('testKey', 'newValue');
        expect(mockCallback).toHaveBeenCalledTimes(1);
    });
});
