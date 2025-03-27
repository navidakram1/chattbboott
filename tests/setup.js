// Test Setup
// Author: [Team Member Name]
// Description: Setup file for Jest tests

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
global.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = callback => setTimeout(callback, 0);

// Mock Material Icons
global.MaterialIcons = {
    dark_mode: 'dark_mode',
    light_mode: 'light_mode',
    send: 'send',
    place: 'place',
    close: 'close'
};

// Mock WeatherManager
global.WeatherManager = class {
    async getWeatherData(location) {
        return {
            temperature: 20,
            description: 'sunny',
            humidity: 50,
            windSpeed: 10
        };
    }
};

// Mock TripManager
global.TripManager = class {
    generateItinerary(locations) {
        return `Mock itinerary for ${locations.join(', ')}`;
    }

    handleTripCommand(command) {
        return `Handling command: ${command}`;
    }
};

// Add custom matchers
expect.extend({
    toBeValidMessage(received) {
        const pass = received.classList.contains('message') &&
            (received.classList.contains('user-message') || received.classList.contains('bot-message'));
        return {
            pass,
            message: () => `expected ${received} to be a valid message element`
        };
    },
    toHaveProperAttributes(received, attributes) {
        const hasAllAttributes = Object.entries(attributes).every(([key, value]) => 
            received.getAttribute(key) === value
        );
        return {
            pass: hasAllAttributes,
            message: () => `expected ${received} to have all required attributes`
        };
    }
}); 