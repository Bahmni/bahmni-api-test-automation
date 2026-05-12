import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

/**
 * API 14 & 15 - Fetches ValueSet with expanded concepts for dropdown population
 * UI Trigger: Clinical → New Consultation → Allergies section load
 * 
 * GET /openmrs/ws/fhir2/R4/ValueSet/{uuid}/$expand
 * 
 * @param {string} valueSetUuid - UUID of the ValueSet to fetch and expand
 * @returns {Promise} Response with expanded ValueSet containing all concepts
 */
export async function fetchValueSet(valueSetUuid) {
  const endpoint = `openmrs/ws/fhir2/R4/ValueSet/${valueSetUuid}/$expand`;
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
