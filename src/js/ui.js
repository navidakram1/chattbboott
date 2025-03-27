// UI Implementation
// Version: 1.1.0
// Author: Joy Lee
// Description: Enhanced UI with modern design and responsive features

class UIManager {
    constructor() {
        this.messagesContainer = document.getElementById('messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.clearButton = document.getElementById('clear-button');
        this.themeToggle = document.getElementById('theme-toggle');
        this.suggestionsContainer = document.getElementById('suggestions-container');
        this.locationList = document.getElementById('location-list');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.errorToast = document.getElementById('error-toast');
        this.charCount = document.getElementById('char-count');
        this.progressSteps = document.querySelectorAll('.progress-step');
        
        this.currentStep = 1;
        this.maxLocations = 5;
        this.locations = new Set();
        
        this.initializeEventListeners();
        this.initializeTheme();
        this.showWelcomeMessage();
    }

    initializeEventListeners() {
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Input handling
        this.userInput.addEventListener('input', () => {
            this.updateCharCount();
            this.adjustTextareaHeight();
        });
        this.userInput.addEventListener('keydown', (e) => this.handleInputKeydown(e));
        
        // Button clicks
        this.sendButton.addEventListener('click', () => this.handleSend());
        this.clearButton.addEventListener('click', () => this.clearInput());

        // Suggestions container
        this.suggestionsContainer.addEventListener('click', (e) => this.handleSuggestionClick(e));
        
        // Location list
        this.locationList.addEventListener('click', (e) => this.handleLocationRemove(e));
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        this.themeToggle.querySelector('.material-icons').textContent = 
            savedTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }

    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.themeToggle.querySelector('.material-icons').textContent = 
            newTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }

    updateCharCount() {
        const length = this.userInput.value.length;
        this.charCount.textContent = `${length}/500`;
        this.sendButton.disabled = length === 0;
    }

    adjustTextareaHeight() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = `${Math.min(this.userInput.scrollHeight, 120)}px`;
    }

    handleInputKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSend();
        }
    }

    async handleSend() {
        const message = this.userInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.clearInput();
        this.clearSuggestions();

        try {
            this.showLoading();
            const response = await this.processUserInput(message);
            this.hideLoading();
            this.addMessage(response, 'bot');
        } catch (error) {
            this.hideLoading();
            this.showError('Sorry, there was an error processing your message.');
            console.error('Error:', error);
        }
    }

    clearInput() {
        this.userInput.value = '';
        this.updateCharCount();
        this.adjustTextareaHeight();
    }

    addMessage(content, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = content;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

        if (type === 'bot') {
            const suggestions = this.extractSuggestions(content);
            if (suggestions.length > 0) {
                this.showSuggestions(suggestions);
            }
        }
    }

    showSuggestions(suggestions) {
        this.clearSuggestions();
        suggestions.forEach((suggestion, index) => {
            const bubble = document.createElement('button');
            bubble.className = 'suggestion-bubble';
            bubble.textContent = suggestion;
            bubble.setAttribute('role', 'option');
            bubble.setAttribute('tabindex', '0');
            bubble.setAttribute('data-suggestion-index', index.toString());
            
            this.suggestionsContainer.appendChild(bubble);
        });
    }

    handleSuggestionClick(e) {
        const bubble = e.target.closest('.suggestion-bubble');
        if (!bubble) return;

        this.userInput.value = bubble.textContent;
        this.updateCharCount();
        this.adjustTextareaHeight();
        this.clearSuggestions();
    }

    clearSuggestions() {
        this.suggestionsContainer.innerHTML = '';
    }

    addLocation(location) {
        if (this.locations.size >= this.maxLocations) {
            this.showError('Maximum number of locations reached');
            return false;
        }

        if (this.locations.has(location)) {
            this.showError('This location is already added');
            return false;
        }

        this.locations.add(location);
        this.updateLocationList();
        this.updateProgress();
        return true;
    }

    updateLocationList() {
        this.locationList.innerHTML = '';
        this.locations.forEach(location => {
            const locationItem = document.createElement('div');
            locationItem.className = 'location-item';
            locationItem.innerHTML = `
                <span class="material-icons">place</span>
                ${location}
                <button class="icon-button" data-location="${location}" aria-label="Remove ${location}">
                    <span class="material-icons">close</span>
                </button>
            `;
            this.locationList.appendChild(locationItem);
        });
    }

    handleLocationRemove(e) {
        const removeButton = e.target.closest('[data-location]');
        if (!removeButton) return;

        const location = removeButton.dataset.location;
        this.locations.delete(location);
        this.updateLocationList();
        this.updateProgress();
    }

    updateProgress() {
        const progress = Math.min(Math.ceil((this.locations.size / this.maxLocations) * 3), 3);
        this.progressSteps.forEach((step, index) => {
            step.classList.toggle('active', index + 1 <= progress);
        });
    }

    showLoading() {
        this.loadingOverlay.setAttribute('aria-hidden', 'false');
    }

    hideLoading() {
        this.loadingOverlay.setAttribute('aria-hidden', 'true');
    }

    showError(message) {
        this.errorToast.textContent = message;
        this.errorToast.setAttribute('aria-hidden', 'false');
        setTimeout(() => {
            this.errorToast.setAttribute('aria-hidden', 'true');
        }, 3000);
    }

    showWelcomeMessage() {
        const welcomeMessage = `Welcome to the Travel Weather Assistant! 👋
I can help you plan your trip and suggest appropriate clothing based on the weather.
Where would you like to travel?`;
        this.addMessage(welcomeMessage, 'bot');
    }

    extractSuggestions(message) {
        const suggestions = [];
        
        // Location suggestions
        if (message.toLowerCase().includes('where would you like to travel')) {
            suggestions.push('London', 'Paris', 'New York', 'Tokyo', 'Sydney');
        }
        
        // Weather-related suggestions
        if (message.toLowerCase().includes('weather')) {
            suggestions.push('Show forecast', 'Temperature range', 'Precipitation chance');
        }
        
        // Trip planning suggestions
        if (message.toLowerCase().includes('plan')) {
            suggestions.push('Add location', 'Remove location', 'Show itinerary');
        }
        
        // Clothing suggestions
        if (message.toLowerCase().includes('clothing') || message.toLowerCase().includes('wear')) {
            suggestions.push('Summer clothes', 'Winter clothes', 'Rain gear');
        }
        
        return suggestions;
    }

    async processUserInput(message) {
        // This is a placeholder for the actual processing logic
        // In a real implementation, this would interact with the ChatBot class
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`I received your message: "${message}". How else can I help you?`);
            }, 1000);
        });
    }
}

// Initialize the UI manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.uiManager = new UIManager();
}); 