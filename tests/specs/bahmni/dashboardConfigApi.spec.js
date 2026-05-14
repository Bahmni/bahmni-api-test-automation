import { expect } from "chai";
import { getEOCDashboardConfig } from "../../../src/services/bahmni/dashboardConfig.js";
import {
  REQUIRED_FIELDS,
  REQUIRED_SECTION_FIELDS,
  REQUIRED_CONTROL_FIELDS,
  EXPECTED_SECTIONS,
  EXPECTED_CONTROL_TYPES,
  MIN_EXPECTED_SECTIONS,
} from "../../testdata/clinical/dashboardConfig.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

// UI Trigger: Clinical Dashboard loads
// Business Logic: Provides blueprint for dashboard structure (sections, controls, layout)
describe("EOC Dashboard Config API - Clinical Dashboard Blueprint", function () {
  describe("GET /dashboards/eocDashboard.json - Validations", function () {
    // Test 1: Top-Level Structure
    it("Validate response has sections array", async function () {
      const response = await getEOCDashboardConfig();

      REQUIRED_FIELDS.forEach((field) => {
        expect(response.body).to.have.property(field);
      });

      expect(response.body.sections).to.be.an("array");

      addTestLog(this, `✓ Sections count: ${response.body.sections.length}`);
    });

    // Test 2: Section Structure
    it("Validate each section has required fields", async function () {
      const response = await getEOCDashboardConfig();

      response.body.sections.forEach((section) => {
        REQUIRED_SECTION_FIELDS.forEach((field) => {
          expect(section).to.have.property(field);
        });
      });

      addTestLog(
        this,
        `✓ All ${response.body.sections.length} sections have required fields`
      );
    });

    // Test 3: Section Field Types
    it("Validate section field types", async function () {
      const response = await getEOCDashboardConfig();

      response.body.sections.forEach((section) => {
        expect(section.name).to.be.a("string").and.not.be.empty;
        expect(section.translationKey).to.be.a("string");
        expect(section.icon).to.be.a("string").and.not.be.empty;
        expect(section.controls).to.be.an("array");
      });

      addTestLog(this, "✓ All section fields have correct types");
    });

    // Test 4: Controls Structure
    it("Validate each section has at least one control", async function () {
      const response = await getEOCDashboardConfig();

      response.body.sections.forEach((section) => {
        expect(section.controls.length).to.be.at.least(1);

        section.controls.forEach((control) => {
          REQUIRED_CONTROL_FIELDS.forEach((field) => {
            expect(control).to.have.property(field);
          });
        });
      });

      addTestLog(this, "✓ All sections have valid controls");
    });

    // Test 5: Control Types Validation (STRICT - All 8 must exist)
    it("Validate all expected control types exist", async function () {
      const response = await getEOCDashboardConfig();

      // Collect all unique control types
      const foundControlTypes = [
        ...new Set(
          response.body.sections.flatMap((section) =>
            section.controls.map((control) => control.type)
          )
        ),
      ];

      // Validate ALL expected types exist (strict check)
      EXPECTED_CONTROL_TYPES.forEach((expectedType) => {
        expect(foundControlTypes).to.include(
          expectedType,
          `Missing expected control type: ${expectedType}`
        );
      });

      addTestLog(
        this,
        `✓ All ${EXPECTED_CONTROL_TYPES.length} expected control types found`
      );
      addTestLog(this, `✓ Found types: ${foundControlTypes.join(", ")}`);

      // Extra types are allowed (future additions)
      if (foundControlTypes.length > EXPECTED_CONTROL_TYPES.length) {
        const extraTypes = foundControlTypes.filter(
          (type) => !EXPECTED_CONTROL_TYPES.includes(type)
        );
        addTestLog(this, `✓ Additional types allowed: ${extraTypes.join(", ")}`);
      }
    });

    // Test 6: Icon Format
    it("Validate icon format", async function () {
      const response = await getEOCDashboardConfig();

      response.body.sections.forEach((section) => {
        expect(section.icon).to.be.a("string").and.not.be.empty;
        // Icons should start with 'fa-' (FontAwesome)
        expect(section.icon).to.match(/^fa-/);
      });

      addTestLog(this, "✓ All icons follow FontAwesome format (fa-*)");
    });

    // Test 7: Section Names Uniqueness
    it("Validate section names are unique", async function () {
      const response = await getEOCDashboardConfig();

      const sectionNames = response.body.sections.map((s) => s.name);
      const uniqueNames = new Set(sectionNames);

      expect(sectionNames.length).to.equal(uniqueNames.size);

      addTestLog(this, `✓ All ${sectionNames.length} section names are unique`);
    });

    // Test 8: Config Object Structure
    it("Validate controls with config have valid structure", async function () {
      const response = await getEOCDashboardConfig();

      let controlsWithConfig = 0;

      response.body.sections.forEach((section) => {
        section.controls.forEach((control) => {
          if (control.config) {
            expect(control.config).to.be.an("object");
            controlsWithConfig++;
          }
        });
      });

      addTestLog(this, `✓ ${controlsWithConfig} controls have config objects`);
    });

    // Test 9: Expected Sections Exist (STRICT - All 9 must exist)
    it("Validate all expected sections exist", async function () {
      const response = await getEOCDashboardConfig();

      const sectionNames = response.body.sections.map((s) => s.name);

      // Validate ALL expected sections exist (strict check)
      EXPECTED_SECTIONS.forEach((expectedSection) => {
        expect(sectionNames).to.include(
          expectedSection,
          `Missing expected section: ${expectedSection}`
        );
      });

      expect(response.body.sections.length).to.be.at.least(MIN_EXPECTED_SECTIONS);

      addTestLog(
        this,
        `✓ All ${EXPECTED_SECTIONS.length} expected sections found`
      );
      addTestLog(this, `✓ Sections: ${sectionNames.join(", ")}`);

      // Extra sections are allowed (future additions)
      if (sectionNames.length > EXPECTED_SECTIONS.length) {
        const extraSections = sectionNames.filter(
          (name) => !EXPECTED_SECTIONS.includes(name)
        );
        addTestLog(this, `✓ Additional sections allowed: ${extraSections.join(", ")}`);
      }
    });

    // Test 10: Performance Baseline
    it("Validate response time within 1000ms", async function () {
      const startTime = Date.now();
      await getEOCDashboardConfig();
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1000);

      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });
});
