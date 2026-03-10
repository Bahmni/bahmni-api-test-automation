// Centralized API tracking for all service files
// This helper eliminates redundancy and makes creating new services easy

// Global store for last API call from any service
export const lastApiCall = {};

/**
 * Wrapper function that automatically tracks API call details
 * @param {Function} apiCallFn - The supertest API call function
 * @param {Object} metadata - Metadata about the API call
 * @param {string} metadata.method - HTTP method (GET, POST, DELETE, etc.)
 * @param {string} metadata.endpoint - API endpoint path
 * @param {Object} [metadata.payload] - Request payload for POST/PUT
 * @param {Object} [metadata.queryParams] - Query parameters for GET/DELETE
 * @returns {Promise<Response>} - The API response
 */
export async function trackApiCall(apiCallFn, metadata) {
  // Capture API call details BEFORE making the request
  lastApiCall.method = metadata.method;
  lastApiCall.endpoint = `${process.env.BAHMNI_URL || "https://localhost"}/${metadata.endpoint}`;
  lastApiCall.payload = metadata.payload || null;
  lastApiCall.queryParams = metadata.queryParams || null;

  // Execute the actual API call
  const response = await apiCallFn();

  // Capture response details AFTER receiving the response
  lastApiCall.statusCode = response.status;
  lastApiCall.response = response.body;

  return response;
}
