// Weather Service Tests
// Author: Joy Lee
// Description: Tests for weather service functionality

describe('WeatherService', () => {
    let weatherService;

    beforeEach(() => {
        weatherService = new WeatherService();
        weatherService.setApiKey('test-api-key');
    });

    test('should process weather data correctly', () => {
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
                speed: 5
            }
        };

        const processed = weatherService.processWeatherData(mockData);
        expect(processed).toEqual({
            location: 'London',
            temperature: 20,
            condition: 'Clear',
            humidity: 65,
            windSpeed: 5,
            description: 'clear sky'
        });
    });

    test('should provide appropriate clothing suggestions based on temperature', () => {
        const weather = {
            temperature: 30,
            condition: 'Clear',
            windSpeed: 5
        };

        const suggestions = weatherService.getClothingSuggestion(weather);
        expect(suggestions).toContain('Light clothing (shorts, t-shirts)');
        expect(suggestions).toContain('Sunglasses and sunscreen');
    });

    test('should provide appropriate clothing suggestions for rain', () => {
        const weather = {
            temperature: 15,
            condition: 'Rain',
            windSpeed: 5
        };

        const suggestions = weatherService.getClothingSuggestion(weather);
        expect(suggestions).toContain('Medium clothing (jeans, light jackets)');
        expect(suggestions).toContain('Raincoat or umbrella');
    });

    test('should handle API errors gracefully', async () => {
        weatherService.setApiKey('');
        await expect(weatherService.getWeatherData('London')).rejects.toThrow('API key not set');
    });

    test('should process forecast data correctly', () => {
        const mockForecastData = {
            list: [
                {
                    dt: Date.now() / 1000,
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
                        speed: 5
                    }
                }
            ]
        };

        const processed = weatherService.processForecastData(mockForecastData, 1);
        expect(processed).toHaveLength(1);
        expect(processed[0]).toHaveProperty('date');
        expect(processed[0]).toHaveProperty('weather');
    });
}); 