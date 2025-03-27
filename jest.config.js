module.exports = {
    // Test environment
    testEnvironment: 'jsdom',
    
    // Test match patterns
    testMatch: [
        '**/tests/**/*.test.js'
    ],
    
    // Coverage configuration
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    collectCoverageFrom: [
        'src/js/**/*.js',
        '!src/js/weather.js', // Exclude external API file
        '!**/node_modules/**'
    ],
    
    // Setup files
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    
    // Module name mapper for CSS/asset imports
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/tests/mocks/styleMock.js',
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/tests/mocks/fileMock.js'
    },
    
    // Test timeout
    testTimeout: 10000,
    
    // Verbose output
    verbose: true
}; 