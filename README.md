# Bahmni API Test Automation Framework

A comprehensive API testing framework for Bahmni built with Mocha, Chai, and Supertest. This framework provides a robust, scalable architecture for testing Bahmni APIs with support for multiple environments, dynamic authentication, and detailed reporting.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Configuration Management](#configuration-management)
- [Authentication System](#authentication-system)
- [Best Practices](#best-practices)

## Prerequisites

Before setting up the framework, ensure you have the following installed:

- **Node.js**: Version 18.x or higher
- **npm** or **yarn**: Latest stable version
- **Git**: For version control

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Bahmni/bahmni-api-test-automation.git
cd bahmni-api-test-automation
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

### 3. Configure Environment

Set up your environment variables (see [Environment Variables](#environment-variables) section for details).

## Project Structure

### Directory Explanation

- **`src/config/`**: Central configuration management including environment configs, authentication, and API client setup
- **`src/services/`**: Service layer containing API endpoint methods organized by domain
- **`tests/fixtures/`**: Shared test utilities, hooks, and helper functions
- **`tests/specs/`**: Test specification files organized by feature/module
- **`tests/testdata/`**: Test data including credentials and request payloads

## Configuration Management

### Environment Configuration

The framework supports multiple environments configured in `src/config/environments.js`:

### How Configuration Works

1. The `TEST_ENV` environment variable determines which configuration to use
2. `src/config/index.js` loads the appropriate environment config
3. Base URI and credentials are exported for use throughout the framework

## Authentication System

The framework implements a **dynamic authentication system** that allows switching between different user credentials during test execution.

### How It Works

1. Tests start with default Super Admin credentials
2. Tests can switch to specific user credentials as needed
3. API calls are made with the active credentials
4. Credentials are automatically reset to default after each test

### Using Authentication in Tests

```javascript
import { setAuthCredentials, resetAuthCredentials } from '../../../src/config/authManager.js';

// Switch to specific user
setAuthCredentials('username', 'password');

// Make API call with switched credentials
const response = await createService(payload);

// Reset to default credentials (done automatically in afterEach)
resetAuthCredentials();
```

### Setting Environment Variables

**Set environment:**
```bash
export TEST_ENV=dev
```

**Run tests with custom credentials:**
```bash
TEST_ENV=dev SUPERADMIN_USERNAME=user SUPERADMIN_PASSWORD=pass npm test
```

### Best Practices

1. **Use the Service Layer**: Always create service methods for API calls, don't make direct HTTP calls in tests
2. **Separate Test Data**: Keep payloads in separate files for reusability
3. **Reset Authentication**: Always reset credentials in `afterEach` hooks
4. **Descriptive Test Names**: Use clear, descriptive test names that explain what is being tested
5. **Proper Assertions**: Use appropriate Chai assertions for validation
6. **Clean Up**: Clean up test data after tests complete (use `after` hooks)

**Happy Testing! 🚀**
