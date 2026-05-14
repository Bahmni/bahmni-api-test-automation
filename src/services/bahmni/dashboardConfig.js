import { config } from "../../config/index.js";
import { lastApiCall } from "../../helpers/apiTracker.js";

/**
 * GET /bahmni_config/openmrs/apps/clinical/v2/dashboards/eocDashboard.json
 * Gets Episode of Care (EOC) dashboard configuration
 * Defines sections, controls, and layout for clinical dashboard
 * 
 * UI Trigger: Clinical Dashboard page loads
 * Business Logic: Provides blueprint for dashboard structure
 *   - Sections (Allergies, Labs, Radiology, Forms, etc.)
 *   - Controls (widgets to display data)
 *   - Icons and translations
 *   - User privilege filtering
 * 
 * Note: This is a static config file, not a REST API endpoint
 * 
 * @returns {Promise} Response with dashboard configuration JSON
 */
export async function getEOCDashboardConfig() {
  const endpoint =
    "bahmni_config/openmrs/apps/clinical/v2/dashboards/eocDashboard.json";
  const fullEndpoint = `${config.baseURI}${endpoint}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  // Direct fetch since this is a config file, not a REST API
  const response = await fetch(fullEndpoint);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch dashboard config: ${response.status} ${response.statusText}`
    );
  }

  const body = await response.json();

  return {
    status: response.status,
    body: body,
  };
}
