import { authenticatedRequest } from "../../config/apiClient.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";

export const attributeTypes = {
  basepath: "openmrs/ws/rest/v1/appointment-service-attribute-types",
};

export async function getAppointmentServiceAttributeTypes() {
  const fullEndpoint = `${process.env.BAHMNI_URL || "https://localhost"}/${attributeTypes.basepath}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().get(attributeTypes.basepath),
    200,
    "GET",
    fullEndpoint,
  );
}

export async function getAppointmentServiceAttributeTypeUuids() {
  const response = await getAppointmentServiceAttributeTypes();

  const attributeTypeUuids = {};
  response.body.forEach((attribute) => {
    attributeTypeUuids[attribute.name] = attribute.uuid;
  });

  return attributeTypeUuids;
}
