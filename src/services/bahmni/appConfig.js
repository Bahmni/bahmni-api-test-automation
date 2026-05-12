import { config } from "../../config/index.js";
import { lastApiCall } from "../../helpers/apiTracker.js";

/**
 * GET /bahmni_config/openmrs/apps/clinical/v2/app.json
 * Gets Clinical application master configuration
 * Defines dashboards, consultation pad controls, allergy mappings, program context
 * 
 * UI Trigger: Clinical application loads
 * Business Logic: Master config for entire Clinical app
 *   - Available dashboards (General, EOC)
 *   - Consultation pad input controls (9 types)
 *   - Allergy concept UUID mappings (4 types)
 *   - Program context fields
 *   - Actions configuration
 * 
 * Note: This is a static config file, not a REST API endpoint
 * 
 * @returns {Promise} Response with application configuration JSON
 */
export async function getClinicalAppConfig() {
  const endpoint = "bahmni_config/openmrs/apps/clinical/v2/app.json";
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  // Direct fetch since this is a config file, not a REST API
  const response = await fetch(fullEndpoint);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch app config: ${response.status} ${response.statusText}`
    );
  }

  const body = await response.json();

  return {
    status: response.status,
    body: body,
  };
}
