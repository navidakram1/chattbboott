// Trip Planning Implementation
// Version: 1.1.0
// Author: Ava Chen
// Description: Enhanced trip planner with improved scheduling and activity suggestions

class TripPlanner {
    constructor() {
        this.locations = [];
        this.maxLocations = 5;
        this.weatherService = window.weatherService;
        this.activitySuggestions = {
            sunny: ['Visit outdoor attractions', 'Go hiking', 'Have a picnic', 'Visit local parks', 'Outdoor photography'],
            rainy: ['Visit museums', 'Indoor shopping', 'Visit art galleries', 'Try local cafes', 'Indoor attractions'],
            cloudy: ['City tours', 'Visit historical sites', 'Local markets', 'Cultural activities', 'Photography tours'],
            snow: ['Skiing', 'Snowboarding', 'Winter hiking', 'Visit cozy cafes', 'Winter photography'],
            extreme: ['Indoor activities', 'Visit local attractions', 'Museum tours', 'Stay in comfortable accommodations']
        };
        this.timeSlots = ['morning', 'afternoon', 'evening'];
    }

    addLocation(location) {
        if (this.locations.length < this.maxLocations && !this.locations.includes(location)) {
            this.locations.push(location);
            return true;
        }
        return false;
    }

    removeLocation(location) {
        const index = this.locations.indexOf(location);
        if (index !== -1) {
            this.locations.splice(index, 1);
            return true;
        }
        return false;
    }

    getLocations() {
        return [...this.locations];
    }

    async generateTripPlan() {
        if (this.locations.length === 0) {
            return null;
        }

        const schedule = [];
        const weatherData = new Map();

        // Fetch weather data for all locations
        for (const location of this.locations) {
            try {
                const weather = await this.weatherService.getWeatherData(location);
                weatherData.set(location, weather);
            } catch (error) {
                console.error(`Failed to fetch weather data for ${location}:`, error);
                weatherData.set(location, null);
            }
        }

        // Generate daily schedules
        let currentDay = 1;
        for (const location of this.locations) {
            const daySchedule = {
                day: currentDay,
                locations: [location],
                activities: await this.generateDailyActivities(location, weatherData.get(location))
            };
            schedule.push(daySchedule);
            currentDay++;
        }

        return {
            totalDays: this.locations.length,
            schedule: schedule
        };
    }

    async generateDailyActivities(location, weatherData) {
        const activities = [];
        
        if (!weatherData) {
            return [{
                timeSlot: 'all-day',
                activity: 'Flexible activities based on actual weather conditions',
                note: 'Weather data unavailable - please check local forecast'
            }];
        }

        const weatherCondition = this.getWeatherCategory(weatherData);
        const suggestions = this.activitySuggestions[weatherCondition];

        for (const timeSlot of this.timeSlots) {
            const activity = {
                timeSlot: timeSlot,
                activity: this.selectActivity(suggestions, activities),
                weatherNote: this.getWeatherNote(weatherData, timeSlot)
            };
            activities.push(activity);
        }

        return activities;
    }

    getWeatherCategory(weatherData) {
        const temp = weatherData.main.temp;
        const conditions = weatherData.weather[0].main.toLowerCase();
        const windSpeed = weatherData.wind.speed;

        if (temp < -10 || temp > 35 || windSpeed > 20) {
            return 'extreme';
        }

        if (conditions.includes('snow')) {
            return 'snow';
        }

        if (conditions.includes('rain') || conditions.includes('drizzle')) {
            return 'rainy';
        }

        if (conditions.includes('cloud')) {
            return 'cloudy';
        }

        return 'sunny';
    }

    selectActivity(suggestions, existingActivities) {
        const usedActivities = new Set(existingActivities.map(a => a.activity));
        const availableActivities = suggestions.filter(activity => !usedActivities.has(activity));
        
        if (availableActivities.length === 0) {
            return suggestions[Math.floor(Math.random() * suggestions.length)];
        }
        
        return availableActivities[Math.floor(Math.random() * availableActivities.length)];
    }

    getWeatherNote(weatherData, timeSlot) {
        const temp = Math.round(weatherData.main.temp);
        const conditions = weatherData.weather[0].description;
        const windSpeed = Math.round(weatherData.wind.speed);

        return `${timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}: ${temp}°C, ${conditions}, wind ${windSpeed} m/s`;
    }

    generateSummary() {
        return {
            totalLocations: this.locations.length,
            locations: this.locations,
            estimatedDuration: `${this.locations.length} days`,
            status: this.locations.length > 0 ? 'ready' : 'needs_locations'
        };
    }
}

// Initialize and export
window.tripPlanner = new TripPlanner(); 