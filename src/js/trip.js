// Trip Planning Logic
// Version: 1.0.0

class TripPlanner {
    constructor() {
        this.locations = [];
        this.days = 3;
        this.maxLocations = 5;
    }

    addLocation(location) {
        if (this.locations.length < this.maxLocations) {
            this.locations.push(location);
            return true;
        }
        return false;
    }

    removeLocation(location) {
        const index = this.locations.indexOf(location);
        if (index > -1) {
            this.locations.splice(index, 1);
            return true;
        }
        return false;
    }

    getLocations() {
        return this.locations;
    }

    getDays() {
        return this.days;
    }

    setDays(days) {
        if (days > 0) {
            this.days = days;
            return true;
        }
        return false;
    }

    generateTripPlan() {
        if (this.locations.length === 0) {
            return null;
        }

        const plan = {
            locations: this.locations,
            days: this.days,
            schedule: this.generateSchedule()
        };

        return plan;
    }

    generateSchedule() {
        const schedule = [];
        const locationsPerDay = Math.ceil(this.locations.length / this.days);

        for (let day = 0; day < this.days; day++) {
            const dayLocations = this.locations.slice(
                day * locationsPerDay,
                (day + 1) * locationsPerDay
            );
            schedule.push({
                day: day + 1,
                locations: dayLocations
            });
        }

        return schedule;
    }
}

// Export trip planner
window.tripPlanner = new TripPlanner(); 