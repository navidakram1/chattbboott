// UI Implementation
// Version: 1.1.0
// Author: Joy Lee
// Description: Enhanced UI with modern design and responsive features

class UIManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupThemeSupport();
        this.initializeAnimations();
    }

    initializeElements() {
        // Main containers
        this.chatContainer = document.getElementById('chat-container');
        this.messagesContainer = document.getElementById('messages');
        this.inputContainer = document.getElementById('input-container');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        this.themeToggle = document.getElementById('theme-toggle');
        
        // Loading and status indicators
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'loading-indicator';
        this.loadingIndicator.innerHTML = '<div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div>';
        
        // Error message container
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'error-container';
        
        // Accessibility features
        this.setupAccessibility();
    }

    setupEventListeners() {
        // Input handling
        this.userInput.addEventListener('input', () => this.handleInputChange());
        this.userInput.addEventListener('keypress', (e) => this.handleKeyPress(e));
        this.sendButton.addEventListener('click', () => this.handleSendClick());
        
        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Responsive design
        window.addEventListener('resize', () => this.handleResize());
        
        // Touch events for mobile
        this.setupTouchEvents();
    }

    setupThemeSupport() {
        // Theme management
        this.currentTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', this.currentTheme);
        
        // Color scheme preference
        this.setupColorSchemeListener();
    }

    setupColorSchemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener((e) => {
            if (!localStorage.getItem('theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                document.body.setAttribute('data-theme', this.currentTheme);
            }
        });
    }

    setupAccessibility() {
        // ARIA labels
        this.userInput.setAttribute('aria-label', 'Message input');
        this.sendButton.setAttribute('aria-label', 'Send message');
        this.themeToggle.setAttribute('aria-label', 'Toggle theme');
        
        // Focus management
        this.setupFocusTrap();
    }

    setupFocusTrap() {
        const focusableElements = this.chatContainer.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            this.chatContainer.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey && document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable.focus();
                    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
        }
    }

    setupTouchEvents() {
        let touchStartY = 0;
        this.messagesContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        this.messagesContainer.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const scrollTop = this.messagesContainer.scrollTop;
            
            if (scrollTop === 0 && touchY > touchStartY) {
                e.preventDefault(); // Prevent pull-to-refresh
            }
        });
    }

    handleInputChange() {
        // Auto-resize input
        this.userInput.style.height = 'auto';
        this.userInput.style.height = (this.userInput.scrollHeight) + 'px';
        
        // Enable/disable send button
        this.sendButton.disabled = !this.userInput.value.trim();
    }

    handleKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.handleSendClick();
        }
    }

    handleSendClick() {
        const message = this.userInput.value.trim();
        if (message) {
            this.addMessage(message, true);
            this.userInput.value = '';
            this.handleInputChange();
            
            // Notify chat manager
            if (window.chatManager) {
                window.chatManager.handleUserInput(message);
            }
        }
    }

    handleResize() {
        // Adjust UI for different screen sizes
        this.updateLayout();
        
        // Update scroll position
        this.scrollToBottom();
    }

    updateLayout() {
        const isMobile = window.innerWidth <= 768;
        this.chatContainer.classList.toggle('mobile-layout', isMobile);
        this.inputContainer.classList.toggle('mobile-input', isMobile);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    addMessage(text, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.textContent = text;
        
        const timestampElement = document.createElement('div');
        timestampElement.className = 'message-timestamp';
        timestampElement.textContent = new Date().toLocaleTimeString();
        
        messageElement.appendChild(contentElement);
        messageElement.appendChild(timestampElement);
        
        // Add animation class
        messageElement.classList.add('message-appear');
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    showLoading() {
        this.messagesContainer.appendChild(this.loadingIndicator);
        this.scrollToBottom();
    }

    hideLoading() {
        if (this.loadingIndicator.parentNode === this.messagesContainer) {
            this.messagesContainer.removeChild(this.loadingIndicator);
        }
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.classList.add('show');
        
        setTimeout(() => {
            this.errorContainer.classList.remove('show');
        }, 3000);
    }

    initializeAnimations() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            .message-appear {
                animation: messageAppear 0.3s ease-out;
            }
            
            @keyframes messageAppear {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .loading-indicator {
                text-align: center;
                margin: 10px;
            }
            
            .loading-indicator > div {
                width: 10px;
                height: 10px;
                background-color: var(--text-color);
                border-radius: 50%;
                display: inline-block;
                margin: 0 3px;
                animation: bounce 1.4s infinite ease-in-out both;
            }
            
            .loading-indicator .bounce1 {
                animation-delay: -0.32s;
            }
            
            .loading-indicator .bounce2 {
                animation-delay: -0.16s;
            }
            
            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1.0); }
            }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize UI
const uiManager = new UIManager();

// Export for other modules
window.uiManager = uiManager; 