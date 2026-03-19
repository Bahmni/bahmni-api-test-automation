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
import { addTestLog, addApiDetailsToReport } from "../../fixtures/rootHooks.js";

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

    addTestLog(
      this,
      `Setting credentials for user: ${bahmniUserCredentials.appointmentService.username}`,
    );
    setAuthCredentials(
      bahmniUserCredentials.appointmentService.username,
      bahmniUserCredentials.appointmentService.password,
    );

    addTestLog(
      this,
      `Creating appointment service: ${appointmentServicePayload.name}`,
    );
    const response = await createService(appointmentServicePayload);
    addApiDetailsToReport(this); // Add API details to report

    expect(response.body)
      .to.have.property("name")
      .to.equal(appointmentServicePayload.name);
    addTestLog(this, `Verified service name: ${response.body.name}`);

    expect(response.body).to.have.property("uuid").to.exist;
    serviceUuid = response.body.uuid;
    addTestLog(this, `Service UUID: ${serviceUuid}`);

    expect(response.body).to.have.property("appointmentServiceId").to.exist;
    appointmentServiceId = response.body.appointmentServiceId;
    addTestLog(this, `Service ID: ${appointmentServiceId}`);
  });

  it("Validation updation of Service Slots with a user having Service availability privilege", async function () {
    await checkPrivilegesOrSkip(
      this,
      bahmniUserCredentials.serviceAvailability.username,
      userPrivilegeCustomParams,
      bahmniUserCredentials.serviceAvailability.expected_privileges,
    );

    addTestLog(
      this,
      `Setting credentials for user: ${bahmniUserCredentials.serviceAvailability.username}`,
    );
    setAuthCredentials(
      bahmniUserCredentials.serviceAvailability.username,
      bahmniUserCredentials.serviceAvailability.password,
    );

    addTestLog(this, `Updating service slots for UUID: ${serviceUuid}`);
    const response = await updateService(
      serviceUuid,
      updateServiceAvailabilityPayload,
    );
    addApiDetailsToReport(this); // Add API details to report

    expect(response.body)
      .to.have.property("appointmentServiceId")
      .to.equal(appointmentServiceId);
    addTestLog(
      this,
      `Verified appointment service ID: ${appointmentServiceId}`,
    );

    expect(response.body)
      .to.have.property("name")
      .to.equal(updateServiceAvailabilityPayload.name);
    addTestLog(this, `Verified service name updated to: ${response.body.name}`);
  });

  it("Validate deletion of Service with a user having manage service privilege", async function () {
    await checkPrivilegesOrSkip(
      this,
      bahmniUserCredentials.appointmentService.username,
      userPrivilegeCustomParams,
      bahmniUserCredentials.appointmentService.expected_privileges,
    );

    addTestLog(
      this,
      `Setting credentials for user: ${bahmniUserCredentials.appointmentService.username}`,
    );
    setAuthCredentials(
      bahmniUserCredentials.appointmentService.username,
      bahmniUserCredentials.appointmentService.password,
    );

    addTestLog(this, `Deleting service with UUID: ${serviceUuid}`);
    const response = await deleteServiceByUuid(serviceUuid);
    addApiDetailsToReport(this); // Add API details to report

    expect(response.body)
      .to.have.property("appointmentServiceId")
      .to.equal(appointmentServiceId);
    addTestLog(this, `Verified deleted service ID: ${appointmentServiceId}`);
  });
});
