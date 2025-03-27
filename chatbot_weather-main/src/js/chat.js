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

    handleUserInput() {
        const text = this.userInput.value.trim();
        if (text && !this.isProcessing) {
            this.isProcessing = true;
            this.addMessage(text, true);
            this.clearInput();
            this.processUserInput(text);
        }
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
        messageDiv.className = message ${isUser ? 'user-message' : 'bot-message'};

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

    processUserInput(text) {
        // Disable input during processing
        this.setInputState(false);

        // Simple response delay for natural feel
        setTimeout(() => {
            this.addMessage('I received your message: ' + text, false);

            // Re-enable input
            this.setInputState(true);
            this.isProcessing = false;
        }, 500);
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
            this.addMessage('Welcome! I\'m here to assist you. How can I help?', false);
        }, 500);
    }
}

// Initialize chat
const chatManager = new ChatManager();

// Export for other modules
window.chatManager = chatManager; +