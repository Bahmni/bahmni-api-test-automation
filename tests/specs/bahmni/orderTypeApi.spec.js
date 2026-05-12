import { expect } from "chai";
import { getOrderTypes } from "../../../src/services/openmrs/orderType.js";
import {
  expectedOrderTypes,
  EXPECTED_ORDER_TYPE_COUNT,
  CRITICAL_ORDER_TYPES,
} from "../../testdata/clinical/orderTypes.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

// UI Trigger: Clinical Dashboard - Investigations form loads
// Business Logic: Categorizes investigations by mapping concept classes to order types
describe("Order Types API - Clinical Ordering Configuration", function () {
  describe("GET /ordertype - Validations", function () {
    // Test 1: Response Structure Validation
    it("Validate results array with 6 order types", async function () {
      const response = await getOrderTypes();

      expect(response.body).to.have.property("results");
      expect(response.body.results).to.be.an("array");
      expect(response.body.results.length).to.equal(EXPECTED_ORDER_TYPE_COUNT);

      addTestLog(this, `✓ Order type count: ${response.body.results.length}`);
    });

    // Test 2: Order Type Required Fields
    it("Validate required fields for each order type", async function () {
      const response = await getOrderTypes();

      response.body.results.forEach((orderType) => {
        expect(orderType).to.have.property("uuid");
        expect(orderType).to.have.property("display");
        expect(orderType).to.have.property("conceptClasses");

        expect(orderType.uuid).to.be.a("string").and.not.be.empty;
        expect(orderType.display).to.be.a("string").and.not.be.empty;
        expect(orderType.conceptClasses).to.be.an("array");
      });

      addTestLog(this, "✓ All order types have required fields with valid formats");
    });

    // Test 3: Drug Order Validation
    it("Validate Drug Order with correct UUID and concept class", async function () {
      const response = await getOrderTypes();
      const expected = expectedOrderTypes.drugOrder;

      const drugOrder = response.body.results.find(
        (ot) => ot.uuid === expected.uuid
      );

      expect(drugOrder).to.exist;
      expect(drugOrder.display).to.equal(expected.display);
      expect(drugOrder.conceptClasses).to.be.an("array").with.lengthOf(1);
      expect(drugOrder.conceptClasses[0].name).to.equal("Drug");

      addTestLog(this, `✓ Drug Order found: ${drugOrder.display}`);
      addTestLog(this, `✓ Concept class: ${drugOrder.conceptClasses[0].name}`);
    });

    // Test 4: Lab Order Validation (Most Complex - 3 concept classes)
    it("Validate Lab Order with 3 concept classes", async function () {
      const response = await getOrderTypes();
      const expected = expectedOrderTypes.labOrder;

      const labOrder = response.body.results.find(
        (ot) => ot.uuid === expected.uuid
      );

      expect(labOrder).to.exist;
      expect(labOrder.display).to.equal(expected.display);
      expect(labOrder.conceptClasses)
        .to.be.an("array")
        .with.lengthOf(expected.conceptClassCount);

      // Validate all 3 concept classes
      const conceptClassNames = labOrder.conceptClasses.map((cc) => cc.name);
      expect(conceptClassNames).to.include("Test");
      expect(conceptClassNames).to.include("LabSet");
      expect(conceptClassNames).to.include("LabTest");

      // Validate each concept class has uuid and name
      labOrder.conceptClasses.forEach((cc) => {
        expect(cc).to.have.property("uuid");
        expect(cc).to.have.property("name");
        expect(cc.name).to.be.a("string").and.not.be.empty;
      });

      addTestLog(this, `✓ Lab Order found: ${labOrder.display}`);
      addTestLog(this, `✓ Concept classes (3): ${conceptClassNames.join(", ")}`);
    });

    // Test 5: Radiology Order Validation
    it("Validate Radiology Order with 2 concept classes", async function () {
      const response = await getOrderTypes();
      const expected = expectedOrderTypes.radiologyOrder;

      const radiologyOrder = response.body.results.find(
        (ot) => ot.uuid === expected.uuid
      );

      expect(radiologyOrder).to.exist;
      expect(radiologyOrder.display).to.equal(expected.display);
      expect(radiologyOrder.conceptClasses)
        .to.be.an("array")
        .with.lengthOf(expected.conceptClassCount);

      const conceptClassNames = radiologyOrder.conceptClasses.map(
        (cc) => cc.name
      );
      expect(conceptClassNames).to.include("Radiology");
      expect(conceptClassNames).to.include("Radiology/Imaging Procedure");

      addTestLog(this, `✓ Radiology Order found: ${radiologyOrder.display}`);
      addTestLog(
        this,
        `✓ Concept classes (2): ${conceptClassNames.join(", ")}`
      );
    });

    // Test 6: Test Order Edge Case (Empty conceptClasses array)
    it("Validate Test Order with empty conceptClasses array", async function () {
      const response = await getOrderTypes();
      const expected = expectedOrderTypes.testOrder;

      const testOrder = response.body.results.find(
        (ot) => ot.uuid === expected.uuid
      );

      expect(testOrder).to.exist;
      expect(testOrder.display).to.equal(expected.display);
      expect(testOrder.conceptClasses).to.be.an("array").with.lengthOf(0);

      addTestLog(this, `✓ Test Order found: ${testOrder.display}`);
      addTestLog(
        this,
        "✓ Empty conceptClasses array handled correctly (edge case)"
      );
    });

    // Test 7: Examination & CSP Orders
    it("Validate Examination Order and CSP Order", async function () {
      const response = await getOrderTypes();

      // Examination Order
      const examinationOrder = response.body.results.find(
        (ot) => ot.uuid === expectedOrderTypes.examinationOrder.uuid
      );
      expect(examinationOrder).to.exist;
      expect(examinationOrder.display).to.equal(
        expectedOrderTypes.examinationOrder.display
      );
      expect(examinationOrder.conceptClasses).to.have.lengthOf(1);

      // CSP Order
      const cspOrder = response.body.results.find(
        (ot) => ot.uuid === expectedOrderTypes.cspOrder.uuid
      );
      expect(cspOrder).to.exist;
      expect(cspOrder.display).to.equal(expectedOrderTypes.cspOrder.display);
      expect(cspOrder.conceptClasses).to.have.lengthOf(1);

      addTestLog(
        this,
        `✓ Examination Order: ${examinationOrder.display} (${examinationOrder.conceptClasses[0].name})`
      );
      addTestLog(
        this,
        `✓ CSP Order: ${cspOrder.display} (${cspOrder.conceptClasses[0].name})`
      );
    });

    // Test 8: Concept Class Structure Validation
    it("Validate structure for all concept classes", async function () {
      const response = await getOrderTypes();
      let totalConceptClasses = 0;

      response.body.results.forEach((orderType) => {
        if (orderType.conceptClasses.length > 0) {
          orderType.conceptClasses.forEach((conceptClass) => {
            expect(conceptClass).to.have.property("uuid");
            expect(conceptClass).to.have.property("name");
            expect(conceptClass.uuid).to.be.a("string").and.not.be.empty;
            expect(conceptClass.name).to.be.a("string").and.not.be.empty;

            totalConceptClasses++;
          });
        }
      });

      addTestLog(this, `✓ Total concept classes validated: ${totalConceptClasses}`);
      addTestLog(this, "✓ All concept classes have valid uuid and name");
    });

    // Test 9: Case-Insensitive Display Name Matching (Frontend Behavior)
    it("Validate display names for case-insensitive lookup", async function () {
      const response = await getOrderTypes();

      // Collect all display names
      const displayNames = response.body.results.map((ot) => ot.display);

      // Validate all display names are non-empty strings
      displayNames.forEach((name) => {
        expect(name).to.be.a("string").and.not.be.empty;
      });

      // Verify critical order types exist (case-sensitive check)
      CRITICAL_ORDER_TYPES.forEach((criticalType) => {
        expect(displayNames).to.include(criticalType);
      });

      addTestLog(this, `✓ Display names: ${displayNames.join(", ")}`);
      addTestLog(
        this,
        "✓ All critical order types present (Drug, Lab, Radiology)"
      );
    });

    // Test 10: Performance Baseline
    it("Validate response time within 1000ms", async function () {
      const startTime = Date.now();
      await getOrderTypes();
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1000);

      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });
});
