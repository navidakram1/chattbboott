// UI Manager Tests
// Author: [Team Member Name]
// Description: Test suite for UI functionality

describe('UIManager', () => {
    let uiManager;

    beforeEach(() => {
        // Set up DOM elements
        document.body.innerHTML = `
            <div id="messages"></div>
            <textarea id="user-input"></textarea>
            <button id="send-button"></button>
            <button id="clear-button"></button>
            <button id="theme-toggle">
                <span class="material-icons">dark_mode</span>
            </button>
            <div id="suggestions-container"></div>
            <div id="location-list"></div>
            <div id="loading-overlay"></div>
            <div id="error-toast"></div>
            <span id="char-count"></span>
            <div class="progress-step"></div>
        `;

        // Initialize UI Manager
        uiManager = new UIManager();
    });

    describe('Theme Management', () => {
        test('should initialize with saved theme', () => {
            localStorage.setItem('theme', 'dark');
            uiManager.initializeTheme();
            expect(document.body.getAttribute('data-theme')).toBe('dark');
        });

        test('should toggle theme', () => {
            const initialTheme = document.body.getAttribute('data-theme');
            uiManager.toggleTheme();
            expect(document.body.getAttribute('data-theme')).not.toBe(initialTheme);
        });
    });

    describe('Input Handling', () => {
        test('should update character count', () => {
            uiManager.userInput.value = 'Hello';
            uiManager.updateCharCount();
            expect(uiManager.charCount.textContent).toBe('5/500');
        });

        test('should adjust textarea height', () => {
            uiManager.userInput.value = 'Hello\nWorld\nTest';
            uiManager.adjustTextareaHeight();
            expect(uiManager.userInput.style.height).not.toBe('auto');
        });

        test('should handle Enter key press', () => {
            const mockEvent = { key: 'Enter', shiftKey: false, preventDefault: jest.fn() };
            uiManager.handleInputKeydown(mockEvent);
            expect(mockEvent.preventDefault).toHaveBeenCalled();
        });
    });

    describe('Message Display', () => {
        test('should add user message', () => {
            uiManager.addMessage('Hello', 'user');
            const message = document.querySelector('.user-message');
            expect(message.textContent).toBe('Hello');
        });

        test('should add bot message with suggestions', () => {
            uiManager.addMessage('Where would you like to travel?', 'bot');
            const suggestions = document.querySelectorAll('.suggestion-bubble');
            expect(suggestions.length).toBeGreaterThan(0);
        });
    });

    describe('Suggestion Management', () => {
        test('should show suggestions', () => {
            const suggestions = ['Option 1', 'Option 2'];
            uiManager.showSuggestions(suggestions);
            const bubbles = document.querySelectorAll('.suggestion-bubble');
            expect(bubbles.length).toBe(2);
        });

        test('should handle suggestion clicks', () => {
            uiManager.showSuggestions(['Test Suggestion']);
            const bubble = document.querySelector('.suggestion-bubble');
            bubble.click();
            expect(uiManager.userInput.value).toBe('Test Suggestion');
        });
    });

    describe('Location Management', () => {
        test('should add location', () => {
            const result = uiManager.addLocation('London');
            expect(result).toBe(true);
            expect(uiManager.locations.has('London')).toBe(true);
        });

        test('should prevent duplicate locations', () => {
            uiManager.addLocation('London');
            const result = uiManager.addLocation('London');
            expect(result).toBe(false);
        });

        test('should enforce maximum locations', () => {
            const locations = ['London', 'Paris', 'Tokyo', 'New York', 'Sydney', 'Berlin'];
            locations.forEach(location => uiManager.addLocation(location));
            expect(uiManager.locations.size).toBeLessThanOrEqual(5);
        });

        test('should remove location', () => {
            uiManager.addLocation('London');
            uiManager.updateLocationList();
            const removeButton = document.querySelector('[data-location="London"]');
            removeButton.click();
            expect(uiManager.locations.has('London')).toBe(false);
        });
    });

    describe('Progress Tracking', () => {
        test('should update progress based on locations', () => {
            uiManager.addLocation('London');
            uiManager.addLocation('Paris');
            const activeSteps = document.querySelectorAll('.progress-step.active');
            expect(activeSteps.length).toBeGreaterThan(0);
        });
    });

    describe('Loading and Error States', () => {
        test('should show loading overlay', () => {
            uiManager.showLoading();
            expect(uiManager.loadingOverlay.getAttribute('aria-hidden')).toBe('false');
        });

        test('should show and hide error toast', () => {
            jest.useFakeTimers();
            uiManager.showError('Test error');
            expect(uiManager.errorToast.textContent).toBe('Test error');
            expect(uiManager.errorToast.getAttribute('aria-hidden')).toBe('false');
            
            jest.advanceTimersByTime(3000);
            expect(uiManager.errorToast.getAttribute('aria-hidden')).toBe('true');
        });
    });

    describe('Welcome Message', () => {
        test('should show welcome message', () => {
            uiManager.showWelcomeMessage();
            const message = document.querySelector('.bot-message');
            expect(message.textContent).toContain('Welcome to the Travel Weather Assistant');
        });
    });

    describe('Suggestion Extraction', () => {
        test('should extract location suggestions', () => {
            const suggestions = uiManager.extractSuggestions('Where would you like to travel?');
            expect(suggestions).toContain('London');
            expect(suggestions).toContain('Paris');
        });

        test('should extract weather suggestions', () => {
            const suggestions = uiManager.extractSuggestions('Check the weather');
            expect(suggestions).toContain('Show forecast');
            expect(suggestions).toContain('Temperature range');
        });

        test('should extract clothing suggestions', () => {
            const suggestions = uiManager.extractSuggestions('What should I wear?');
            expect(suggestions).toContain('Summer clothes');
            expect(suggestions).toContain('Winter clothes');
        });
    });
}); 