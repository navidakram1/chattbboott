// Chat Manager Tests
// Author: Joy Lee
// Description: Tests for chat functionality

describe('ChatManager', () => {
    let chatManager;
    let mockWeatherService;
    let mockTripPlanner;

    beforeEach(() => {
        // Mock DOM elements
        document.body.innerHTML = `
            <div id="messages"></div>
            <textarea id="user-input"></textarea>
            <button id="send-button"></button>
        `;

        // Mock services
        mockWeatherService = {
            getWeatherData: jest.fn(),
            getClothingSuggestion: jest.fn()
        };
        mockTripPlanner = {
            addLocation: jest.fn(),
            getLocations: jest.fn(),
            generateTripPlan: jest.fn()
        };

        window.weatherService = mockWeatherService;
        window.tripPlanner = mockTripPlanner;

        chatManager = new ChatManager();
    });

    test('should initialize with correct state', () => {
        expect(chatManager.isProcessing).toBe(false);
        expect(chatManager.messageHistory).toHaveLength(0);
        expect(chatManager.currentState).toBe('initial');
    });

    test('should handle initial state correctly', async () => {
        await chatManager.handleInitialState('plan trip');
        expect(chatManager.currentState).toBe('collecting_locations');
    });

    test('should handle location collection correctly', async () => {
        chatManager.currentState = 'collecting_locations';
        mockTripPlanner.addLocation.mockReturnValue(true);
        mockTripPlanner.getLocations.mockReturnValue(['London']);

        await chatManager.handleLocationCollection('London');
        expect(mockTripPlanner.addLocation).toHaveBeenCalledWith('London');
    });

    test('should handle planning state correctly', async () => {
        chatManager.currentState = 'planning';
        mockTripPlanner.generateTripPlan.mockReturnValue({
            schedule: [
                { day: 1, locations: ['London'] },
                { day: 2, locations: ['Paris'] },
                { day: 3, locations: ['New York'] }
            ]
        });

        mockWeatherService.getWeatherData.mockResolvedValue({
            temperature: 20,
            condition: 'Clear'
        });

        mockWeatherService.getClothingSuggestion.mockReturnValue(['Light clothing']);

        await chatManager.generateTripPlan();
        expect(mockTripPlanner.generateTripPlan).toHaveBeenCalled();
        expect(mockWeatherService.getWeatherData).toHaveBeenCalled();
    });

    test('should handle errors gracefully', async () => {
        chatManager.currentState = 'planning';
        mockTripPlanner.generateTripPlan.mockReturnValue(null);

        await chatManager.generateTripPlan();
        expect(chatManager.messageHistory[chatManager.messageHistory.length - 1].text)
            .toContain('Sorry, I couldn\'t generate a plan');
    });

    test('should maintain message history limit', () => {
        for (let i = 0; i < 60; i++) {
            chatManager.addMessage(`Message ${i}`, true);
        }
        expect(chatManager.messageHistory.length).toBeLessThanOrEqual(50);
    });

    test('should format time correctly', () => {
        const date = new Date('2024-03-27T12:00:00');
        const formatted = chatManager.formatTime(date);
        expect(formatted).toMatch(/^\d{1,2}:\d{2}$/);
    });

    test('should handle user input correctly', async () => {
        const input = document.getElementById('user-input');
        input.value = 'Hello';
        
        await chatManager.handleUserInput();
        expect(chatManager.messageHistory[0].text).toBe('Hello');
        expect(input.value).toBe('');
    });
}); 