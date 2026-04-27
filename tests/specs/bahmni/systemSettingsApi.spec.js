import { expect } from "chai";
import { getEncounterSessionDuration } from "../../../src/services/openmrs/systemSettings.js";
import {
  setAuthCredentials,
  resetAuthCredentials,
} from "../../../src/config/authManager.js";
import { unauthenticatedRequest } from "../../../src/config/apiClient.js";
import { bahmniUserCredentials } from "../../testdata/credentials/bahmniUserCredentials.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

describe("System Settings API - Encounter Session Duration", function () {
  describe("GET /systemsetting/bahmni.encountersession.duration - Validations", function () {
    // Validation 1: Response structure
    it("Should return valid system setting structure", async function () {
      const response = await getEncounterSessionDuration();

      expect(response.body).to.have.property("uuid");
      expect(response.body).to.have.property("property");
      expect(response.body).to.have.property("value");
      expect(response.body).to.have.property("display");

      addTestLog(this, "✓ Response structure valid");
    });

    // Validation 2: Property name
    it("Should have correct property name", async function () {
      const response = await getEncounterSessionDuration();

      expect(response.body.property).to.equal(
        "bahmni.encountersession.duration"
      );

      addTestLog(this, "✓ Property name matches exactly");
    });

    // Validation 3: UUID format
    it("Should have valid UUID", async function () {
      const response = await getEncounterSessionDuration();

      expect(response.body.uuid).to.exist;
      expect(response.body.uuid).to.be.a("string");

      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(response.body.uuid).to.match(uuidRegex);

      addTestLog(this, `✓ Valid UUID: ${response.body.uuid}`);
    });

    // Validation 4: Response time
    it("Should respond within 200ms", async function () {
      const startTime = Date.now();
      await getEncounterSessionDuration();
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(200);

      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });

    // Validation 5: Value type and format
    it("Should have value as string with digits only", async function () {
      const response = await getEncounterSessionDuration();

      expect(response.body.value).to.exist;
      expect(response.body.value).to.be.a("string");
      expect(response.body.value).to.not.be.empty;
      expect(response.body.value).to.match(/^\d+$/);

      addTestLog(this, `✓ Value is string: "${response.body.value}"`);
    });

    // Validation 6: Value is numeric
    it("Should have value parseable to valid number", async function () {
      const response = await getEncounterSessionDuration();

      const numericValue = Number(response.body.value);

      expect(numericValue).to.not.be.NaN;
      expect(numericValue).to.be.finite;
      expect(numericValue).to.be.a("number");

      addTestLog(this, `✓ Numeric value: ${numericValue} minutes`);
    });

    // Validation 8: Global setting - consistent across users
    it("Should return same value for different users (global setting)", async function () {
      // Get with doctor
      setAuthCredentials(
        bahmniUserCredentials.doctor.username,
        bahmniUserCredentials.doctor.password
      );
      const response1 = await getEncounterSessionDuration();

      // Get with receptionist
      setAuthCredentials(
        bahmniUserCredentials.receptionist.username,
        bahmniUserCredentials.receptionist.password
      );
      const response2 = await getEncounterSessionDuration();


      expect(response1.body.value).to.equal(response2.body.value);
      expect(response1.body.uuid).to.equal(response2.body.uuid);

      resetAuthCredentials();

      addTestLog(
        this,
        `✓ Global setting confirmed: ${response1.body.value} minutes`
      );
      addTestLog(this, "✓ Same value for all users");
    });
  });
});
