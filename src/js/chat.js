// Core Chat Implementation
// Version: 1.0.0

class ChatManager {
    constructor() {
        // DOM Elements
        this.messagesContainer = document.getElementById('messages');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');

        // Chat State
        this.isProcessing = false;
        this.messageHistory = [];
        this.maxMessages = 50;
        this.currentState = 'initial'; // initial, collecting_locations, planning

        // Initialize services
        this.weatherService = window.weatherService;
        this.tripPlanner = window.tripPlanner;

        // Bind event listeners
        this.initializeEventListeners();
        this.displayWelcomeMessage();
    }

    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleUserInput();
        });

        // Enter key press
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserInput();
            }
        });

        // Input focus management
        this.userInput.addEventListener('focus', () => this.handleInputFocus(true));
        this.userInput.addEventListener('blur', () => this.handleInputFocus(false));

        // Auto-focus input on page load
        this.userInput.focus();
    }

    async handleUserInput() {
        const text = this.userInput.value.trim();
        if (text && !this.isProcessing) {
            this.isProcessing = true;
            this.addMessage(text, true);
            this.clearInput();
            await this.processUserInput(text);
        }
    }

    async processUserInput(text) {
        try {
            switch (this.currentState) {
                case 'initial':
                    await this.handleInitialState(text);
                    break;
                case 'collecting_locations':
                    await this.handleLocationCollection(text);
                    break;
                case 'planning':
                    await this.handlePlanning(text);
                    break;
            }
        } catch (error) {
            this.addMessage('I apologize, but I encountered an error. Please try again.', false);
            console.error('Error processing input:', error);
        } finally {
            this.isProcessing = false;
            this.setInputState(true);
        }
    }

    async handleInitialState(text) {
        if (text.toLowerCase().includes('plan trip') || text.toLowerCase().includes('help')) {
            this.currentState = 'collecting_locations';
            this.addMessage('I\'ll help you plan your trip! Please enter the first location you want to visit.', false);
        } else {
            this.addMessage('I can help you plan your trip. Just say "plan trip" or "help" to get started!', false);
        }
    }

    async handleLocationCollection(text) {
        const locations = this.tripPlanner.getLocations();
        
        if (text.toLowerCase() === 'done' && locations.length > 0) {
            this.currentState = 'planning';
            await this.generateTripPlan();
        } else if (this.tripPlanner.addLocation(text)) {
            const remaining = 5 - locations.length;
            const message = remaining > 0 
                ? `Great! ${text} has been added. You can add ${remaining} more location(s) or type "done" to finish.`
                : 'Great! Type "done" to finish.';
            this.addMessage(message, false);
        } else {
            this.addMessage('Sorry, you can only add up to 5 locations. Type "done" to proceed with planning.', false);
        }
    }

    async handlePlanning(text) {
        if (text.toLowerCase() === 'restart') {
            this.tripPlanner = new TripPlanner();
            this.currentState = 'initial';
            this.addMessage('Let\'s start over! How can I help you?', false);
        } else {
            this.addMessage('Type "restart" to plan a new trip or ask specific questions about the current plan.', false);
        }
    }

    async generateTripPlan() {
        const plan = this.tripPlanner.generateTripPlan();
        if (!plan) {
            this.addMessage('Sorry, I couldn\'t generate a plan. Let\'s try again!', false);
            return;
        }

        let response = 'Here\'s your trip plan:\n\n';
        
        for (const day of plan.schedule) {
            response += `Day ${day.day}:\n`;
            for (const location of day.locations) {
                try {
                    const weather = await this.weatherService.getWeatherData(location);
                    const suggestions = this.weatherService.getClothingSuggestion(weather);
                    
                    response += `- ${location}: ${weather.temperature}°C, ${weather.condition}\n`;
                    response += `  Suggested clothing: ${suggestions.join(', ')}\n`;
                } catch (error) {
                    response += `- ${location}: Weather data unavailable\n`;
                }
            }
            response += '\n';
        }

        this.addMessage(response, false);
    }

    addMessage(text, isUser = false) {
        // Create message element
        const messageElement = this.createMessageElement(text, isUser);

        // Add to DOM with animation
        this.animateMessage(messageElement);

        // Store in history
        this.messageHistory.push({
            text,
            isUser,
            timestamp: new Date()
        });

        // Maintain message limit
        this.maintainMessageLimit();
    }

    createMessageElement(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        const textContent = document.createElement('div');
        textContent.className = 'message-content';
        textContent.textContent = text;

        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = this.formatTime(new Date());

        messageDiv.appendChild(textContent);
        messageDiv.appendChild(timestamp);

        return messageDiv;
    }

    animateMessage(messageElement) {
        // Initial state
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        this.messagesContainer.appendChild(messageElement);

        // Trigger animation
        requestAnimationFrame(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        });

        // Scroll into view
        this.scrollToBottom();
    }

    scrollToBottom() {
        requestAnimationFrame(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        });
    }

    clearInput() {
        this.userInput.value = '';
        this.userInput.style.height = 'auto';
    }

    handleInputFocus(isFocused) {
        this.userInput.classList.toggle('focused', isFocused);
        if (isFocused) {
            this.scrollToBottom();
        }
    }

    setInputState(enabled) {
        this.userInput.disabled = !enabled;
        this.sendButton.disabled = !enabled;
        if (enabled) {
            this.userInput.focus();
        }
    }

    maintainMessageLimit() {
        while (this.messageHistory.length > this.maxMessages) {
            this.messageHistory.shift();
            if (this.messagesContainer.firstChild) {
                this.messagesContainer.removeChild(this.messagesContainer.firstChild);
            }
        }
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    displayWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('Welcome! I\'m your travel weather assistant. I can help you plan your clothing for a trip to multiple locations. Just say "plan trip" or "help" to get started!', false);
        }, 500);
    }
}

// Initialize chat
const chatManager = new ChatManager();

// Export for other modules
window.chatManager = chatManager; 