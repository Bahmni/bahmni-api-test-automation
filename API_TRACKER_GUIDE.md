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

### Step 1: Import the Helper

```javascript
import { authenticatedRequest } from "../../config/apiClient.js";
// OR for session-based APIs (after OTP login):
import { onlineAppointmentSessionRequest } from "../../config/apiClient.js";

import { trackApiCall } from "../../helpers/apiTracker.js";
```

### Step 2: Wrap Your API Calls

**Example 1: Simple GET Request**
```javascript
export async function getItems() {
  return await trackApiCall(
    () => authenticatedRequest()
      .get("api/v1/items")
      .expect(200),
    {
      method: "GET",
      endpoint: "api/v1/items"
    }
  );
}
```

**Example 2: GET with Query Parameters**
```javascript
export async function getUserById(userId) {
  return await trackApiCall(
    () => authenticatedRequest()
      .get("api/v1/users")
      .query({ id: userId })
      .expect(200),
    {
      method: "GET",
      endpoint: "api/v1/users",
      queryParams: { id: userId }
    }
  );
}
```

**Example 3: POST with Payload**
```javascript
export async function createUser(userData) {
  return await trackApiCall(
    () => authenticatedRequest()
      .post("api/v1/users")
      .send(userData)
      .expect(201),
    {
      method: "POST",
      endpoint: "api/v1/users",
      payload: userData
    }
  );
}
```

**Example 4: DELETE with Query Parameters**
```javascript
export async function deleteUser(userId) {
  return await trackApiCall(
    () => authenticatedRequest()
      .delete("api/v1/users")
      .query({ id: userId })
      .expect(200),
    {
      method: "DELETE",
      endpoint: "api/v1/users",
      queryParams: { id: userId }
    }
  );
}
```

---

## 🔐 Session-Based APIs (Online Appointment Service)

Some APIs require session cookies (e.g., after OTP login). Use `onlineAppointmentSessionRequest()` instead of `authenticatedRequest()`:

**Example: Get User Account (with session cookie)**
```javascript
import { onlineAppointmentSessionRequest } from "../../config/apiClient.js";
import { trackApiCall } from "../../helpers/apiTracker.js";

export async function getUserAccount() {
  return await trackApiCall(
    () => onlineAppointmentSessionRequest()
      .get("online-appointment-service/api/user-verification/user-account")
      .expect(200),
    {
      method: "GET",
      endpoint: "online-appointment-service/api/user-verification/user-account"
    }
  );
}
```

**Example: POST with session cookie**
```javascript
export async function createAppointment(appointmentData) {
  return await trackApiCall(
    () => onlineAppointmentSessionRequest()
      .post("online-appointment-service/api/appointments")
      .send(appointmentData)
      .expect(201),
    {
      method: "POST",
      endpoint: "online-appointment-service/api/appointments",
      payload: appointmentData
    }
  );
}
```

**When to use which?**
- `authenticatedRequest()` - For APIs using basic auth (username/password)
- `onlineAppointmentSessionRequest()` - For APIs using session cookies (after OTP login)
- `unauthenticatedRequest()` - For public APIs (like sending OTP)

---

## 📋 Complete Service File Template

```javascript
import { authenticatedRequest } from "../../config/apiClient.js";
import { trackApiCall } from "../../helpers/apiTracker.js";

const myService = {
  base: "api/v1/myservice",
};

// GET request example
export async function getAll() {
  return await trackApiCall(
    () => authenticatedRequest()
      .get(myService.base)
      .expect(200),
    {
      method: "GET",
      endpoint: myService.base
    }
  );
}

// POST request example
export async function create(data) {
  return await trackApiCall(
    () => authenticatedRequest()
      .post(myService.base)
      .send(data)
      .expect(201),
    {
      method: "POST",
      endpoint: myService.base,
      payload: data
    }
  );
}

// PUT/UPDATE request example
export async function update(id, data) {
  return await trackApiCall(
    () => authenticatedRequest()
      .put(`${myService.base}/${id}`)
      .send(data)
      .expect(200),
    {
      method: "PUT",
      endpoint: `${myService.base}/${id}`,
      payload: data
    }
  );
}

// DELETE request example
export async function remove(id) {
  return await trackApiCall(
    () => authenticatedRequest()
      .delete(myService.base)
      .query({ id: id })
      .expect(200),
    {
      method: "DELETE",
      endpoint: myService.base,
      queryParams: { id: id }
    }
  );
}
```

---

## 🧪 Using in Test Spec Files

**No changes needed!** The tracking happens automatically. Just use `addApiDetailsToReport(this)` after API calls:

```javascript
import { getItems, createItem } from "../../../src/services/myService.js";
import { addTestLog, addApiDetailsToReport } from "../../fixtures/rootHooks.js";

describe("My Service Tests", function() {
  it("should get all items", async function() {
    addTestLog(this, "Fetching all items");
    
    const response = await getItems();
    addApiDetailsToReport(this); // Add API details to HTML report
    
    expect(response.status).to.equal(200);
    addTestLog(this, `Received ${response.body.length} items`);
  });
  
  it("should create an item", async function() {
    const newItem = { name: "Test Item" };
    addTestLog(this, `Creating item: ${newItem.name}`);
    
    const response = await createItem(newItem);
    addApiDetailsToReport(this); // Add API details to HTML report
    
    expect(response.status).to.equal(201);
    addTestLog(this, `Item created with ID: ${response.body.id}`);
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

## 🔄 Migrating Existing Service Files (Optional)

If you have old service files with manual tracking, you can migrate them:

**Before (Manual Tracking - Redundant):**
```javascript
export async function getUser(id) {
  lastApiCall.method = "GET";
  lastApiCall.endpoint = `${process.env.BAHMNI_URL}/api/users`;
  lastApiCall.queryParams = { id: id };
  
  const response = await authenticatedRequest()
    .get("api/users")
    .query({ id: id })
    .expect(200);
  
  lastApiCall.statusCode = response.status;
  lastApiCall.response = response.body;
  
  return response;
}
```

**After (Using Helper - Clean!):**
```javascript
export async function getUser(id) {
  return await trackApiCall(
    () => authenticatedRequest()
      .get("api/users")
      .query({ id: id })
      .expect(200),
    {
      method: "GET",
      endpoint: "api/users",
      queryParams: { id: id }
    }
  );
}
```

**10+ lines → 3 lines! Much cleaner! 🎉**

---

## 📝 Summary

- **New service files**: Just wrap API calls with `trackApiCall()`
- **Test spec files**: Use `addApiDetailsToReport(this)` for passing tests
- **Failed tests**: Automatic - nothing to do!
- **HTML reports**: Beautiful, detailed, automatic!

**Creating new services is now EASY and CONSISTENT! ✨**
