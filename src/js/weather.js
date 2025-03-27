// Weather API Integration
// Version: 1.0.0

class WeatherService {
    constructor() {
        this.apiKey = ''; // API key will be set by the user
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    }

    setApiKey(key) {
        this.apiKey = key;
    }

    async getWeatherData(location) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Weather data not available');
            }

            const data = await response.json();
            return this.processWeatherData(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    processWeatherData(data) {
        return {
            location: data.name,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            description: data.weather[0].description
        };
    }

    getClothingSuggestion(weather) {
        const suggestions = [];
        
        // Temperature-based suggestions
        if (weather.temperature > 25) {
            suggestions.push('Light clothing (shorts, t-shirts)');
        } else if (weather.temperature > 15) {
            suggestions.push('Medium clothing (jeans, light jackets)');
        } else {
            suggestions.push('Warm clothing (heavy jackets, sweaters)');
        }

        // Weather condition-based suggestions
        switch (weather.condition.toLowerCase()) {
            case 'rain':
                suggestions.push('Raincoat or umbrella');
                break;
            case 'snow':
                suggestions.push('Winter boots and gloves');
                break;
            case 'clear':
                suggestions.push('Sunglasses and sunscreen');
                break;
        }

        // Wind-based suggestions
        if (weather.windSpeed > 20) {
            suggestions.push('Wind-resistant clothing');
        }

        return suggestions;
    }

    async getForecast(location, days = 3) {
        if (!this.apiKey) {
            throw new Error('API key not set');
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`
            );
            
            if (!response.ok) {
                throw new Error('Forecast data not available');
            }

            const data = await response.json();
            return this.processForecastData(data, days);
        } catch (error) {
            console.error('Error fetching forecast data:', error);
            throw error;
        }
    }

    processForecastData(data, days) {
        const dailyForecasts = [];
        const today = new Date();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            
            const dayForecast = data.list.find(item => {
                const itemDate = new Date(item.dt * 1000);
                return itemDate.getDate() === date.getDate();
            });

            if (dayForecast) {
                dailyForecasts.push({
                    date: date.toISOString().split('T')[0],
                    weather: this.processWeatherData(dayForecast)
                });
            }
        }

        return dailyForecasts;
    }
}

// Export weather service
window.weatherService = new WeatherService(); 