import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";
import { getAuthCredentials } from "../../config/authManager.js";
import supertest from "supertest";

/**
 * GET /openmrs/ws/rest/v1/session
 * Gets current user session information
 * Uses Basic Authentication from authManager
 * 
 * @param {string} customParams - Custom parameters (default: "custom:(uuid)")
 * @returns {Promise} Response with session data
 */
export async function getSession(customParams = "custom:(uuid)") {
  const endpoint = "openmrs/ws/rest/v1/session";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const queryParams = customParams ? { v: customParams } : null;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  return handleApiResponse(
    authenticatedRequest().get(endpoint).query(queryParams || {}),
    200,
    "GET",
    fullEndpoint,
    null,
    queryParams
  );
}

/**
 * POST /openmrs/ws/rest/v1/session
 * Sets the session location for the current user
 * Uses Basic Authentication from authManager
 * 
 * @param {string} locationUuid - UUID of the location to set
 * @returns {Promise} Response with updated session data
 */
export async function setSessionLocation(locationUuid) {
  const endpoint = "openmrs/ws/rest/v1/session";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const payload = { sessionLocation: locationUuid };

  lastApiCall.method = "POST";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = payload;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().post(endpoint).send(payload),
    200,
    "POST",
    fullEndpoint,
    payload
  );
}

/**
 * GET /bahmni_config/openmrs/apps/home/locale_languages.json
 * Gets available locale languages from Bahmni configuration
 * No authentication required (public config file)
 * 
 * @returns {Promise} Response with locale languages array
 */
export async function getLocaleLanguages() {
  const endpoint = "bahmni_config/openmrs/apps/home/locale_languages.json";
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    supertest.agent(config.baseURI).get(endpoint),
    200,
    "GET",
    fullEndpoint
  );
}

/**
 * POST and GET /openmrs/ws/rest/v1/session with session persistence
 * Sets session location via POST, then verifies via GET using the same agent
 * This maintains session cookies across both requests to verify persistence
 * 
 * @param {string} locationUuid - UUID of the location to set
 * @param {string} customParams - Custom parameters for GET (default: "custom:(uuid)")
 * @returns {Promise<{postResponse: Object, getResponse: Object}>} Both responses
 */
export async function setAndVerifySessionLocation(locationUuid, customParams = "custom:(uuid)") {
  const endpoint = "openmrs/ws/rest/v1/session";
  const fullEndpoint = `${config.baseURI}${endpoint}`;
  const { authUser, authPassword } = getAuthCredentials();
  
  // Create single agent to maintain session across requests
  const agent = supertest.agent(config.baseURI).auth(authUser, authPassword);
  
  // POST to set location
  const postResponse = await agent
    .post(endpoint)
    .send({ sessionLocation: locationUuid });
  
  // GET to verify (using SAME agent = same session!)
  const getResponse = await agent
    .get(endpoint)
    .query({ v: customParams });
  
  // Track the last API call (GET in this case for reporting)
  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = { v: customParams };
  
  return { postResponse, getResponse };
}
