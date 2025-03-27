# Travel Weather Assistant

A chatbot that helps plan clothing requirements for multi-location trips based on weather data. The assistant can handle up to 5 locations across 3 days and provides weather-based clothing suggestions for each location.

## Features

- Weather API integration for real-time weather data
- Trip planning with multiple locations
- Smart clothing suggestions based on weather conditions
- Modern, responsive UI with dark mode support
- Accessibility features
- Comprehensive test coverage

## Team Members

- Joy Lee
  - Weather Service Implementation
  - UI/UX Design
  - Testing Framework
  - Documentation

## Project Structure

```
src/
├── index.html          # Main HTML file
├── css/
│   └── styles.css     # Styling
└── js/
    ├── weather.js     # Weather API integration
    ├── trip.js        # Trip planning logic
    ├── chat.js        # Chat functionality
    └── ui.js          # UI management

tests/
├── setup.js           # Test setup
├── weather.test.js    # Weather service tests
├── trip.test.js       # Trip planner tests
├── chat.test.js       # Chat manager tests
└── ui.test.js         # UI manager tests
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your OpenWeatherMap API key in the weather service
4. Run the tests:
   ```bash
   npm test
   ```

## Testing

The project uses Jest for testing. Available test commands:

- `npm test`: Run all tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Generate test coverage report

## Features Implementation

### Weather Service (weather.js)
- API integration with OpenWeatherMap
- Weather data processing
- Clothing suggestions based on weather conditions
- Forecast handling

### Trip Planner (trip.js)
- Location management (up to 5 locations)
- Trip schedule generation
- Day distribution logic

### Chat Manager (chat.js)
- User input handling
- State management
- Message history
- Error handling

### UI Manager (ui.js)
- Responsive design
- Dark mode support
- Accessibility features
- Animation handling

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write/update tests
4. Submit a pull request

## License

MIT License 