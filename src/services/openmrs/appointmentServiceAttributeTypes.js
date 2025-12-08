import { authenticatedRequest } from "../../config/apiClient.js";

export const attributeTypes = {
  basepath: "openmrs/ws/rest/v1/appointment-service-attribute-types",
};

export async function getAppointmentServiceAttributeTypes() {
  const response = await authenticatedRequest()
    .get(attributeTypes.basepath)
    .expect(200);

  return response;
}

export async function getAppointmentServiceAttributeTypeUuids() {
  const response = await getAppointmentServiceAttributeTypes();

  const attributeTypeUuids = {};
  response.body.forEach((attribute) => {
    attributeTypeUuids[attribute.name] = attribute.uuid;
  });

  return attributeTypeUuids;
}
