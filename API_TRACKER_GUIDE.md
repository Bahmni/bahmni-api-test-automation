# API Tracker Usage Guide

## Overview

The centralized API tracker (`apiTracker.js`) automatically captures all API request/response details for HTML test reports. This eliminates code redundancy and makes creating new service files incredibly easy.

## ✨ Benefits

- **No Redundancy**: Write tracking code once, use everywhere
- **Easy to Create New Services**: Just 2-3 lines per API function
- **Automatic Reporting**: API details automatically appear in HTML reports
- **Single Source of Truth**: One central place for all API tracking

---

## 🚀 Quick Start: Creating a New Service File

### Step 1: Import the Required Modules

```javascript
import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";
```

### Step 2: Create Your API Functions

**Example 1: Simple GET Request**

```javascript
export async function getAllServices() {
  const endpoint = "openmrs/ws/rest/v1/appointmentService/all/default";
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().get(endpoint),
    200,
    "GET",
    fullEndpoint,
  );
}
```

**Example 2: GET with Query Parameters**

```javascript
export async function getServiceByUuid(serviceUuid) {
  const endpoint = "openmrs/ws/rest/v1/appointmentService";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = { uuid: serviceUuid };

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  return handleApiResponse(
    authenticatedRequest().get(endpoint).query(queryParams),
    200,
    "GET",
    fullEndpoint,
    null,
    queryParams,
  );
}
```

**Example 3: POST with Payload**

```javascript
export async function createService(serviceData) {
  const endpoint = "openmrs/ws/rest/v1/appointmentService";
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "POST";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = serviceData;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().post(endpoint).send(serviceData),
    200,
    "POST",
    fullEndpoint,
    serviceData,
  );
}
```

**Example 4: DELETE with Query Parameters**

```javascript
export async function deleteServiceByUuid(serviceUuid) {
  const endpoint = "openmrs/ws/rest/v1/appointmentService";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = { uuid: serviceUuid };

  lastApiCall.method = "DELETE";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  return handleApiResponse(
    authenticatedRequest().delete(endpoint).query(queryParams),
    200,
    "DELETE",
    fullEndpoint,
    null,
    queryParams,
  );
}
```

---

## 📋 Complete Service File Template

```javascript
import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

const myService = {
  base: "openmrs/ws/rest/v1/myservice",
};

// GET request example
export async function getAll() {
  const endpoint = myService.base;
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().get(endpoint),
    200,
    "GET",
    fullEndpoint,
  );
}

// POST request example
export async function create(data) {
  const endpoint = myService.base;
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "POST";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = data;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().post(endpoint).send(data),
    200,
    "POST",
    fullEndpoint,
    data,
  );
}

// PUT/UPDATE request example
export async function update(uuid, data) {
  const endpoint = myService.base;
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const updatedData = { ...data, uuid };

  lastApiCall.method = "POST";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = updatedData;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().post(endpoint).send(updatedData),
    200,
    "POST",
    fullEndpoint,
    updatedData,
  );
}

// DELETE request example
export async function remove(uuid) {
  const endpoint = myService.base;
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = { uuid };

  lastApiCall.method = "DELETE";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  return handleApiResponse(
    authenticatedRequest().delete(endpoint).query(queryParams),
    200,
    "DELETE",
    fullEndpoint,
    null,
    queryParams,
  );
}
```

---

## 🧪 Using in Test Spec Files

**No changes needed!** The tracking happens automatically. Just use `addApiDetailsToReport(this)` after API calls:

```javascript
import {
  getAllServiceDetails,
  createService,
} from "../../../src/services/openmrs/appointmentService.js";
import { addTestLog, addApiDetailsToReport } from "../../fixtures/rootHooks.js";

describe("Appointment Service Tests", function () {
  it("should get all appointment services", async function () {
    addTestLog(this, "Fetching all appointment services");

    const response = await getAllServiceDetails();
    addApiDetailsToReport(this); // Add API details to HTML report

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
    addTestLog(this, `Received ${response.body.length} services`);
  });

  it("should create an appointment service", async function () {
    const serviceData = { name: "Test-Service", startTime: "09:00:00" };
    addTestLog(this, `Creating service: ${serviceData.name}`);

    const response = await createService(serviceData);
    addApiDetailsToReport(this); // Add API details to HTML report

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("uuid");
    addTestLog(this, `Service created with UUID: ${response.body.uuid}`);
  });
});
```

---

## 📊 What Gets Captured Automatically

For **every API call**, the system captures:

- ✅ HTTP Method (GET, POST, PUT, DELETE, etc.)
- ✅ Full Endpoint URL
- ✅ Request Payload (for POST/PUT)
- ✅ Query Parameters (for GET/DELETE)
- ✅ HTTP Status Code
- ✅ Response Body

---

## 🎨 HTML Report Output

The API details appear in your mochawesome HTML reports as:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 API REQUEST & RESPONSE DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Method: GET
🔗 Endpoint: https://localhost/api/v1/users

🔍 Query Parameters:
{
  "id": "123"
}

✅ Status Code: 200

📄 Response Body:
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com"
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## ⚠️ Important Notes

1. **For Failed Tests**: API details automatically appear in error messages - no extra code needed!
2. **For Passing Tests**: Call `addApiDetailsToReport(this)` after the API call to see details in the report
3. **Single Tracker**: All services share one central tracker - no conflicts, always works!

---

## 🔄 How It Works

The Bahmni framework uses a combination of `lastApiCall` for tracking and `handleApiResponse()` for error handling:

**Pattern Breakdown:**

```javascript
export async function getServiceByUuid(uuid) {
  // 1. Define the endpoint
  const endpoint = "openmrs/ws/rest/v1/appointmentService";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = { uuid };

  // 2. Track request details BEFORE making the call
  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  // 3. Make the API call with handleApiResponse for automatic error handling
  return handleApiResponse(
    authenticatedRequest().get(endpoint).query(queryParams),
    200, // Expected status code
    "GET", // HTTP method
    fullEndpoint, // Full URL for error reporting
    null, // Payload (null for GET)
    queryParams, // Query parameters
  );
}
```

**Benefits:**

- ✅ Automatic request/response tracking
- ✅ Detailed error messages with full context
- ✅ Consistent pattern across all services
- ✅ Easy debugging with captured API details

---

## 📝 Summary

- **New service files**: Follow the pattern with `lastApiCall` + `handleApiResponse()`
- **Test spec files**: Use `addApiDetailsToReport(this)` for passing tests
- **Failed tests**: Automatic - detailed error context is included!
- **HTML reports**: Beautiful, detailed, automatic!

**Key Steps for Each API Function:**

1. Define endpoint and full endpoint URL
2. Set `lastApiCall` properties (method, endpoint, payload, queryParams)
3. Return `handleApiResponse()` with the request and expected status
4. All API details are automatically captured!

**Creating new services is now EASY and CONSISTENT! ✨**
