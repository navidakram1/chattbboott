# Contributing to Travel Weather Assistant

Thank you for your interest in contributing to the Travel Weather Assistant project! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* Use a clear and descriptive title
* Describe the exact steps which reproduce the problem
* Provide specific examples to demonstrate the steps
* Describe the behavior you observed after following the steps
* Explain which behavior you expected to see instead and why
* Include screenshots and animated GIFs if possible

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Create an issue and provide the following information:

* Use a clear and descriptive title
* Provide a step-by-step description of the suggested enhancement
* Provide specific examples to demonstrate the steps
* Describe the current behavior and explain which behavior you expected to see instead
* Explain why this enhancement would be useful

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Include screenshots and animated GIFs in your pull request whenever possible
* Follow the JavaScript styleguides
* End all files with a newline

## Development Process

1. Fork the repo and create your branch from `develop`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

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

## Testing

Before submitting a pull request, please make sure you have:

1. Added tests for new functionality
2. Updated existing tests if needed
3. Run the test suite and ensured all tests pass
4. Checked test coverage meets requirements

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * 🐎 `:racehorse:` when improving performance
    * 🚱 `:non-potable_water:` when plugging memory leaks
    * 📝 `:memo:` when writing docs
    * 🐛 `:bug:` when fixing a bug
    * 🔥 `:fire:` when removing code or files
    * 💚 `:green_heart:` when fixing the CI build
    * ✅ `:white_check_mark:` when adding tests
    * 🔒 `:lock:` when dealing with security
    * ⬆️ `:arrow_up:` when upgrading dependencies
    * ⬇️ `:arrow_down:` when downgrading dependencies

### JavaScript Styleguide

* Use 2 spaces for indentation
* Use semicolons
* Use single quotes for strings
* Use meaningful variable and function names
* Follow the Airbnb JavaScript Style Guide

### CSS Styleguide

* Use BEM naming convention
* Follow mobile-first approach
* Use CSS variables for theming
* Keep styles modular and reusable

## Documentation

* Keep documentation up to date
* Use clear and concise language
* Include examples where appropriate
* Add screenshots for UI changes
* Update the README.md if needed

## Questions?

Feel free to open an issue for any questions or concerns you may have. 