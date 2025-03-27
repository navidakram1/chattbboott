// Trip Planner Tests
// Author: Joy Lee
// Description: Tests for trip planning functionality

describe('TripPlanner', () => {
    let tripPlanner;

    beforeEach(() => {
        tripPlanner = new TripPlanner();
    });

    test('should add locations up to maximum limit', () => {
        expect(tripPlanner.addLocation('London')).toBe(true);
        expect(tripPlanner.addLocation('Paris')).toBe(true);
        expect(tripPlanner.addLocation('New York')).toBe(true);
        expect(tripPlanner.addLocation('Tokyo')).toBe(true);
        expect(tripPlanner.addLocation('Sydney')).toBe(true);
        expect(tripPlanner.addLocation('Berlin')).toBe(false); // Should fail at 6th location
    });

    test('should remove locations', () => {
        tripPlanner.addLocation('London');
        expect(tripPlanner.removeLocation('London')).toBe(true);
        expect(tripPlanner.getLocations()).toHaveLength(0);
    });

    test('should generate trip plan with correct schedule', () => {
        tripPlanner.addLocation('London');
        tripPlanner.addLocation('Paris');
        tripPlanner.addLocation('New York');
        tripPlanner.addLocation('Tokyo');
        tripPlanner.addLocation('Sydney');

        const plan = tripPlanner.generateTripPlan();
        expect(plan).toBeTruthy();
        expect(plan.locations).toHaveLength(5);
        expect(plan.days).toBe(3);
        expect(plan.schedule).toHaveLength(3);
    });

    test('should not generate plan without locations', () => {
        const plan = tripPlanner.generateTripPlan();
        expect(plan).toBeNull();
    });

    test('should set and get days correctly', () => {
        expect(tripPlanner.setDays(5)).toBe(true);
        expect(tripPlanner.getDays()).toBe(5);
        expect(tripPlanner.setDays(0)).toBe(false);
        expect(tripPlanner.getDays()).toBe(3); // Should remain at default
    });

    test('should distribute locations evenly across days', () => {
        tripPlanner.addLocation('London');
        tripPlanner.addLocation('Paris');
        tripPlanner.addLocation('New York');
        tripPlanner.addLocation('Tokyo');
        tripPlanner.addLocation('Sydney');

        const plan = tripPlanner.generateTripPlan();
        const schedule = plan.schedule;

        // Check distribution across 3 days
        expect(schedule[0].locations.length).toBeGreaterThan(0);
        expect(schedule[1].locations.length).toBeGreaterThan(0);
        expect(schedule[2].locations.length).toBeGreaterThan(0);
    });
}); 