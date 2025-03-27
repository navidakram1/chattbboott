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
        this.weatherManager = new WeatherManager();
        this.tripManager = new TripManager();
        this.locationConfirmations = new Map();

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
            await this.processMessage(text);
        }
    }

    async processMessage(message) {
        message = message.trim().toLowerCase();
        
        try {
            switch (this.currentState) {
                case 'initial':
                    return this.handleInitialState(message);
                case 'collecting_locations':
                    return this.handleLocationCollection(message);
                case 'confirming_location':
                    return this.handleLocationConfirmation(message);
                case 'weather_details':
                    return this.handleWeatherDetails(message);
                case 'clothing_suggestions':
                    return this.handleClothingSuggestions(message);
                case 'trip_planning':
                    return this.handleTripPlanning(message);
                default:
                    return this.handleGeneralInput(message);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            return 'I apologize, but I encountered an error. Please try again.';
        }
    }

    async handleInitialState(message) {
        if (message.includes('help') || message.includes('start')) {
            this.currentState = 'collecting_locations';
            return `I'll help you plan your trip! Please tell me the first location you'd like to visit.
You can add up to 5 locations, and I'll help you plan appropriate clothing based on the weather.`;
        }
        
        if (this.isLocationInput(message)) {
            this.currentState = 'collecting_locations';
            return this.handleLocationCollection(message);
        }
        
        return `Welcome! I can help you plan your trip and suggest appropriate clothing based on the weather.
Would you like to start planning your trip? Just say "help" or "start", or directly enter your first destination.`;
    }

    async handleLocationCollection(message) {
        if (message.includes('done') || message.includes('finish')) {
            if (window.uiManager.locations.size === 0) {
                return "You haven't added any locations yet. Please tell me where you'd like to go.";
            }
            this.currentState = 'weather_details';
            return this.generateWeatherSummary();
        }

        if (this.isLocationInput(message)) {
            this.locationConfirmations.set(message, null);
            this.currentState = 'confirming_location';
            return `I found ${message}. The current weather there is ${this.weatherManager.getWeatherData(message).description} with a temperature of ${this.weatherManager.getWeatherData(message).temperature}°C.
Is this the location you meant? (Yes/No)`;
        }

        return "Please tell me a location you'd like to visit, or say 'done' if you've finished adding locations.";
    }

    handleLocationConfirmation(message) {
        if (message.includes('yes') || message.includes('correct')) {
            const weatherData = this.locationConfirmations.get(this.locationConfirmations.keys().next().value);
            if (window.uiManager.addLocation(this.locationConfirmations.keys().next().value)) {
                this.currentState = 'collecting_locations';
                const remainingSlots = 5 - window.uiManager.locations.size;
                return remainingSlots > 0
                    ? `Great! I've added ${this.locationConfirmations.keys().next().value}. You can add ${remainingSlots} more location${remainingSlots > 1 ? 's' : ''}. Where else would you like to go?`
                    : "Perfect! You've added all 5 locations. Let me get the weather details for your trip.";
            }
            return "You've reached the maximum number of locations. Let's proceed with weather analysis.";
        }
        
        if (message.includes('no') || message.includes('wrong')) {
            this.currentState = 'collecting_locations';
            return "No problem. Please try entering the location again, perhaps with more specific details.";
        }

        return "Please confirm if this is the correct location with 'yes' or 'no'.";
    }

    async handleWeatherDetails(message) {
        if (message.includes('clothing') || message.includes('wear')) {
            this.currentState = 'clothing_suggestions';
            return this.generateClothingSuggestions();
        }

        if (message.includes('plan') || message.includes('itinerary')) {
            this.currentState = 'trip_planning';
            return this.tripManager.generateItinerary(Array.from(window.uiManager.locations));
        }

        if (message.includes('temperature') || message.includes('weather')) {
            return this.generateWeatherSummary();
        }

        return `Here's what you can do next:
1. Ask about clothing suggestions
2. Get detailed weather information
3. Plan your trip itinerary
What would you like to know more about?`;
    }

    async generateWeatherSummary() {
        const summaries = [];
        for (const location of window.uiManager.locations) {
            try {
                const weather = await this.weatherManager.getWeatherData(location);
                summaries.push(`${location}: ${weather.description}, ${weather.temperature}°C`);
            } catch (error) {
                summaries.push(`${location}: Weather data unavailable`);
            }
        }
        
        return `Here's the weather summary for your destinations:
${summaries.join('\n')}

Would you like to:
1. Get clothing suggestions
2. Plan your trip itinerary
3. See more weather details`;
    }

    async generateClothingSuggestions() {
        const suggestions = [];
        for (const location of window.uiManager.locations) {
            try {
                const weather = await this.weatherManager.getWeatherData(location);
                const clothing = this.getClothingForWeather(weather);
                suggestions.push(`${location}:
- ${clothing.join('\n- ')}`);
            } catch (error) {
                suggestions.push(`${location}: Unable to generate clothing suggestions`);
            }
        }
        
        return `Here are your clothing suggestions:
${suggestions.join('\n\n')}

Would you like to:
1. See the weather details again
2. Plan your trip itinerary
3. Add or remove locations`;
    }

    getClothingForWeather(weather) {
        const temp = weather.temperature;
        const conditions = weather.description.toLowerCase();
        const suggestions = [];

        // Temperature-based suggestions
        if (temp > 25) {
            suggestions.push('Light, breathable clothing');
            suggestions.push('Sun hat');
            suggestions.push('Sunglasses');
        } else if (temp > 15) {
            suggestions.push('Light layers');
            suggestions.push('Light jacket or sweater');
        } else if (temp > 5) {
            suggestions.push('Warm layers');
            suggestions.push('Medium-weight jacket');
            suggestions.push('Long pants');
        } else {
            suggestions.push('Heavy winter coat');
            suggestions.push('Thermal layers');
            suggestions.push('Winter accessories (hat, gloves, scarf)');
        }

        // Weather condition based suggestions
        if (conditions.includes('rain')) {
            suggestions.push('Waterproof jacket');
            suggestions.push('Waterproof shoes');
            suggestions.push('Umbrella');
        } else if (conditions.includes('snow')) {
            suggestions.push('Snow boots');
            suggestions.push('Waterproof pants');
        } else if (conditions.includes('wind')) {
            suggestions.push('Windbreaker');
        } else if (conditions.includes('sun') || conditions.includes('clear')) {
            suggestions.push('Sunscreen');
        }

        return suggestions;
    }

    handleTripPlanning(message) {
        if (message.includes('weather')) {
            this.currentState = 'weather_details';
            return this.generateWeatherSummary();
        }

        if (message.includes('clothing')) {
            this.currentState = 'clothing_suggestions';
            return this.generateClothingSuggestions();
        }

        return this.tripManager.handleTripCommand(message);
    }

    handleGeneralInput(message) {
        if (message.includes('help')) {
            return `I can help you with:
1. Planning your trip itinerary
2. Checking weather conditions
3. Suggesting appropriate clothing
4. Managing your locations

What would you like to do?`;
        }

        if (this.isLocationInput(message)) {
            this.currentState = 'collecting_locations';
            return this.handleLocationCollection(message);
        }

        return "I'm not sure what you'd like to do. Try asking for 'help' to see what I can do.";
    }

    isLocationInput(message) {
        // Simple location validation - can be enhanced with more sophisticated checks
        return message.length > 2 && 
               !message.includes('help') && 
               !message.includes('yes') && 
               !message.includes('no');
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