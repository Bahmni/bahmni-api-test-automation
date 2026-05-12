import { expect } from "chai";
import { fetchValueSet } from "../../../src/services/openmrs/valueset.js";
import { valueSetUuids } from "../../testdata/clinical/valuesets.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

describe("ValueSet APIs - Allergen and Reaction Concepts", function () {
  // Fetch Drug Allergen Concepts
  describe("Fetch Drug Allergen Concepts", function () {
    it("Validate drug allergen valueset response body", async function () {
      const response = await fetchValueSet(valueSetUuids.drugAllergens);

      // Validate FHIR resource type, ID, title, and status
      expect(response.body.resourceType).to.equal("ValueSet");
      expect(response.body.id).to.equal(valueSetUuids.drugAllergens);
      expect(response.body.title).to.equal(
        "Reference application common drug allergens"
      );
      expect(response.body.status).to.equal("active");
      addTestLog(
        this,
        "✓ FHIR resource validated: ValueSet type, correct ID, title, and active status"
      );

      // Validate compose structure exists
      expect(response.body.compose).to.exist;
      expect(response.body.compose.include)
        .to.be.an("array")
        .with.lengthOf.at.least(1);
      addTestLog(
        this,
        "✓ Compose structure validated: Definition exists with includes"
      );

      // Validate expansion contains minimum 10 drug allergens
      expect(response.body.expansion).to.exist;
      expect(response.body.expansion.total).to.be.at.least(10);
      expect(response.body.expansion.contains).to.be.an("array");
      addTestLog(
        this,
        `✓ Expansion validated: Total=${response.body.expansion.total} drug allergens (minimum 10 required)`
      );

      // Validate critical drug classes and individual drugs exist
      const displays = response.body.expansion.contains.map((c) => c.display);
      expect(displays).to.include.members([
        "Penicillins",
        "NSAIDs",
        "Cephalosporins",
      ]);
      expect(displays).to.include.members(["Aspirin", "Codeine", "Morphine"]);
      expect(displays).to.include("Other");
      addTestLog(
        this,
        "✓ Critical concepts validated: Penicillins, NSAIDs, Cephalosporins, Aspirin, Codeine, Morphine, Other"
      );

      // Validate every concept has required fields (code, display, extension)
      response.body.expansion.contains.forEach((concept) => {
        expect(concept).to.have.property("code");
        expect(concept).to.have.property("display");
        expect(concept).to.have.property("extension");
        expect(concept.code).to.be.a("string").with.lengthOf(36);
      });
      addTestLog(
        this,
        `✓ Concept structure validated: All ${response.body.expansion.total} concepts have code (UUID), display, extension`
      );

      // Validate concept class is valid (Drug, Pharmacologic Drug Class, or Misc)
      const conceptClasses = response.body.expansion.contains.map(
        (c) => c.extension[0].valueString
      );
      conceptClasses.forEach((conceptClass) => {
        expect([
          "Drug",
          "Pharmacologic Drug Class",
          "Misc",
        ]).to.include(conceptClass);
      });
      const drugCount = conceptClasses.filter((c) => c === "Drug").length;
      const classCount = conceptClasses.filter(
        (c) => c === "Pharmacologic Drug Class"
      ).length;
      const miscCount = conceptClasses.filter((c) => c === "Misc").length;
      addTestLog(
        this,
        `✓ Concept class validated: Drug=${drugCount}, Pharmacologic Drug Class=${classCount}, Misc=${miscCount}`
      );
    });

    it("Validate response time within 1500ms", async function () {
      const startTime = Date.now();
      await fetchValueSet(valueSetUuids.drugAllergens);
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1500);
      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });

  // Fetch Food Allergen Concepts
  describe("Fetch Food Allergen Concepts", function () {
    it("Validate food allergen valueset response body", async function () {
      const response = await fetchValueSet(valueSetUuids.foodAllergens);

      // Validate FHIR resource type, ID, title, and status
      expect(response.body.resourceType).to.equal("ValueSet");
      expect(response.body.id).to.equal(valueSetUuids.foodAllergens);
      expect(response.body.title).to.equal(
        "Reference application common food allergens"
      );
      expect(response.body.status).to.equal("active");
      addTestLog(
        this,
        "✓ FHIR resource validated: ValueSet type, correct ID, title, and active status"
      );

      // Validate compose structure exists
      expect(response.body.compose).to.exist;
      expect(response.body.compose.include)
        .to.be.an("array")
        .with.lengthOf.at.least(1);
      addTestLog(
        this,
        "✓ Compose structure validated: Definition exists with includes"
      );

      // Validate expansion contains minimum 10 food allergens
      expect(response.body.expansion).to.exist;
      expect(response.body.expansion.total).to.be.at.least(10);
      expect(response.body.expansion.contains).to.be.an("array");
      addTestLog(
        this,
        `✓ Expansion validated: Total=${response.body.expansion.total} food allergens (minimum 10 required)`
      );

      // Validate critical food allergens exist
      const displays = response.body.expansion.contains.map((c) => c.display);
      expect(displays).to.include.members([
        "Peanuts",
        "Shellfish",
        "Eggs",
      ]);
      expect(displays).to.include.members(["Dairy food", "Fish", "Wheat"]);
      expect(displays).to.include("Other");
      addTestLog(
        this,
        "✓ Critical concepts validated: Peanuts, Shellfish, Eggs, Dairy food, Fish, Wheat, Other"
      );

      // Validate every concept has required fields (code, display, extension)
      response.body.expansion.contains.forEach((concept) => {
        expect(concept).to.have.property("code");
        expect(concept).to.have.property("display");
        expect(concept).to.have.property("extension");
        expect(concept.code).to.be.a("string").with.lengthOf(36);
      });
      addTestLog(
        this,
        `✓ Concept structure validated: All ${response.body.expansion.total} concepts have code (UUID), display, extension`
      );

      // Validate concept class is valid (Misc or Drug)
      const conceptClasses = response.body.expansion.contains.map(
        (c) => c.extension[0].valueString
      );
      conceptClasses.forEach((conceptClass) => {
        expect(["Misc", "Drug"]).to.include(conceptClass);
      });
      const miscCount = conceptClasses.filter((c) => c === "Misc").length;
      const drugCount = conceptClasses.filter((c) => c === "Drug").length;
      addTestLog(
        this,
        `✓ Concept class validated: Misc=${miscCount}, Drug=${drugCount}`
      );
    });

    it("Validate response time within 1500ms", async function () {
      const startTime = Date.now();
      await fetchValueSet(valueSetUuids.foodAllergens);
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1500);
      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });

  // Fetch Environmental Allergen Concepts
  describe("Fetch Environmental Allergen Concepts", function () {
    it("Validate environmental allergen valueset response body", async function () {
      const response = await fetchValueSet(valueSetUuids.environmentalAllergens);

      // Validate FHIR resource type, ID, title, and status
      expect(response.body.resourceType).to.equal("ValueSet");
      expect(response.body.id).to.equal(valueSetUuids.environmentalAllergens);
      expect(response.body.title).to.equal(
        "Reference application common environmental allergens"
      );
      expect(response.body.status).to.equal("active");
      addTestLog(
        this,
        "✓ FHIR resource validated: ValueSet type, correct ID, title, and active status"
      );

      // Validate compose structure exists
      expect(response.body.compose).to.exist;
      expect(response.body.compose.include)
        .to.be.an("array")
        .with.lengthOf.at.least(1);
      addTestLog(
        this,
        "✓ Compose structure validated: Definition exists with includes"
      );

      // Validate expansion contains minimum 5 environmental allergens
      expect(response.body.expansion).to.exist;
      expect(response.body.expansion.total).to.be.at.least(5);
      expect(response.body.expansion.contains).to.be.an("array");
      addTestLog(
        this,
        `✓ Expansion validated: Total=${response.body.expansion.total} environmental allergens (minimum 5 required)`
      );

      // Validate critical environmental allergens exist
      const displays = response.body.expansion.contains.map((c) => c.display);
      expect(displays).to.include.members([
        "Pollen",
        "Dust",
        "Latex",
      ]);
      expect(displays).to.include.members(["Mold", "Bee stings", "Ragweed"]);
      expect(displays).to.include("Other");
      addTestLog(
        this,
        "✓ Critical concepts validated: Pollen, Dust, Latex, Mold, Bee stings, Ragweed, Other"
      );

      // Validate every concept has required fields (code, display, extension)
      response.body.expansion.contains.forEach((concept) => {
        expect(concept).to.have.property("code");
        expect(concept).to.have.property("display");
        expect(concept).to.have.property("extension");
        expect(concept.code).to.be.a("string").with.lengthOf(36);
      });
      addTestLog(
        this,
        `✓ Concept structure validated: All ${response.body.expansion.total} concepts have code (UUID), display, extension`
      );

      // Validate concept class is valid (Misc only for environmental)
      const conceptClasses = response.body.expansion.contains.map(
        (c) => c.extension[0].valueString
      );
      conceptClasses.forEach((conceptClass) => {
        expect(["Misc"]).to.include(conceptClass);
      });
      const miscCount = conceptClasses.filter((c) => c === "Misc").length;
      addTestLog(
        this,
        `✓ Concept class validated: All Misc=${miscCount}`
      );
    });

    it("Validate response time within 1500ms", async function () {
      const startTime = Date.now();
      await fetchValueSet(valueSetUuids.environmentalAllergens);
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1500);
      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });

  // Fetch Reaction Concepts
  describe("Fetch Reaction Concepts", function () {
    it("Validate allergic reactions valueset response body", async function () {
      const response = await fetchValueSet(valueSetUuids.reactions);

      // Validate FHIR resource type, ID, title, and status
      expect(response.body.resourceType).to.equal("ValueSet");
      expect(response.body.id).to.equal(valueSetUuids.reactions);
      expect(response.body.title).to.equal(
        "Reference application allergic reactions"
      );
      expect(response.body.status).to.equal("active");
      addTestLog(
        this,
        "✓ FHIR resource validated: ValueSet type, correct ID, title, and active status"
      );

      // Validate compose structure exists
      expect(response.body.compose).to.exist;
      expect(response.body.compose.include)
        .to.be.an("array")
        .with.lengthOf.at.least(1);
      addTestLog(
        this,
        "✓ Compose structure validated: Definition exists with includes"
      );

      // Validate expansion contains minimum 20 reactions
      expect(response.body.expansion).to.exist;
      expect(response.body.expansion.total).to.be.at.least(20);
      expect(response.body.expansion.contains).to.be.an("array");
      addTestLog(
        this,
        `✓ Expansion validated: Total=${response.body.expansion.total} reactions (minimum 20 required)`
      );

      // Validate critical allergic reactions exist
      const displays = response.body.expansion.contains.map((c) => c.display);
      expect(displays).to.include.members([
        "Anaphylaxis",
        "Rash",
        "Hives",
      ]);
      expect(displays).to.include.members(["Angioedema", "Bronchospasm", "Itching"]);
      expect(displays).to.include("Other");
      addTestLog(
        this,
        "✓ Critical concepts validated: Anaphylaxis, Rash, Hives, Angioedema, Bronchospasm, Itching, Other"
      );

      // Validate every concept has required fields (code, display, extension)
      response.body.expansion.contains.forEach((concept) => {
        expect(concept).to.have.property("code");
        expect(concept).to.have.property("display");
        expect(concept).to.have.property("extension");
        expect(concept.code).to.be.a("string").with.lengthOf(36);
      });
      addTestLog(
        this,
        `✓ Concept structure validated: All ${response.body.expansion.total} concepts have code (UUID), display, extension`
      );

      // Validate concept class is valid (Diagnosis, Symptom, Finding, or Misc)
      const conceptClasses = response.body.expansion.contains.map(
        (c) => c.extension[0].valueString
      );
      conceptClasses.forEach((conceptClass) => {
        expect([
          "Diagnosis",
          "Symptom",
          "Finding",
          "Symptom/Finding",
          "Misc",
        ]).to.include(conceptClass);
      });
      const diagnosisCount = conceptClasses.filter((c) => c === "Diagnosis").length;
      const symptomCount = conceptClasses.filter((c) => c === "Symptom").length;
      const findingCount = conceptClasses.filter((c) => c === "Finding").length;
      const symptomFindingCount = conceptClasses.filter((c) => c === "Symptom/Finding").length;
      const miscCount = conceptClasses.filter((c) => c === "Misc").length;
      addTestLog(
        this,
        `✓ Concept class validated: Diagnosis=${diagnosisCount}, Symptom=${symptomCount}, Finding=${findingCount}, Symptom/Finding=${symptomFindingCount}, Misc=${miscCount}`
      );
    });

    it("Validate response time within 1500ms", async function () {
      const startTime = Date.now();
      await fetchValueSet(valueSetUuids.reactions);
      const responseTime = Date.now() - startTime;

      expect(responseTime).to.be.lessThan(1500);
      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });
  });
});
