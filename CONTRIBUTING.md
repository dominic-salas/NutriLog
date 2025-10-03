# Contributing to CalorieScan

Thank you for your interest in contributing to CalorieScan! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, device/emulator)

### Suggesting Features

Feature requests are welcome! Please:
- Check if the feature has already been requested
- Clearly describe the feature and its use case
- Explain why it would be valuable to users

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm test
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git commit -m "Add: brief description of your changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Include screenshots for UI changes

## Development Guidelines

### Code Style

- Use ES6+ JavaScript features
- Follow React/React Native best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Testing

- Write unit tests for new utilities and services
- Test on both Android emulator and real devices
- Verify camera and gallery functionality work correctly

### Commit Messages

Use clear, descriptive commit messages:
- `Add: new feature description`
- `Fix: bug description`
- `Update: what was updated`
- `Refactor: what was refactored`
- `Docs: documentation changes`

### Areas for Contribution

We especially welcome contributions in these areas:

1. **AI/ML Integration**
   - Integrate real ML models (TensorFlow Lite, etc.)
   - Improve food recognition accuracy
   - Add barcode scanning

2. **Features**
   - User authentication
   - Meal history tracking
   - Daily calorie goals
   - Portion size estimation
   - Recipe suggestions

3. **UI/UX**
   - Improve app design
   - Add animations
   - Dark mode support
   - Accessibility improvements

4. **Data**
   - Expand nutrition database
   - Integrate with nutrition APIs
   - Add more food items

5. **Platform Support**
   - iOS implementation
   - Web version
   - Desktop support

6. **Testing**
   - Add more tests
   - E2E testing setup
   - Performance testing

7. **Documentation**
   - Improve guides
   - Add video tutorials
   - Translate documentation

## Code Review Process

1. All PRs will be reviewed by maintainers
2. Changes may be requested
3. Once approved, PRs will be merged
4. Your contribution will be acknowledged in release notes

## Development Setup

See [QUICKSTART.md](./QUICKSTART.md) for setup instructions.

## Questions?

- Open an issue for questions
- Check existing documentation
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Every contribution helps make CalorieScan better for everyone. We appreciate your time and effort! 🙏
