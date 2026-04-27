import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

/**
 * GET /openmrs/ws/rest/v1/systemsetting/bahmni.encountersession.duration
 * Gets the encounter session duration configuration
 * Returns duration in minutes to determine Edit vs New consultation mode
 * 
 * @returns {Promise} Response with system setting data
 */
export async function getEncounterSessionDuration() {
  const endpoint = "openmrs/ws/rest/v1/systemsetting/bahmni.encountersession.duration";
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().get(endpoint),
    200,
    "GET",
    fullEndpoint
  );
}
