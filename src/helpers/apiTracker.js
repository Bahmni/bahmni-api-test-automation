// Centralized API tracking for all service files
// This helper eliminates redundancy and makes creating new services easy

// Global store for last API call from any service
export const lastApiCall = {};

// Wrapper function that automatically tracks API call details and captures request/response
export async function trackApiCall(apiCallFn, metadata) {
  lastApiCall.method = metadata.method;
  lastApiCall.endpoint = `${process.env.BAHMNI_URL || "https://localhost"}/${metadata.endpoint}`;
  lastApiCall.payload = metadata.payload || null;
  lastApiCall.queryParams = metadata.queryParams || null;

  const response = await apiCallFn();

  lastApiCall.statusCode = response.status;
  lastApiCall.response = response.body;

  return response;
}
