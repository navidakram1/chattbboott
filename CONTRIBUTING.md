# Contributing to Travel Weather Assistant

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/chattbboott.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development Workflow

### Branch Strategy

- `main`: Production branch
- `develop`: Development integration branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Production hotfix branches

### Commit Messages

Follow the conventional commits specification:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Testing
- `chore`: Maintenance

Example:
```
feat(ui): add dark mode support
```

### Pull Request Process

1. Update your feature branch with the latest changes from develop:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature-name
   git rebase develop
   ```

2. Push your changes:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a pull request:
   - Use the PR template
   - Link related issues
   - Request reviews
   - Add appropriate labels

4. Address review comments:
   - Make requested changes
   - Push updates
   - Request re-review

5. After approval:
   - Squash and merge
   - Delete feature branch

## Code Standards

### JavaScript

- Use ES6+ features
- Follow ESLint configuration
- Add JSDoc comments for functions
- Maximum line length: 100 characters

### HTML/CSS

- Use semantic HTML
- Follow BEM naming convention
- Maintain responsive design
- Support dark mode

### Testing

- Write unit tests for new features
- Maintain minimum 85% coverage
- Test edge cases
- Add integration tests when needed

## Documentation

### Code Documentation

- Add JSDoc comments for functions
- Document complex algorithms
- Explain non-obvious solutions
- Update API documentation

### Project Documentation

- Update README.md when needed
- Document new features
- Add setup instructions
- Update troubleshooting guide

## Review Process

### Code Review Guidelines

1. Code Quality
   - Clean and readable
   - Well-documented
   - Follows standards
   - No unnecessary complexity

2. Testing
   - Adequate test coverage
   - Edge cases handled
   - Tests pass
   - No regression

3. Documentation
   - Updated docs
   - Clear comments
   - API documentation
   - Usage examples

4. Performance
   - No performance issues
   - Efficient algorithms
   - Resource usage
   - Load testing

### Review Checklist

- [ ] Code follows standards
- [ ] Tests are included
- [ ] Documentation is updated
- [ ] No linting errors
- [ ] Performance is acceptable
- [ ] Security considerations
- [ ] Accessibility maintained
- [ ] Cross-browser compatibility

## Issue Management

### Creating Issues

- Use issue templates
- Add appropriate labels
- Provide reproduction steps
- Include expected behavior

### Issue Labels

- `bug`: Bug reports
- `feature`: Feature requests
- `documentation`: Documentation updates
- `enhancement`: Improvements
- `help wanted`: Need assistance
- `good first issue`: Beginner-friendly

## Development Setup

### Requirements

- Node.js 14+
- npm 6+
- Git
- Modern web browser

### Environment Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Add your API keys:
   ```
   OPENWEATHER_API_KEY=your_api_key
   ```

4. Start development server:
   ```bash
   npm start
   ```

### Testing

Run tests:
```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release branch
4. Run tests and checks
5. Create release PR
6. After merge, tag release
7. Deploy to production

## Support

- Create issues for bugs
- Join discussions
- Help other contributors
- Improve documentation

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License. 