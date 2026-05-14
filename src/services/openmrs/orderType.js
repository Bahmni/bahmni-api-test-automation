import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

/**
 * GET /openmrs/ws/rest/v1/ordertype?v=custom:(uuid,display,conceptClasses:(uuid,name))
 * Gets order types with their associated concept classes
 * Used for categorizing clinical orders (Lab, Drug, Radiology, etc.)
 * Requires authentication with 'Get Order Types' privilege
 * 
 * UI Trigger: Clinical Dashboard - Investigations form initialization
 * Business Logic: Maps concept classes to order types for investigation categorization
 * 
 * @returns {Promise} Response with array of order types in 'results' key
 */
export async function getOrderTypes() {
  const endpoint = "openmrs/ws/rest/v1/ordertype";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = {
    v: "custom:(uuid,display,conceptClasses:(uuid,name))",
  };

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
    queryParams
  );
}
