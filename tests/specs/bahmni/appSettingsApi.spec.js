import { expect } from "chai";
import { getAppSettings } from "../../../src/services/openmrs/appSettings.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

describe("App Settings API - Bahmni Commons Module", function () {
  describe("GET /bahmni/app/setting?module=commons - Validations", function () {
    // Validation 1: Response is array
    it("Should return array of settings", async function () {
      const response = await getAppSettings();

      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);

      addTestLog(this, `✓ Settings count: ${response.body.length}`);
    });

    // Validation 2: Each setting has property and value fields
    it("Should have property and value fields for each setting", async function () {
      const response = await getAppSettings();

      response.body.forEach((setting) => {
        expect(setting).to.have.property("property");
        expect(setting).to.have.property("value");
      });

      addTestLog(this, "✓ All settings have property and value fields");
    });

    // Validation 3: Response time
    it("Should respond within 200ms", async function () {
      const startTime = Date.now();
      await getAppSettings();
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(200);

      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });

    // Validation 4: default_locale value
    it("Should have 'default_locale' with value 'en'", async function () {
      const response = await getAppSettings();

      const setting = response.body.find((s) => s.property === "default_locale");

      expect(setting).to.exist;
      expect(setting.value).to.equal("en");

      addTestLog(this, `✓ default_locale: "${setting.value}"`);
    });

    // Validation 5: bahmni.enableAuditLog value
    it("Should have 'bahmni.enableAuditLog' with value 'true'", async function () {
      const response = await getAppSettings();

      const setting = response.body.find(
        (s) => s.property === "bahmni.enableAuditLog"
      );

      expect(setting).to.exist;
      expect(setting.value).to.equal("true");

      addTestLog(this, `✓ bahmni.enableAuditLog: "${setting.value}"`);
    });

    // Validation 6: default_dateFormat value
    it("Should have 'default_dateFormat' with value 'dd-MMM-yyyy'", async function () {
      const response = await getAppSettings();

      const setting = response.body.find(
        (s) => s.property === "default_dateFormat"
      );

      expect(setting).to.exist;
      expect(setting.value).to.equal("dd-MMM-yyyy");

      addTestLog(this, `✓ default_dateFormat: "${setting.value}"`);
    });
  });
});
