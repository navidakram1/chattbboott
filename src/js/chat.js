// Core Chat Implementation
// Version: 1.1.0
// Author: Benny Joy
// Description: Enhanced chat logic with improved conversation handling

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
        this.currentState = 'initial';
        this.context = {
            currentLocation: null,
            dateRange: null,
            preferences: {
                temperature: null,
                activities: []
            }
        };

        // Initialize services
        this.weatherService = window.weatherService;
        this.tripPlanner = window.tripPlanner;

        // Command patterns
        this.commands = {
            help: ['help', 'guide', 'instructions', 'what can you do'],
            planTrip: ['plan trip', 'plan a trip', 'start planning', 'new trip'],
            restart: ['restart', 'start over', 'begin again', 'reset'],
            undo: ['undo', 'go back', 'remove last'],
            showSummary: ['show summary', 'summary', 'review plan'],
            done: ['done', 'finish', 'complete', 'that\'s all']
        };

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

        // Add input auto-resize
        this.userInput.addEventListener('input', () => {
            this.autoResizeInput();
        });
    }

    autoResizeInput() {
        this.userInput.style.height = 'auto';
        this.userInput.style.height = (this.userInput.scrollHeight) + 'px';
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
            const command = this.findCommand(text.toLowerCase());
            
            if (command) {
                await this.handleCommand(command, text);
            } else {
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
            }
        } catch (error) {
            this.addMessage('I apologize, but I encountered an error. Please try again.', false);
            console.error('Error processing input:', error);
        } finally {
            this.isProcessing = false;
            this.setInputState(true);
        }
    }

    findCommand(text) {
        for (const [command, patterns] of Object.entries(this.commands)) {
            if (patterns.some(pattern => text.includes(pattern))) {
                return command;
            }
        }
        return null;
    }

    async handleCommand(command, text) {
        switch (command) {
            case 'help':
                this.showHelp();
                break;
            case 'planTrip':
                this.startNewTrip();
                break;
            case 'restart':
                this.restartPlanning();
                break;
            case 'undo':
                this.undoLastAction();
                break;
            case 'showSummary':
                await this.showTripSummary();
                break;
            case 'done':
                await this.finalizePlan();
                break;
        }
    }

    showHelp() {
        const helpMessage = `
I can help you plan your trip and suggest appropriate clothing based on weather conditions. Here's what you can do:

1. Start planning: Say "plan trip" to begin
2. Add locations: Enter up to 5 locations you want to visit
3. Review plan: Say "show summary" to see your current plan
4. Start over: Say "restart" to begin again
5. Undo: Say "go back" to undo your last action
6. Finish: Say "done" when you're finished adding locations

Need more help? Just ask!`;
        
        this.addMessage(helpMessage, false);
    }

    startNewTrip() {
        this.currentState = 'collecting_locations';
        this.context = {
            currentLocation: null,
            dateRange: null,
            preferences: {
                temperature: null,
                activities: []
            }
        };
        this.tripPlanner = new TripPlanner();
        this.addMessage('Let\'s plan your trip! Please enter the first location you want to visit.', false);
    }

    restartPlanning() {
        this.startNewTrip();
    }

    undoLastAction() {
        if (this.currentState === 'collecting_locations') {
            const locations = this.tripPlanner.getLocations();
            if (locations.length > 0) {
                const removed = locations[locations.length - 1];
                this.tripPlanner.removeLocation(removed);
                this.addMessage(`Removed ${removed} from your trip. You can add another location or type "done" to finish.`, false);
            } else {
                this.addMessage('Nothing to undo. Please enter a location or type "help" for assistance.', false);
            }
        }
    }

    async showTripSummary() {
        const plan = this.tripPlanner.generateTripPlan();
        if (!plan) {
            this.addMessage('No trip plan available yet. Start by adding some locations!', false);
            return;
        }

        let summary = 'Current Trip Plan:\n\n';
        
        for (const day of plan.schedule) {
            summary += `Day ${day.day}:\n`;
            for (const location of day.locations) {
                try {
                    const weather = await this.weatherService.getWeatherData(location);
                    const weatherSummary = this.weatherService.getWeatherSummary(weather);
                    
                    summary += `\n📍 ${location}:\n`;
                    summary += `• ${weatherSummary.general}\n`;
                    summary += `• ${weatherSummary.temperature}\n`;
                    summary += `• ${weatherSummary.conditions}\n`;
                    
                    const suggestions = this.weatherService.getClothingSuggestion(weather);
                    summary += `\n👔 Suggested Clothing:\n`;
                    suggestions.forEach(item => summary += `• ${item}\n`);
                    summary += '\n';
                } catch (error) {
                    summary += `\n📍 ${location}: Weather data unavailable\n\n`;
                }
            }
            summary += '-------------------\n';
        }

        this.addMessage(summary, false);
    }

    async finalizePlan() {
        if (this.currentState === 'collecting_locations') {
            const locations = this.tripPlanner.getLocations();
            if (locations.length > 0) {
                this.currentState = 'planning';
                await this.generateTripPlan();
            } else {
                this.addMessage('Please add at least one location before finalizing the plan.', false);
            }
        }
    }

    async handleLocationCollection(text) {
        const locations = this.tripPlanner.getLocations();
        
        if (text.toLowerCase() === 'done' && locations.length > 0) {
            await this.finalizePlan();
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

    async handleInitialState(text) {
        if (text.toLowerCase().includes('plan trip') || text.toLowerCase().includes('help')) {
            this.currentState = 'collecting_locations';
            this.addMessage('I\'ll help you plan your trip! Please enter the first location you want to visit.', false);
        } else {
            this.addMessage('I can help you plan your trip. Just say "plan trip" or "help" to get started!', false);
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