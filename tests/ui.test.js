// UI Manager Tests
// Author: Joy Lee
// Description: Tests for UI functionality

describe('UIManager', () => {
    let uiManager;

    beforeEach(() => {
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="chat-container">
                <div id="messages"></div>
                <div id="input-container">
                    <textarea id="user-input"></textarea>
                    <button id="send-button"></button>
                </div>
                <button id="theme-toggle"></button>
            </div>
        `;

        uiManager = new UIManager();
    });

    test('should initialize with correct elements', () => {
        expect(uiManager.chatContainer).toBeTruthy();
        expect(uiManager.messagesContainer).toBeTruthy();
        expect(uiManager.userInput).toBeTruthy();
        expect(uiManager.sendButton).toBeTruthy();
        expect(uiManager.themeToggle).toBeTruthy();
    });

    test('should handle input changes', () => {
        const input = document.getElementById('user-input');
        input.value = 'Hello';
        
        uiManager.handleInputChange();
        expect(input.style.height).toBeTruthy();
        expect(uiManager.sendButton.disabled).toBe(false);
    });

    test('should handle empty input', () => {
        const input = document.getElementById('user-input');
        input.value = '';
        
        uiManager.handleInputChange();
        expect(uiManager.sendButton.disabled).toBe(true);
    });

    test('should handle key press events', () => {
        const input = document.getElementById('user-input');
        input.value = 'Hello';
        
        const event = new KeyboardEvent('keypress', {
            key: 'Enter',
            shiftKey: false
        });
        
        uiManager.handleKeyPress(event);
        expect(input.value).toBe('');
    });

    test('should handle send button click', () => {
        const input = document.getElementById('user-input');
        input.value = 'Hello';
        
        uiManager.handleSendClick();
        expect(input.value).toBe('');
    });

    test('should toggle theme', () => {
        const initialTheme = document.body.getAttribute('data-theme');
        uiManager.toggleTheme();
        const newTheme = document.body.getAttribute('data-theme');
        
        expect(newTheme).not.toBe(initialTheme);
        expect(localStorage.getItem('theme')).toBe(newTheme);
    });

    test('should add messages with correct styling', () => {
        uiManager.addMessage('Test message', true);
        const message = document.querySelector('.message');
        
        expect(message).toBeTruthy();
        expect(message.classList.contains('user-message')).toBe(true);
        expect(message.querySelector('.message-content')).toBeTruthy();
        expect(message.querySelector('.message-timestamp')).toBeTruthy();
    });

    test('should scroll to bottom after adding message', () => {
        const container = document.getElementById('messages');
        const initialScroll = container.scrollTop;
        
        uiManager.addMessage('Test message', false);
        expect(container.scrollTop).toBeGreaterThan(initialScroll);
    });

    test('should handle window resize', () => {
        const container = document.getElementById('chat-container');
        const inputContainer = document.getElementById('input-container');
        
        // Mock mobile view
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 600
        });
        
        uiManager.handleResize();
        expect(container.classList.contains('mobile-layout')).toBe(true);
        expect(inputContainer.classList.contains('mobile-input')).toBe(true);
    });

    test('should show and hide loading indicator', () => {
        uiManager.showLoading();
        expect(document.querySelector('.loading-indicator')).toBeTruthy();
        
        uiManager.hideLoading();
        expect(document.querySelector('.loading-indicator')).toBeFalsy();
    });

    test('should show error message', () => {
        uiManager.showError('Test error');
        const errorContainer = document.querySelector('.error-container');
        
        expect(errorContainer.classList.contains('show')).toBe(true);
        expect(errorContainer.textContent).toBe('Test error');
    });

    test('should setup accessibility features', () => {
        expect(uiManager.userInput.getAttribute('aria-label')).toBe('Message input');
        expect(uiManager.sendButton.getAttribute('aria-label')).toBe('Send message');
        expect(uiManager.themeToggle.getAttribute('aria-label')).toBe('Toggle theme');
    });
});

describe('Suggestion functionality', () => {
    let uiManager;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="chat-container">
                <div id="messages"></div>
                <div id="suggestions-container"></div>
                <div id="input-container">
                    <textarea id="user-input"></textarea>
                    <button id="send-button"></button>
                </div>
            </div>
        `;
        uiManager = new UIManager();
    });

    test('should extract suggestions from bot messages', () => {
        const locationText = 'Please add a location to your trip.';
        const weatherText = 'Here is the weather forecast.';
        const planText = 'Let\'s start planning your trip.';
        const clothingText = 'Here are clothing suggestions.';

        expect(uiManager.extractSuggestions(locationText)).toContain('Add London');
        expect(uiManager.extractSuggestions(weatherText)).toContain('Check weather');
        expect(uiManager.extractSuggestions(planText)).toContain('Start planning');
        expect(uiManager.extractSuggestions(clothingText)).toContain('Summer clothes');
    });

    test('should show suggestions when bot message contains triggers', () => {
        uiManager.addMessage('Please add a location to your trip.', false);
        const suggestions = document.querySelectorAll('.suggestion-bubble');
        expect(suggestions.length).toBeGreaterThan(0);
    });

    test('should handle suggestion click', () => {
        uiManager.showSuggestions(['Test suggestion']);
        const suggestion = document.querySelector('.suggestion-bubble');
        suggestion.click();
        
        expect(uiManager.userInput.value).toBe('Test suggestion');
        expect(document.querySelectorAll('.suggestion-bubble').length).toBe(0);
    });

    test('should handle keyboard navigation for suggestions', () => {
        uiManager.showSuggestions(['Test suggestion']);
        const suggestion = document.querySelector('.suggestion-bubble');
        
        suggestion.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
        expect(uiManager.userInput.value).toBe('Test suggestion');
    });

    test('should clear suggestions', () => {
        uiManager.showSuggestions(['Test suggestion']);
        expect(document.querySelectorAll('.suggestion-bubble').length).toBe(1);
        
        uiManager.clearSuggestions();
        expect(document.querySelectorAll('.suggestion-bubble').length).toBe(0);
    });

    test('should add ARIA attributes to suggestions', () => {
        uiManager.showSuggestions(['Test suggestion']);
        const suggestion = document.querySelector('.suggestion-bubble');
        
        expect(suggestion.getAttribute('role')).toBe('button');
        expect(suggestion.getAttribute('tabindex')).toBe('0');
    });
}); 