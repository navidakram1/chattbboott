// Chat Manager Tests
// Author: [Team Member Name]
// Description: Test suite for chat functionality

describe('ChatManager', () => {
    let chatManager;
    let mockWeatherManager;
    let mockTripManager;

    beforeEach(() => {
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="messages"></div>
            <input id="user-input" />
            <button id="send-button"></button>
        `;

        // Mock WeatherManager
        mockWeatherManager = {
            getWeatherData: jest.fn().mockResolvedValue({
                temperature: 20,
                description: 'sunny'
            })
        };

        // Mock TripManager
        mockTripManager = {
            generateItinerary: jest.fn().mockReturnValue('Mock itinerary'),
            handleTripCommand: jest.fn()
        };

        chatManager = new ChatManager();
        chatManager.weatherManager = mockWeatherManager;
        chatManager.tripManager = mockTripManager;
    });

    describe('State Management', () => {
        test('should start in initial state', () => {
            expect(chatManager.currentState).toBe('initial');
        });

        test('should transition to collecting_locations on help command', async () => {
            const response = await chatManager.processMessage('help');
            expect(chatManager.currentState).toBe('collecting_locations');
            expect(response).toContain('help you plan your trip');
        });
    });

    describe('Location Management', () => {
        test('should handle location input', async () => {
            await chatManager.processMessage('London');
            expect(chatManager.currentState).toBe('confirming_location');
        });

        test('should prevent adding more than 5 locations', async () => {
            const locations = ['London', 'Paris', 'Tokyo', 'New York', 'Sydney', 'Berlin'];
            for (const location of locations) {
                await chatManager.processMessage(location);
                await chatManager.processMessage('yes');
            }
            expect(window.uiManager.locations.size).toBeLessThanOrEqual(5);
        });
    });

    describe('Weather Integration', () => {
        test('should fetch weather data for locations', async () => {
            await chatManager.processMessage('London');
            await chatManager.processMessage('yes');
            expect(mockWeatherManager.getWeatherData).toHaveBeenCalledWith('London');
        });

        test('should generate weather summary', async () => {
            chatManager.currentState = 'weather_details';
            window.uiManager.locations = new Set(['London']);
            const summary = await chatManager.generateWeatherSummary();
            expect(summary).toContain('London');
            expect(summary).toContain('sunny');
        });
    });

    describe('Clothing Suggestions', () => {
        test('should generate appropriate clothing suggestions', () => {
            const weather = { temperature: 25, description: 'sunny' };
            const suggestions = chatManager.getClothingForWeather(weather);
            expect(suggestions).toContain('Light, breathable clothing');
            expect(suggestions).toContain('Sun hat');
        });

        test('should handle different weather conditions', () => {
            const rainWeather = { temperature: 15, description: 'rain' };
            const suggestions = chatManager.getClothingForWeather(rainWeather);
            expect(suggestions).toContain('Waterproof jacket');
            expect(suggestions).toContain('Umbrella');
        });
    });

    describe('Trip Planning', () => {
        test('should generate trip itinerary', async () => {
            chatManager.currentState = 'trip_planning';
            window.uiManager.locations = new Set(['London', 'Paris']);
            await chatManager.handleTripPlanning('show itinerary');
            expect(mockTripManager.generateItinerary).toHaveBeenCalled();
        });
    });

    describe('Message Handling', () => {
        test('should handle user messages', () => {
            chatManager.addMessage('Hello', true);
            const messages = document.querySelectorAll('.user-message');
            expect(messages.length).toBe(1);
            expect(messages[0].textContent).toContain('Hello');
        });

        test('should maintain message history limit', () => {
            for (let i = 0; i < 55; i++) {
                chatManager.addMessage(`Message ${i}`, true);
            }
            expect(chatManager.messageHistory.length).toBeLessThanOrEqual(chatManager.maxMessages);
        });
    });
}); 