// UI Implementation
// Version: 1.0.0

class UIManager {
    constructor() {
        this.initializeTheme();
        this.setupUIComponents();
        this.initializeAnimations();
    }

    initializeTheme() {
        // Theme configuration
        this.theme = {
            colors: {
                primary: '#007bff',
                secondary: '#f8f9fa',
                text: '#343a40',
                background: '#ffffff',
                accent: '#0056b3'
            },
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px'
            },
            animation: {
                duration: '0.3s',
                easing: 'ease'
            }
        };

        this.applyTheme();
    }

    setupUIComponents() {
        // Initialize UI components
        this.chatContainer = document.getElementById('chat-container');
        this.messagesContainer = document.getElementById('messages');
        this.inputContainer = document.getElementById('input-container');

        // Add loading indicator
        this.createLoadingIndicator();

        // Add typing indicator
        this.createTypingIndicator();

        // Add emoji picker button
        this.createEmojiPicker();

        // Add sound toggle
        this.createSoundToggle();
    }

    createLoadingIndicator() {
        const loader = document.createElement('div');
        loader.className = 'loading-indicator hidden';
        loader.innerHTML = `
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        `;
        this.chatContainer.appendChild(loader);
        this.loadingIndicator = loader;
    }

    createTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator hidden';
        typing.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        this.messagesContainer.appendChild(typing);
        this.typingIndicator = typing;
    }

    createEmojiPicker() {
        const emojiButton = document.createElement('button');
        emojiButton.className = 'emoji-button';
        emojiButton.innerHTML = '😊';
        emojiButton.setAttribute('aria-label', 'Open emoji picker');
        this.inputContainer.insertBefore(emojiButton, this.inputContainer.firstChild);
    }

    createSoundToggle() {
        const soundButton = document.createElement('button');
        soundButton.className = 'sound-toggle';
        soundButton.innerHTML = '🔊';
        soundButton.setAttribute('aria-label', 'Toggle sound');
        this.inputContainer.insertBefore(soundButton, this.inputContainer.firstChild);
    }

    initializeAnimations() {
        // Add intersection observer for message animations
        this.setupScrollAnimations();

        // Add input animations
        this.setupInputAnimations();
    }

    setupScrollAnimations() {
        const options = {
            root: this.messagesContainer,
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);
    }

    setupInputAnimations() {
        const input = document.getElementById('user-input');
        input.addEventListener('input', () => {
            this.autoResizeInput(input);
        });
    }

    autoResizeInput(input) {
        input.style.height = 'auto';
        input.style.height = (input.scrollHeight) + 'px';
    }

    showLoading() {
        this.loadingIndicator.classList.remove('hidden');
    }

    hideLoading() {
        this.loadingIndicator.classList.add('hidden');
    }

    showTyping() {
        this.typingIndicator.classList.remove('hidden');
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.classList.add('hidden');
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    applyTheme() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --primary-color: ${this.theme.colors.primary};
                --secondary-color: ${this.theme.colors.secondary};
                --text-color: ${this.theme.colors.text};
                --background-color: ${this.theme.colors.background};
                --accent-color: ${this.theme.colors.accent};

                --spacing-xs: ${this.theme.spacing.xs};
                --spacing-sm: ${this.theme.spacing.sm};
                --spacing-md: ${this.theme.spacing.md};
                --spacing-lg: ${this.theme.spacing.lg};
                --spacing-xl: ${this.theme.spacing.xl};

                --animation-duration: ${this.theme.animation.duration};
                --animation-easing: ${this.theme.animation.easing};
            }

            .loading-indicator {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                transition: opacity 0.3s ease;
            }

            .loading-indicator.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .spinner > div {
                width: 12px;
                height: 12px;
                background-color: var(--primary-color);
                border-radius: 100%;
                display: inline-block;
                animation: bounce 1.4s infinite ease-in-out both;
            }

            .spinner .bounce1 {
                animation-delay: -0.32s;
            }

            .spinner .bounce2 {
                animation-delay: -0.16s;
            }

            @keyframes bounce {
                0%, 80%, 100% { transform: scale(0); }
                40% { transform: scale(1.0); }
            }

            .typing-indicator {
                background-color: var(--secondary-color);
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: 15px;
                display: inline-flex;
                align-items: center;
                margin: var(--spacing-sm) 0;
                transition: opacity 0.3s ease;
            }

            .typing-indicator.hidden {
                opacity: 0;
                pointer-events: none;
            }

            .typing-indicator span {
                width: 8px;
                height: 8px;
                background-color: var(--text-color);
                border-radius: 50%;
                margin: 0 2px;
                opacity: 0.4;
                animation: typing 1s infinite ease-in-out;
            }

            .typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-5px); }
            }

            .emoji-button, .sound-toggle {
                background: none;
                border: none;
                font-size: 1.5rem;
                padding: var(--spacing-xs);
                cursor: pointer;
                transition: transform var(--animation-duration) var(--animation-easing);
            }

            .emoji-button:hover, .sound-toggle:hover {
                transform: scale(1.1);
            }

            .message {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity var(--animation-duration) var(--animation-easing),
                            transform var(--animation-duration) var(--animation-easing);
            }

            .message.visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize UI
const uiManager = new UIManager();

// Export for other modules
window.uiManager = uiManager;