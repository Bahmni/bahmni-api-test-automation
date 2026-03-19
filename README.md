# Bahmni API Test Automation Framework

A scalable API testing framework for Bahmni built with Mocha, Chai, and Supertest. Features automated reporting, dynamic authentication, and practical guides for rapid test development.

---

## 📋 Table of Contents

- [Quick Setup](#-quick-setup)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Reports](#-reports)
- [Framework Architecture](#-framework-architecture)
- [Running Tests](#-running-tests)
- [Configuration](#-configuration)
- [Additional Guides](#-additional-guides)

---

## 🚀 Quick Setup

### Prerequisites
- Node.js 18.x+
- Yarn 1.x+

### Installation

```bash
git clone https://github.com/Bahmni/bahmni-api-test-automation.git
cd bahmni-api-test-automation
yarn install
```

### Configure Environment

Create `.env` file:

```bash
# Required
TEST_ENV=dev
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=Admin123
```

### Run Tests

```bash
yarn test
```

View report: `mochawesome-report/mochawesome.html`

---

## 📁 Project Structure

```
bahmni-api-test-automation/
├── src/
│   ├── config/           # Environment configs, auth, API clients
│   ├── services/         # API endpoint methods (service layer)
│   └── helpers/          # Utilities (API tracker, email OTP, etc.)
├── tests/
│   ├── specs/           # Test files (organized by feature)
│   ├── fixtures/        # Test helpers, hooks, utilities
│   └── testdata/        # Credentials & request payloads
└── mochawesome-report/  # Generated HTML reports
```

**Key Concepts:**
- **`src/services/`** - All API calls go here. One service file per domain/module
- **`tests/specs/`** - Test files organized by feature
- **`tests/fixtures/`** - Reusable helpers and utilities
- **`tests/testdata/`** - Test data (credentials, payloads) separated for reusability

---

## 🎯 Quick Start

### 1. Create Your First Test

Create `tests/specs/bahmni/myTest.spec.js`:

```javascript
import { getAllServiceDetails } from "../../../src/services/openmrs/appointmentService.js";
import { addTestLog, addApiDetailsToReport } from "../../fixtures/rootHooks.js";

describe("My First Test", function() {
  it("should fetch appointment services", async function() {
    addTestLog(this, "Fetching appointment services");
    
    const response = await getAllServiceDetails();
    addApiDetailsToReport(this);
    
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });
});
```

Run: `yarn test`

---

### 2. Add a New Service Method

Add to `src/services/openmrs/appointmentService.js`:

```javascript
import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

export async function getServiceByName(serviceName) {
  const endpoint = "openmrs/ws/rest/v1/appointmentService";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = { name: serviceName };
  
  lastApiCall.method = 'GET';
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;
  
  return handleApiResponse(
    authenticatedRequest().get(endpoint).query(queryParams),
    200,
    'GET',
    fullEndpoint,
    null,
    queryParams
  );
}
```

**Key Points:**
- Use `handleApiResponse()` for automatic API tracking & error handling
- Use `authenticatedRequest()` for basic auth
- Use `lastApiCall` to track request details for reports
- Set method, endpoint, payload, and queryParams before making the call

📖 **Details:** [API Tracker Guide](API_TRACKER_GUIDE.md)

---

### 3. Add Helper Functions

**General helpers:** `tests/fixtures/testHelpers.js`
```javascript
export function myGeneralHelper() {
  // Logic used across all tests
}
```

**Domain-specific helpers:** `tests/fixtures/testHelpers.js`
```javascript
export function generateServiceName(prefix = "Test-Service") {
  const timestamp = Date.now();
  return `${prefix}-${timestamp}`;
}
```

**Usage:**
```javascript
import { generateServiceName } from "../../fixtures/testHelpers.js";

it("test with unique service name", async function() {
  const serviceName = generateServiceName();
  // Use in test
});
```

---

### 4. Work with Test Data

**Payloads:** `tests/testdata/payloads/bahmni/createServicePayload.js`
```javascript
export const appointmentServicePayload = {
  name: "Test-Service",
  description: "Test service description",
  startTime: "09:00:00",
  endTime: "17:00:00",
  maxAppointmentsLimit: 10
};
```

**Environment-specific data:**
```javascript
import { config } from "../../../src/config/index.js";

export const testData = {
  dev: { locationId: "dev-123" },
  qa: { locationId: "qa-456" },
  uat: { locationId: "uat-789" }
};

// Usage: testData[config.env].locationId
```

**Credentials:** `tests/testdata/credentials/myCredentials.js`
```javascript
export const users = {
  testUser: {
    username: process.env.TEST_USER || "defaultUser",
    password: process.env.TEST_PASSWORD || ""
  }
};
```

---

## 📊 Reports

Framework uses **Mochawesome** for HTML reports with:
- Test summary (pass/fail/duration)
- Custom logs via `addTestLog(this, "message")`
- API details via `addApiDetailsToReport(this)`
- Error stack traces (automatic)

### Add Logs to Reports

```javascript
it("my test", async function() {
  addTestLog(this, "Step 1: Starting");
  
  const response = await apiCall();
  addApiDetailsToReport(this); // Adds API request/response
  
  addTestLog(this, `Received ${response.body.length} items`);
});
```

**Note:** Failed tests automatically include API details.

### View Reports

After tests run: Open `mochawesome-report/mochawesome.html`

---

## 🏗️ Framework Architecture

**3-Layer Pattern:**

```
Tests (specs/) → Services (src/services/) → Config/Helpers (src/config/, src/helpers/)
```

### Key Components

**1. API Tracker** - Auto-captures API details for reports (reduces code by 70%)  
**2. Auth Manager** - Dynamic credential switching during tests  
**3. Response Handler** - Centralized error handling with detailed logging

📖 **Details:** [API Tracker Guide](API_TRACKER_GUIDE.md)

---

## 🧪 Running Tests

```bash
# All tests
yarn test

# Specific suite
yarn test:bahmni

# With environment
TEST_ENV=qa yarn test

# Specific file
npx mocha tests/specs/bahmni/appointmentService.spec.js

# Generate report only
yarn report:generate
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# .env file
TEST_ENV=dev                    # Required: dev, qa, uat, local
SUPERADMIN_USERNAME=admin       # Required
SUPERADMIN_PASSWORD=Admin123    # Required
```

### Environments

Configured in `src/config/environments.js`:

```javascript
export let environments = {
  local: {
    baseUri: "https://localhost/",
  },
  dev: {
    baseUri: "https://dev.bahmni.org/",
    userName: "",
    password: "",
  },
  qa: {
    baseUri: "https://qa.bahmni.org/",
    userName: "",
    password: "",
  },
  // ...
};
```

---

## 💡 Common Patterns

### Test Structure

```javascript
describe("Feature", function() {
  before(async function() { /* Setup */ });
  
  it("should do something", async function() {
    const response = await apiCall();
    addApiDetailsToReport(this);
    expect(response.status).to.equal(200);
  });
  
  afterEach(function() { resetAuthCredentials(); });
});
```

### Auth Switching

```javascript
import { setAuthCredentials, resetAuthCredentials } from "../../src/config/authManager.js";

it("test with user", async function() {
  setAuthCredentials('user', 'pass');
  const response = await apiCall();
  expect(response.status).to.equal(200);
  // Auto-reset in afterEach
});
```

### Assertions

```javascript
expect(response.status).to.equal(200);
expect(response.body).to.be.an('array');
expect(response.body).to.have.property('uuid');
expect(actualArray).to.have.members(expectedArray);
expect(actualObject).to.deep.equal(expectedObject);
```

---

## 📚 Additional Guides

- **[API Tracker Guide](API_TRACKER_GUIDE.md)** - Complete API tracking & service creation

---

## 🎯 Best Practices

1. **Service Layer First** - Create service methods, never direct HTTP calls in tests
2. **Use API Tracker Pattern** - Follow the `lastApiCall` + `handleApiResponse()` pattern for all service methods
3. **Reset Auth** - Always reset credentials in `afterEach`
4. **Add Logs** - Use `addTestLog()` for debugging
5. **Separate Data** - Keep payloads/credentials in testdata/
6. **Environment Variables** - Never hardcode sensitive data
7. **Clean Up** - Delete test data in `after` hooks
8. **One Concept** - Test one thing per test case

---

## 🤝 Contributing

1. Follow existing folder structure
2. Use API Tracker pattern for services
3. Add test logs for debugging
4. Update docs if needed
5. Test in multiple environments

---

## 📄 License

MPL-2.0

---

**Happy Testing! 🚀**
