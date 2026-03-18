import { lastApiCall } from "./apiTracker.js";

// Helper function to log API request details to console
function logRequest(method, fullEndpoint, payload = null, queryParams = null) {
  console.log('\n📤 API Request:');
  console.log('   Method:', method);
  console.log('   Endpoint:', fullEndpoint);
  
  if (queryParams) {
    console.log('   Query Params:', JSON.stringify(queryParams, null, 2));
  }
  
  if (payload) {
    console.log('   Payload:', JSON.stringify(payload, null, 2));
  }
}

// Helper to get HTTP status text description from status code
function getStatusText(status) {
  const statusTexts = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error'
  };
  return statusTexts[status] || 'Unknown';
}

// Helper to build detailed error message with request context
function buildErrorDetails(error, method, endpoint, payload = null, queryParams = null) {
  let errorDetails = '\n\n━━━━━━━━━━━━━━━━━━━━━━ API REQUEST FAILED ━━━━━━━━━━━━━━━━━━━━━━\n';
  errorDetails += `📍 Method: ${method}\n`;
  errorDetails += `🔗 Endpoint: ${endpoint}\n`;
  
  if (queryParams) {
    errorDetails += `🔍 Query Parameters:\n${JSON.stringify(queryParams, null, 2)}\n`;
  }
  
  if (payload) {
    errorDetails += `📦 Request Payload:\n${JSON.stringify(payload, null, 2)}\n`;
  }
  
  errorDetails += `\n❌ Status Code: ${error.status || 'N/A'}\n`;
  
  if (error.response?.body) {
    errorDetails += `\n📄 Response Body:\n${JSON.stringify(error.response.body, null, 2)}\n`;
  } else if (error.response?.text) {
    errorDetails += `\n📄 Response Text:\n${error.response.text}\n`;
  }
  
  errorDetails += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  console.error(errorDetails);
  
  if (error.response?.body) {
    lastApiCall.response = error.response.body;
    lastApiCall.statusCode = error.status;
  }
  
  const originalMessage = error.message || 'API request failed';
  error.message = originalMessage + errorDetails;
  
  return error;
}

// Universal API response handler that captures response body before status validation
// Works with any HTTP method and ensures response bodies are captured in HTML reports, even on failures
export async function handleApiResponse(requestPromise, expectedStatus, method, fullEndpoint, payload = null, queryParams = null) {
  logRequest(method, fullEndpoint, payload, queryParams);
  
  const response = await requestPromise;
  
  lastApiCall.response = response.body;
  lastApiCall.statusCode = response.status;
  lastApiCall.responseHeaders = response.headers;
  
  if (response.status !== expectedStatus) {
    const error = new Error(
      `expected ${expectedStatus} "${getStatusText(expectedStatus)}", got ${response.status} "${response.statusText || getStatusText(response.status)}"`
    );
    error.status = response.status;
    error.response = response;
    throw buildErrorDetails(error, method, fullEndpoint, payload, queryParams);
  }
  
  return response;
}
