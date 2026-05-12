import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { config } from "../../config/index.js";
import { lastApiCall } from "../../helpers/apiTracker.js";

/**
 * Search for concept by fully specified name (exact match)
 * GET /openmrs/ws/rest/v1/concept?s=byFullySpecifiedName&name={conceptName}
 * 
 * UI Trigger: Clinical Dashboard load - Fetches vital sign concept UUIDs for form initialization
 *
 * @param {string} conceptName - Fully specified concept name
 * @returns {Promise} API response with concept details
 *
 */
export async function searchConceptByName(conceptName) {
  const endpoint = "openmrs/ws/rest/v1/concept";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = {
    s: "byFullySpecifiedName",
    name: conceptName,
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
