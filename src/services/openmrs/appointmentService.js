import { authenticatedRequest } from "../../config/apiClient.js";
import { getAppointmentServiceAttributeTypeUuids } from "../openmrs/appointmentServiceAttributeTypes.js"

export const appointmentservice = {
        base: 'openmrs/ws/rest/v1/appointmentService',
        getAll: '/all/default'
    }

export async function getAllServiceDetails() {
    const response = await authenticatedRequest().get(`${appointmentservice.base}${appointmentservice.getAll}`)
        .expect(200);
    
    return response;
}

export async function validateIfServiceExists(serviceName) {
    const response = await getAllServiceDetails();
    
    const existingService = response.body.find(service => service.name.trim() === serviceName);
    if (existingService) {
        console.log(`The service with name ${serviceName} already exists!!`);
        return {
            exists: true,
            uuid: existingService.uuid
        }
    } else {
        return {
            exists: false,
            uuid: null
        }
    }

}

export async function deleteServiceByUuid(serviceUuid) {
    const response = await authenticatedRequest().delete(appointmentservice.base)
    .query({uuid:serviceUuid})
    .expect(200);

    return response
}

export async function updateServicePayloadWithAttributeTypeUuids(payload) {
    const attributeTypeUuids = await getAppointmentServiceAttributeTypeUuids();
    const servicePayload = JSON.parse(JSON.stringify(payload));
    servicePayload.attributes[0].attributeTypeUuid = attributeTypeUuids["Availability Start Day Offset"];
    servicePayload.attributes[1].attributeTypeUuid = attributeTypeUuids["Availability End Day Offset"];
    servicePayload.attributes[2].attributeTypeUuid = attributeTypeUuids["Servicing Country"];

    return servicePayload;
}

export async function createService(payload) {
    const servicePayload = await updateServicePayloadWithAttributeTypeUuids(payload);

    const response = await authenticatedRequest().post(appointmentservice.base)
        .send(servicePayload)
        .expect(200);

    return response;
}

export async function updateService(uuid, payload) {
    const servicePayload = await updateServicePayloadWithAttributeTypeUuids(payload);
    servicePayload.uuid = uuid;
    const response = await authenticatedRequest().post(appointmentservice.base)
        .send(servicePayload)
        .expect(200);

    return response;
}

