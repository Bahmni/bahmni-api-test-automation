import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

/**
 * GET /openmrs/ws/rest/v1/bahmni/app/setting?module=commons
 * Gets Bahmni app settings for commons module
 * Requires authentication with 'Get Global Properties' privilege
 * 
 * @returns {Promise} Response with array of settings
 */
export async function getAppSettings() {
  const endpoint = "openmrs/ws/rest/v1/bahmni/app/setting";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = { module: "commons" };

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
