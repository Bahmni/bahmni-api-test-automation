import { authenticatedRequest } from "../../config/apiClient.js";
import { getAppointmentServiceAttributeTypeUuids } from "../openmrs/appointmentServiceAttributeTypes.js";
import { handleApiResponse } from "../../helpers/apiResponseHandler.js";
import { lastApiCall } from "../../helpers/apiTracker.js";
import { config } from "../../config/index.js";

const appointmentservice = {
  base: "openmrs/ws/rest/v1/appointmentService",
  getAll: "/all/default",
};

export async function getAllServiceDetails() {
  const fullEndpoint = `${config.baseURI}${appointmentservice.base}${appointmentservice.getAll}`;

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().get(
      `${appointmentservice.base}${appointmentservice.getAll}`,
    ),
    200,
    "GET",
    fullEndpoint,
  );
}

export async function validateIfServiceExists(serviceName) {
  const response = await getAllServiceDetails();

  const existingService = response.body.find(
    (service) => service.name.trim() === serviceName,
  );
  if (existingService) {
    console.log(`The service with name ${serviceName} already exists!!`);
    return {
      exists: true,
      uuid: existingService.uuid,
    };
  } else {
    return {
      exists: false,
      uuid: null,
    };
  }
}

export async function getServiceByUuid(serviceUuid) {
  const fullEndpoint = `${config.baseURI}${appointmentservice.base}`;
  const queryParams = { uuid: serviceUuid };

  lastApiCall.method = "GET";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  return handleApiResponse(
    authenticatedRequest().get(appointmentservice.base).query(queryParams),
    200,
    "GET",
    fullEndpoint,
    null,
    queryParams,
  );
}

export async function deleteServiceByUuid(serviceUuid) {
  const fullEndpoint = `${config.baseURI}${appointmentservice.base}`;
  const queryParams = { uuid: serviceUuid };

  lastApiCall.method = "DELETE";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = null;
  lastApiCall.queryParams = queryParams;

  return handleApiResponse(
    authenticatedRequest().delete(appointmentservice.base).query(queryParams),
    200,
    "DELETE",
    fullEndpoint,
    null,
    queryParams,
  );
}

export async function updateServicePayloadWithAttributeTypeUuids(payload) {
  const attributeTypeUuids = await getAppointmentServiceAttributeTypeUuids();
  const servicePayload = JSON.parse(JSON.stringify(payload));
  servicePayload.attributes[0].attributeTypeUuid =
    attributeTypeUuids["Availability Start Day Offset"];
  servicePayload.attributes[1].attributeTypeUuid =
    attributeTypeUuids["Availability End Day Offset"];
  servicePayload.attributes[2].attributeTypeUuid =
    attributeTypeUuids["Servicing Country"];

  return servicePayload;
}

export async function createService(payload) {
  const servicePayload =
    await updateServicePayloadWithAttributeTypeUuids(payload);
  const fullEndpoint = `${config.baseURI}${appointmentservice.base}`;

  lastApiCall.method = "POST";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = servicePayload;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().post(appointmentservice.base).send(servicePayload),
    200,
    "POST",
    fullEndpoint,
    servicePayload,
  );
}

export async function updateService(uuid, payload) {
  const servicePayload =
    await updateServicePayloadWithAttributeTypeUuids(payload);
  servicePayload.uuid = uuid;
  const fullEndpoint = `${config.baseURI}${appointmentservice.base}`;

  lastApiCall.method = "POST";
  lastApiCall.endpoint = fullEndpoint;
  lastApiCall.payload = servicePayload;
  lastApiCall.queryParams = null;

  return handleApiResponse(
    authenticatedRequest().post(appointmentservice.base).send(servicePayload),
    200,
    "POST",
    fullEndpoint,
    servicePayload,
  );
}
