import { expect } from "chai";
import { searchConceptByName } from "../../../src/services/openmrs/concept.js";
import { vitalSignConcepts } from "../../testdata/clinical/concepts.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

// UI Trigger: Clinical Dashboard loads → Vitals form initialization
describe("Search Concept by Name (byFullySpecifiedName)", function () {
  describe("Vital Sign Concepts - Exact Match", function () {
    // Triggered when: Clinical Dashboard loads vitals form
    it("Search for 'Pulse' concept", async function () {
      const response = await searchConceptByName(vitalSignConcepts.pulse.name);

      expect(response.body.results).to.be.an("array").with.lengthOf(1);
      expect(response.body.results[0].uuid).to.equal(
        vitalSignConcepts.pulse.uuid
      );
      expect(response.body.results[0].display).to.equal(
        vitalSignConcepts.pulse.display
      );

      addTestLog(this, `✓ Found: ${response.body.results[0].display}`);
      addTestLog(this, `✓ UUID: ${response.body.results[0].uuid}`);
    });

    // Triggered when: Clinical Dashboard loads vitals form
    it("Search for 'Height (cm)' concept with URL encoding", async function () {
      const response = await searchConceptByName(
        vitalSignConcepts.height.name
      );

      expect(response.body.results).to.be.an("array").with.lengthOf(1);
      expect(response.body.results[0].uuid).to.equal(
        vitalSignConcepts.height.uuid
      );
      expect(response.body.results[0].display).to.equal(
        vitalSignConcepts.height.display
      );

      addTestLog(this, `✓ Found: ${response.body.results[0].display}`);
      addTestLog(this, "✓ URL encoding handled: space + parentheses");
    });

    // Triggered when: Clinical Dashboard loads vitals form
    it("Search for 'Weight (kg)' concept with URL encoding", async function () {
      const response = await searchConceptByName(
        vitalSignConcepts.weight.name
      );

      expect(response.body.results).to.be.an("array").with.lengthOf(1);
      expect(response.body.results[0].uuid).to.equal(
        vitalSignConcepts.weight.uuid
      );
      expect(response.body.results[0].display).to.equal(
        vitalSignConcepts.weight.display
      );

      addTestLog(this, `✓ Found: ${response.body.results[0].display}`);
      addTestLog(this, "✓ URL encoding handled: space + parentheses");
    });

    // Performance validation for form load
    it("Validate response time within 300ms", async function () {
      const startTime = Date.now();
      await searchConceptByName(vitalSignConcepts.pulse.name);
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(300);
      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });
});
