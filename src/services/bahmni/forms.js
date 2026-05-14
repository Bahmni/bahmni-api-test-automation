import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

/**
 * GET /openmrs/ws/rest/v1/bahmniie/form/latestPublishedForms
 * Gets published forms available for clinical observations
 * Used for form selection in consultations
 * Requires authentication with 'Get Forms' privilege
 * 
 * UI Trigger: Clinical Dashboard - Forms table initialization
 * Business Logic: Provides name→UUID mapping for form loading
 * 
 * @returns {Promise} Response with array of published forms
 */
export async function getPublishedForms() {
  const endpoint = "openmrs/ws/rest/v1/bahmniie/form/latestPublishedForms";
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
    null,
    null
  );
}
