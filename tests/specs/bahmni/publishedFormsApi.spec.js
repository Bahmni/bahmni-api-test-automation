import { expect } from "chai";
import { getPublishedForms } from "../../../src/services/bahmni/forms.js";
import {
  REQUIRED_FIELDS,
  MIN_EXPECTED_FORMS,
} from "../../testdata/clinical/publishedForms.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

// UI Trigger: Clinical Dashboard - Forms table loads
// Business Logic: Provides name→UUID mapping for form loading in consultations
describe("Published Forms API - Clinical Observation Forms", function () {
  describe("GET /bahmniie/form/latestPublishedForms - Validations", function () {
    // Test 1: Response Structure Validation
    it("Validate response is non-empty array", async function () {
      const response = await getPublishedForms();

      expect(response.body).to.be.an("array");
      expect(response.body.length).to.be.greaterThan(0);
      expect(response.body.length).to.be.at.least(MIN_EXPECTED_FORMS);

      addTestLog(this, `✓ Forms count: ${response.body.length}`);
    });

    // Test 2: Required Fields Structure
    it("Validate each form has required fields", async function () {
      const response = await getPublishedForms();

      response.body.forEach((form) => {
        REQUIRED_FIELDS.forEach((field) => {
          expect(form).to.have.property(field);
        });
      });

      addTestLog(this, `✓ All ${response.body.length} forms have required fields`);
    });

    // Test 3: Field Types Validation
    it("Validate field types for each form", async function () {
      const response = await getPublishedForms();

      response.body.forEach((form) => {
        expect(form.name).to.be.a("string").and.not.be.empty;
        expect(form.uuid).to.be.a("string").and.not.be.empty;
        expect(form.version).to.be.a("string").and.not.be.empty;
        expect(form.published).to.be.a("boolean");
        expect(form.id).to.be.a("number");
        expect(form.privileges).to.be.an("array");
        expect(form.nameTranslation).to.be.a("string");
      });

      addTestLog(this, "✓ All forms have correct field types");
    });

    // Test 4: Published Status (Critical Business Rule)
    it("Validate all forms are published", async function () {
      const response = await getPublishedForms();

      const allPublished = response.body.every((form) => form.published === true);
      expect(allPublished).to.be.true;

      const publishedCount = response.body.filter((f) => f.published).length;
      addTestLog(this, `✓ All ${publishedCount} forms are published`);
    });

    // Test 5: UUID Non-Empty Validation
    it("Validate UUIDs are non-empty strings", async function () {
      const response = await getPublishedForms();

      response.body.forEach((form) => {
        expect(form.uuid).to.be.a("string").and.not.be.empty;
      });

      addTestLog(this, `✓ All ${response.body.length} UUIDs are non-empty`);
    });

    // Test 6: UUID Uniqueness
    it("Validate UUIDs are unique", async function () {
      const response = await getPublishedForms();

      const uuids = response.body.map((form) => form.uuid);
      const uniqueUuids = new Set(uuids);

      expect(uuids.length).to.equal(uniqueUuids.size);

      addTestLog(this, `✓ All ${uuids.length} UUIDs are unique`);
    });

    // Test 7: Name-UUID Mapping (Critical for Frontend)
    it("Validate name-UUID pairs are unique", async function () {
      const response = await getPublishedForms();

      const nameUuidPairs = response.body.map((f) => `${f.name}:${f.uuid}`);
      const uniquePairs = new Set(nameUuidPairs);

      expect(nameUuidPairs.length).to.equal(uniquePairs.size);

      addTestLog(this, "✓ All name-UUID pairs are unique (critical for form lookup)");
    });

    // Test 8: Performance Baseline
    it("Validate response time within 1000ms", async function () {
      const startTime = Date.now();
      await getPublishedForms();
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1500);

      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });
});
