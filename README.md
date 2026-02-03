# WEMS3 Automation Tests

A comprehensive end-to-end test automation suite for the WEMS3 application built with **Playwright** and **TypeScript**.

## Overview

This project contains automated tests for the WEMS3 web application, covering critical user workflows including login, dashboard navigation, and UI interactions across multiple pages.

## Project Structure

```
wems3_automate_test/
├── data/                          # Test data files
├── fixtures/                      # Playwright fixtures for test setup
├── pages/                         # Page Object Models
│   ├── DashboardPage.ts
│   ├── FooterNavigationBar.ts
│   ├── LoginPage.ts
│   ├── SideNavigationBar.ts
│   └── TopNavigationBar.ts
├── tests/                         # Test specifications
│   ├── dashboard.spec.ts
│   ├── footerNavigationBar.spec.ts
│   ├── login.spec.ts
│   ├── sideNavigationBar.spec.ts
│   └── topNavigationBar.spec.ts
├── utils/                         # Utility functions and helpers
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies
└── test-results/                  # Test execution results (JUnit XML)
```

## Technology Stack

- **Playwright** (v1.58.0) - Web testing framework
- **TypeScript** (v5.9.3) - Language for type-safe test code
- **Node.js** - JavaScript runtime
- **dotenv** - Environment variable management

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Access to the staging environment

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd wems3_automate_test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating a `.env` file:
   ```
   BASE_URL_STAGING=<staging-url>
   # Add other required environment variables
   ```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in headed mode (with browser window visible)
```bash
npm run test:headed
```

### Debug tests
```bash
npm run test:debug
```

### Generate tests using Codegen
```bash
npm run codegen
```

## Test Configuration

Tests are configured in [playwright.config.ts](playwright.config.ts) with the following features:

- **Parallel execution**: Tests run in parallel for faster execution
- **Retries**: Automatic retries enabled in CI environment
- **Multiple reporters**: HTML, list, and JUnit XML formats
- **Timeouts**: 45 seconds per test, 10 seconds for assertions
- **Screenshots**: Captured on test failures
- **Trace recording**: Enabled on first retry for debugging

## Test Coverage

The suite includes tests for:

- **Login** - User authentication flows and error handling
- **Dashboard** - Dashboard page functionality
- **Navigation** - Top navigation bar, side navigation bar, and footer navigation interactions

## Test Results

Test results are generated in multiple formats:

- **HTML Report**: `playwright-report/index.html` - Interactive test report
- **JUnit XML**: `test-results/junit.xml` - CI/CD integration format

View the HTML report:
```bash
npx playwright show-report
```

## Page Object Model

This project follows the **Page Object Model** pattern for maintainable and reusable test code:

- Each page has a corresponding TypeScript class in the `pages/` directory
- Page classes contain methods for interacting with page elements
- Tests import and use these page objects for cleaner, more readable test code

Example structure:
```typescript
export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string) {
    // Login implementation
  }
}
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
BASE_URL_STAGING=https://your-staging-url.com
```

The configuration automatically reads from this file using the `dotenv` package.

## Debugging

For debugging failed tests:

1. Use `npm run test:debug` to run tests in debug mode
2. Trace files are automatically recorded on first retry
3. Screenshots of failures are saved in `test-results/`
4. View full traces in Playwright Inspector for detailed analysis

## CI/CD Integration

The configuration includes CI-specific settings:

- Retries are enabled (2 attempts)
- Worker count set to 2 for parallel execution
- JUnit XML output for CI pipeline integration

## Contributing

When adding new tests:

1. Create corresponding page objects in the `pages/` directory
2. Use the Page Object Model pattern for element interactions
3. Store test data in the `data/` directory
4. Use fixtures for common test setup in the `fixtures/` directory
5. Follow TypeScript best practices and type safety

## Troubleshooting

### Tests timing out
- Increase timeout values in `playwright.config.ts`
- Check internet connectivity to staging environment
- Review test traces and logs

### Element not found errors
- Verify selectors in page objects match current UI
- Use Playwright Inspector: `npm run codegen`
- Check if elements are loaded before interaction

### Environment variables not loaded
- Ensure `.env` file exists in root directory
- Verify file is not listed in `.gitignore`
- Restart the test runner after updating `.env`

## License

ISC

## Support

For issues or questions, contact the development team.
