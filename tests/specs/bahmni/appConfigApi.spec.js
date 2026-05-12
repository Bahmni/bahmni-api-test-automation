import { expect } from "chai";
import { getClinicalAppConfig } from "../../../src/services/bahmni/appConfig.js";
import {
  REQUIRED_TOP_LEVEL_FIELDS,
  REQUIRED_DASHBOARD_FIELDS,
  EXPECTED_DASHBOARDS,
  REQUIRED_ALLERGY_CONCEPT_UUIDS,
  EXPECTED_INPUT_CONTROL_TYPES,
  REQUIRED_INPUT_CONTROL_FIELDS,
  MIN_EXPECTED_DASHBOARDS,
  MIN_EXPECTED_INPUT_CONTROLS,
} from "../../testdata/clinical/appConfig.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

// UI Trigger: Clinical application loads
// Business Logic: Master configuration for Clinical app (dashboards, controls, allergy mappings)
describe("Clinical App Config API - Master Application Configuration", function () {
  describe("GET /apps/clinical/v2/app.json - Validations", function () {
    // GROUP 1: Top-Level Structure

    // Test 1: Required Top-Level Fields
    it("Validate required top-level fields exist", async function () {
      const response = await getClinicalAppConfig();

      REQUIRED_TOP_LEVEL_FIELDS.forEach((field) => {
        expect(response.body).to.have.property(field);
      });

      addTestLog(this, "✓ All 5 top-level fields present");
    });

    // Test 2: Top-Level Field Types
    it("Validate top-level field types", async function () {
      const response = await getClinicalAppConfig();

      expect(response.body.patientInformation).to.be.an("object");
      expect(response.body.contextInformation).to.be.an("object");
      expect(response.body.actions).to.be.an("array");
      expect(response.body.dashboards).to.be.an("array");
      expect(response.body.consultationPad).to.be.an("object");

      addTestLog(this, "✓ All top-level fields have correct types");
    });

    // GROUP 2: Context Information

    // Test 3: Program Fields Structure
    it("Validate program context fields structure", async function () {
      const response = await getClinicalAppConfig();

      if (response.body.contextInformation?.program) {
        expect(response.body.contextInformation.program).to.have.property(
          "fields"
        );
        expect(response.body.contextInformation.program.fields).to.be.an("array");

        addTestLog(
          this,
          `✓ Program fields: ${response.body.contextInformation.program.fields.join(", ")}`
        );
      } else {
        addTestLog(this, "✓ Program context optional (not present)");
      }
    });

    // Test 4: Program Fields Are Strings
    it("Validate program fields are strings", async function () {
      const response = await getClinicalAppConfig();

      if (response.body.contextInformation?.program?.fields) {
        response.body.contextInformation.program.fields.forEach((field) => {
          expect(field).to.be.a("string").and.not.be.empty;
        });

        addTestLog(
          this,
          `✓ ${response.body.contextInformation.program.fields.length} program fields validated`
        );
      } else {
        this.skip();
      }
    });

    // GROUP 3: Dashboards

    // Test 5: Dashboards Array Exists
    it("Validate dashboards array has at least one dashboard", async function () {
      const response = await getClinicalAppConfig();

      expect(response.body.dashboards).to.be.an("array");
      expect(response.body.dashboards.length).to.be.at.least(
        MIN_EXPECTED_DASHBOARDS
      );

      addTestLog(this, `✓ Dashboards count: ${response.body.dashboards.length}`);
    });

    // Test 6: Dashboard Required Fields
    it("Validate each dashboard has required fields", async function () {
      const response = await getClinicalAppConfig();

      response.body.dashboards.forEach((dashboard) => {
        REQUIRED_DASHBOARD_FIELDS.forEach((field) => {
          expect(dashboard).to.have.property(field);
        });

        expect(dashboard.name).to.be.a("string").and.not.be.empty;
        expect(dashboard.url).to.be.a("string").and.not.be.empty;
        expect(dashboard.requiredPrivileges).to.be.an("array");
      });

      addTestLog(
        this,
        `✓ All ${response.body.dashboards.length} dashboards valid`
      );
    });

    // Test 7: Expected Dashboards Exist (STRICT)
    it("Validate expected dashboards exist", async function () {
      const response = await getClinicalAppConfig();

      const dashboardNames = response.body.dashboards.map((d) => d.name);

      EXPECTED_DASHBOARDS.forEach((expectedDashboard) => {
        expect(dashboardNames).to.include(
          expectedDashboard,
          `Missing expected dashboard: ${expectedDashboard}`
        );
      });

      addTestLog(
        this,
        `✓ All ${EXPECTED_DASHBOARDS.length} expected dashboards found`
      );
      addTestLog(this, `✓ Dashboards: ${dashboardNames.join(", ")}`);
    });

    // GROUP 4: Consultation Pad - Allergy Concept Map

    // Test 8: Allergy Concept Map Exists
    it("Validate allergyConceptMap exists", async function () {
      const response = await getClinicalAppConfig();

      expect(response.body.consultationPad).to.have.property("allergyConceptMap");
      expect(response.body.consultationPad.allergyConceptMap).to.be.an("object");

      addTestLog(this, "✓ allergyConceptMap present");
    });

    // Test 9: All Allergy UUIDs Present (CRITICAL)
    it("Validate all 4 allergy concept UUIDs are present", async function () {
      const response = await getClinicalAppConfig();

      const allergyMap = response.body.consultationPad.allergyConceptMap;

      REQUIRED_ALLERGY_CONCEPT_UUIDS.forEach((uuidField) => {
        expect(allergyMap).to.have.property(uuidField);
        expect(allergyMap[uuidField]).to.be.a("string").and.not.be.empty;
      });

      addTestLog(this, "✓ All 4 allergy concept UUIDs present and non-empty");
      addTestLog(this, `✓ UUIDs: ${REQUIRED_ALLERGY_CONCEPT_UUIDS.join(", ")}`);
    });

    // GROUP 5: Consultation Pad - Input Controls

    // Test 10: Input Controls Array Exists
    it("Validate inputControls array exists", async function () {
      const response = await getClinicalAppConfig();

      expect(response.body.consultationPad).to.have.property("inputControls");
      expect(response.body.consultationPad.inputControls).to.be.an("array");
      expect(response.body.consultationPad.inputControls.length).to.be.at.least(
        MIN_EXPECTED_INPUT_CONTROLS
      );

      addTestLog(
        this,
        `✓ Input controls count: ${response.body.consultationPad.inputControls.length}`
      );
    });

    // Test 11: All Expected Control Types Exist (STRICT)
    it("Validate all 9 expected input control types exist", async function () {
      const response = await getClinicalAppConfig();

      const inputControls = response.body.consultationPad.inputControls;
      const foundTypes = inputControls.map((control) => control.type);

      EXPECTED_INPUT_CONTROL_TYPES.forEach((expectedType) => {
        expect(foundTypes).to.include(
          expectedType,
          `Missing expected input control type: ${expectedType}`
        );
      });

      addTestLog(
        this,
        `✓ All ${EXPECTED_INPUT_CONTROL_TYPES.length} expected control types found`
      );
      addTestLog(this, `✓ Types: ${foundTypes.join(", ")}`);
    });

    // Test 12: Input Control Structure
    it("Validate input control structure", async function () {
      const response = await getClinicalAppConfig();

      response.body.consultationPad.inputControls.forEach((control) => {
        REQUIRED_INPUT_CONTROL_FIELDS.forEach((field) => {
          expect(control).to.have.property(field);
        });

        expect(control.type).to.be.a("string").and.not.be.empty;
        expect(control.encounterTypes).to.be.an("array");
        expect(control.privileges).to.be.an("array");

        // metadata and attributes are optional
        if (control.metadata) {
          expect(control.metadata).to.be.an("object");
        }
        if (control.attributes) {
          expect(control.attributes).to.be.an("array");
        }
      });

      addTestLog(
        this,
        `✓ All ${response.body.consultationPad.inputControls.length} controls have valid structure`
      );
    });

    // GROUP 6: Performance

    // Test 13: Performance Baseline
    it("Validate response time within 1000ms", async function () {
      const startTime = Date.now();
      await getClinicalAppConfig();
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1000);

      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });
});
