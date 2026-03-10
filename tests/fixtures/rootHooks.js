import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
import { lastApiCall } from "../../src/helpers/apiTracker.js";
import addContext from "mochawesome/addContext.js";

// Disable SSL certificate validation for test environments with self-signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

use(chaiAsPromised);

// Export helper function for adding custom log messages to the report
export function addTestLog(testContext, message) {
  addContext(testContext, `✅ ${message}`);
}

// Export helper function to add API details to the report
export function addApiDetailsToReport(testContext) {
  if (lastApiCall && lastApiCall.method) {
    addContext(testContext, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addContext(testContext, '📡 API REQUEST & RESPONSE DETAILS');
    addContext(testContext, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    addContext(testContext, `📍 Method: ${lastApiCall.method}`);
    addContext(testContext, `🔗 Endpoint: ${lastApiCall.endpoint}`);
    
    if (lastApiCall.queryParams && Object.keys(lastApiCall.queryParams).length > 0) {
      addContext(testContext, '\n🔍 Query Parameters:');
      addContext(testContext, JSON.stringify(lastApiCall.queryParams, null, 2));
    }
    
    if (lastApiCall.payload) {
      addContext(testContext, '\n📦 Request Payload:');
      addContext(testContext, JSON.stringify(lastApiCall.payload, null, 2));
    }
    
    if (lastApiCall.statusCode) {
      addContext(testContext, `\n✅ Status Code: ${lastApiCall.statusCode}`);
    }
    
    if (lastApiCall.response) {
      addContext(testContext, '\n📄 Response Body:');
      const responseStr = JSON.stringify(lastApiCall.response, null, 2);
      if (responseStr.length > 5000) {
        addContext(testContext, responseStr.substring(0, 5000) + '\n... (response truncated)');
      } else {
        addContext(testContext, responseStr);
      }
    }
    
    addContext(testContext, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

// Store original expect
const originalExpect = expect;

// Create enhanced expect that includes API details on failure
global.expect = function (...args) {
  const assertion = originalExpect(...args);
  
  // Wrap the 'equal' method to add API details on failure
  const originalEqual = assertion.equal;
  assertion.equal = function (expected, message) {
    try {
      return originalEqual.call(this, expected, message);
    } catch (error) {
      // Add API details to error message synchronously
      if (lastApiCall && lastApiCall.method) {
        let apiDetailsText = '\n\n━━━━━━━━━━━━━━━━━━━━━━ API REQUEST DETAILS ━━━━━━━━━━━━━━━━━━━━━━\n';
        apiDetailsText += `📍 Method: ${lastApiCall.method}\n`;
        apiDetailsText += `🔗 Endpoint: ${lastApiCall.endpoint}\n`;
        
        if (lastApiCall.queryParams) {
          apiDetailsText += `\n🔍 Query Parameters:\n${JSON.stringify(lastApiCall.queryParams, null, 2)}\n`;
        }
        
        if (lastApiCall.payload) {
          apiDetailsText += `\n📦 Request Payload:\n${JSON.stringify(lastApiCall.payload, null, 2)}\n`;
        }
        
        if (lastApiCall.response) {
          apiDetailsText += `\n📄 Response Body:\n${JSON.stringify(lastApiCall.response, null, 2)}\n`;
        }
        
        apiDetailsText += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
        
        error.message = error.message + apiDetailsText;
      }
      
      throw error;
    }
  };
  
  return assertion;
};

// Global afterEach hook to capture API details in HTML report  
export const mochaHooks = {
  afterEach() {
    // Add API request details to mochawesome report context for all tests
    if (lastApiCall && lastApiCall.method) {
      // Call our helper function to add API details
      addApiDetailsToReport(this);
    }
  }
};
