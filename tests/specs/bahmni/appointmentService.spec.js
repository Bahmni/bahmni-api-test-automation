import {
  createService,
  validateIfServiceExists,
  deleteServiceByUuid,
  updateService,
} from "../../../src/services/openmrs/appointmentService.js";
import {
  setAuthCredentials,
  resetAuthCredentials,
} from "../../../src/config/authManager.js";
import { appointmentServicePayload } from "../../testdata/payloads/bahmni/createServicePayload.js";
import { appointmentServicePayload as updateServiceAvailabilityPayload } from "../../testdata/payloads/bahmni/updateServiceAvailabilityPayload.js";
import { bahmniUserCredentials } from "../../testdata/credentials/bahmniUserCredentials.js";
import { checkPrivilegesOrSkip } from "../../fixtures/testHelpers.js";

describe("Test Appointment Service API", function () {
  const userPrivilegeCustomParams = "custom:(username,privileges:(name))";
  let serviceUuid = "";
  let appointmentServiceId = "";

  before(async function () {
    const serviceName = appointmentServicePayload.name;
    const serviceCheck = await validateIfServiceExists(serviceName);

    if (serviceCheck.exists) {
      await deleteServiceByUuid(serviceCheck.uuid);
    }
  });

  afterEach(function () {
    resetAuthCredentials();
  });

  it("Validate creation of Service with a user having manage service privilege", async function () {
    await checkPrivilegesOrSkip(
      this,
      bahmniUserCredentials.appointmentService.username,
      userPrivilegeCustomParams,
      bahmniUserCredentials.appointmentService.expected_privileges,
    );

    setAuthCredentials(
      bahmniUserCredentials.appointmentService.username,
      bahmniUserCredentials.appointmentService.password,
    );

    const response = await createService(appointmentServicePayload);

    expect(response.body)
      .to.have.property("name")
      .to.equal(appointmentServicePayload.name);
    expect(response.body).to.have.property("uuid").to.exist;
    serviceUuid = response.body.uuid;
    expect(response.body).to.have.property("appointmentServiceId").to.exist;
    appointmentServiceId = response.body.appointmentServiceId;
  });

  it("Validation updation of Service Slots with a user having Service availability privilege", async function () {
    await checkPrivilegesOrSkip(
      this,
      bahmniUserCredentials.serviceAvailability.username,
      userPrivilegeCustomParams,
      bahmniUserCredentials.serviceAvailability.expected_privileges,
    );

    setAuthCredentials(
      bahmniUserCredentials.serviceAvailability.username,
      bahmniUserCredentials.serviceAvailability.password,
    );

    const response = await updateService(
      serviceUuid,
      updateServiceAvailabilityPayload,
    );

    expect(response.body)
      .to.have.property("appointmentServiceId")
      .to.equal(appointmentServiceId);
    expect(response.body)
      .to.have.property("name")
      .to.equal(updateServiceAvailabilityPayload.name);
  });

  it("Validate deletion of Service with a user having manage service privilege", async function () {
    await checkPrivilegesOrSkip(
      this,
      bahmniUserCredentials.appointmentService.username,
      userPrivilegeCustomParams,
      bahmniUserCredentials.appointmentService.expected_privileges,
    );

    setAuthCredentials(
      bahmniUserCredentials.appointmentService.username,
      bahmniUserCredentials.appointmentService.password,
    );

    const response = await deleteServiceByUuid(serviceUuid);
    expect(response.body)
      .to.have.property("appointmentServiceId")
      .to.equal(appointmentServiceId);
  });
});
