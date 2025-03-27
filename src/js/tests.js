// Test Suite for Travel Weather Chatbot
// Version: 1.0.0

class TestSuite {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async runTests() {
        console.log('Starting test suite...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFn();
                this.passed++;
                console.log(`✅ ${test.name} passed`);
            } catch (error) {
                this.failed++;
                console.error(`❌ ${test.name} failed:`, error);
            }
        }

        console.log(`\nTest Summary: ${this.passed} passed, ${this.failed} failed`);
    }
}

// Create test suite
const testSuite = new TestSuite();

// Trip Planner Tests
testSuite.addTest('Trip Planner - Add Location', () => {
    const planner = new TripPlanner();
    const result = planner.addLocation('London');
    if (!result) throw new Error('Failed to add location');
    if (planner.getLocations().length !== 1) throw new Error('Location count incorrect');
});

testSuite.addTest('Trip Planner - Max Locations', () => {
    const planner = new TripPlanner();
    for (let i = 0; i < 6; i++) {
        planner.addLocation(`Location ${i}`);
    }
    if (planner.getLocations().length !== 5) throw new Error('Max locations limit not enforced');
});

testSuite.addTest('Trip Planner - Remove Location', () => {
    const planner = new TripPlanner();
    planner.addLocation('Paris');
    const result = planner.removeLocation('Paris');
    if (!result) throw new Error('Failed to remove location');
    if (planner.getLocations().length !== 0) throw new Error('Location not removed');
});

// Weather Service Tests
testSuite.addTest('Weather Service - Process Weather Data', () => {
    const service = new WeatherService();
    const mockData = {
        name: 'London',
        main: {
            temp: 20,
            humidity: 65
        },
        weather: [{
            main: 'Clear',
            description: 'clear sky'
        }],
        wind: {
            speed: 10
        }
    };

    const processed = service.processWeatherData(mockData);
    if (processed.temperature !== 20) throw new Error('Temperature processing failed');
    if (processed.condition !== 'Clear') throw new Error('Condition processing failed');
});

testSuite.addTest('Weather Service - Clothing Suggestions', () => {
    const service = new WeatherService();
    const weather = {
        temperature: 25,
        condition: 'Clear',
        windSpeed: 15
    };

    const suggestions = service.getClothingSuggestion(weather);
    if (!suggestions.includes('Light clothing')) throw new Error('Temperature-based suggestion missing');
    if (!suggestions.includes('Sunglasses and sunscreen')) throw new Error('Weather condition suggestion missing');
});

// Chat Manager Tests
testSuite.addTest('Chat Manager - Message Creation', () => {
    const chat = new ChatManager();
    const message = chat.createMessageElement('Test message', true);
    if (!message.classList.contains('user-message')) throw new Error('Message class incorrect');
});

testSuite.addTest('Chat Manager - State Management', () => {
    const chat = new ChatManager();
    chat.handleInitialState('plan trip');
    if (chat.currentState !== 'collecting_locations') throw new Error('State transition failed');
});

// Run tests when the page loads
window.addEventListener('load', () => {
    testSuite.runTests();
}); 