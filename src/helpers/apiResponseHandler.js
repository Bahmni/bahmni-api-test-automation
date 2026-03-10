import { lastApiCall } from "./apiTracker.js";

/**
 * Helper function to log API request details to console
 * @param {string} method - HTTP method
 * @param {string} fullEndpoint - Complete endpoint URL
 * @param {Object} payload - Request payload
 * @param {Object} queryParams - Query parameters
 */
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

/**
 * Shared helper to get HTTP status text
 * @param {number} status - HTTP status code
 * @returns {string} - Status text description
 */
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

/**
 * Shared helper to build detailed error message
 * @param {Error} error - The error object
 * @param {string} method - HTTP method
 * @param {string} endpoint - Full endpoint URL
 * @param {Object} payload - Request payload
 * @param {Object} queryParams - Query parameters
 * @returns {Error} - Enhanced error with details
 */
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
  
  // Always include response body if available - KEY FOR MOCHAWESOME REPORT
  if (error.response?.body) {
    errorDetails += `\n📄 Response Body:\n${JSON.stringify(error.response.body, null, 2)}\n`;
  } else if (error.response?.text) {
    errorDetails += `\n📄 Response Text:\n${error.response.text}\n`;
  }
  
  errorDetails += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
  
  console.error(errorDetails);
  
  // Store in lastApiCall for Mochawesome report
  if (error.response?.body) {
    lastApiCall.response = error.response.body;
    lastApiCall.statusCode = error.status;
  }
  
  // Enhance error message for test report
  const originalMessage = error.message || 'API request failed';
  error.message = originalMessage + errorDetails;
  
  return error;
}

/**
 * Universal API response handler - captures response body BEFORE status validation
 * Works with any HTTP method (GET, POST, PUT, DELETE, etc.)
 * Ensures response bodies are ALWAYS captured in HTML reports, even on failures
 * 
 * @param {Promise} requestPromise - The supertest request promise
 * @param {number} expectedStatus - Expected HTTP status code
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} fullEndpoint - Complete endpoint URL for error reporting
 * @param {Object} payload - Request payload (for POST/PUT)
 * @param {Object} queryParams - Query parameters (for GET/DELETE)
 * @returns {Promise<Response>} - The API response
 * 
 * @example
 * // GET request
 * return handleApiResponse(
 *   apiClient.get(endpoint).query(params),
 *   200,
 *   'GET',
 *   fullEndpointUrl,
 *   null,
 *   params
 * );
 * 
 * @example
 * // POST request
 * return handleApiResponse(
 *   apiClient.post(endpoint).send(payload),
 *   200,
 *   'POST',
 *   fullEndpointUrl,
 *   payload
 * );
 */
export async function handleApiResponse(requestPromise, expectedStatus, method, fullEndpoint, payload = null, queryParams = null) {
  // Log the request BEFORE making it
  logRequest(method, fullEndpoint, payload, queryParams);
  
  const response = await requestPromise;
  
  // CRITICAL: Capture response details BEFORE checking status
  // This ensures data is available in Mochawesome HTML report even on failures
  lastApiCall.response = response.body;
  lastApiCall.statusCode = response.status;
  lastApiCall.responseHeaders = response.headers;
  
  // Validate status code
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
