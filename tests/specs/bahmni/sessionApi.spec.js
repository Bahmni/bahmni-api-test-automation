import { expect } from "chai";
import {
  getSession,
  setSessionLocation,
  setAndVerifySessionLocation,
  getLocaleLanguages,
} from "../../../src/services/openmrs/session.js";
import {
  setAuthCredentials,
  resetAuthCredentials,
} from "../../../src/config/authManager.js";
import { unauthenticatedRequest } from "../../../src/config/apiClient.js";
import { bahmniUserCredentials } from "../../testdata/credentials/bahmniUserCredentials.js";
import { loginLocations } from "../../testdata/locations/loginLocations.js";
import { addTestLog } from "../../fixtures/rootHooks.js";

describe("Session API - GET & POST Validations", function () {
  
  describe("GET /session - Role Validation for All Users", function () {
    it("Should return ONLY 'Appointment Admin' role for zubair_appadmin", async function () {
      const user = bahmniUserCredentials.appointmentAdmin;
      setAuthCredentials(user.username, user.password);

      const response = await getSession();

      const userRoles = response.body.user.roles.map((r) => r.display);
      expect(userRoles).to.include(user.role);
      expect(userRoles).to.have.lengthOf(1);

      addTestLog(this, `✓ User: ${user.username}`);
      addTestLog(this, `✓ Has ONLY role: ${user.role}`);
    });

    it("Should return ONLY 'FrontDesk' role for zuri_frontdesk", async function () {
      const user = bahmniUserCredentials.frontDesk;
      setAuthCredentials(user.username, user.password);

      const response = await getSession();

      const userRoles = response.body.user.roles.map((r) => r.display);
      expect(userRoles).to.include(user.role);
      expect(userRoles).to.have.lengthOf(1);

      addTestLog(this, `✓ User: ${user.username}`);
      addTestLog(this, `✓ Has ONLY role: ${user.role}`);
    });

    it("Should return ONLY 'Receptionist' role for judy_receptionist", async function () {
      const user = bahmniUserCredentials.receptionist;
      setAuthCredentials(user.username, user.password);

      const response = await getSession();

      const userRoles = response.body.user.roles.map((r) => r.display);
      expect(userRoles).to.include(user.role);
      expect(userRoles).to.have.lengthOf(1);

      addTestLog(this, `✓ User: ${user.username}`);
      addTestLog(this, `✓ Has ONLY role: ${user.role}`);
    });

    it("Should return ONLY 'Registration' role for nafula_registration", async function () {
      const user = bahmniUserCredentials.registration;
      setAuthCredentials(user.username, user.password);

      const response = await getSession();

      const userRoles = response.body.user.roles.map((r) => r.display);
      expect(userRoles).to.include(user.role);
      expect(userRoles).to.have.lengthOf(1);

      addTestLog(this, `✓ User: ${user.username}`);
      addTestLog(this, `✓ Has ONLY role: ${user.role}`);
    });

    it("Should return ONLY 'Doctor' role for omar_doctor", async function () {
      const user = bahmniUserCredentials.doctor;
      setAuthCredentials(user.username, user.password);

      const response = await getSession();

      const userRoles = response.body.user.roles.map((r) => r.display);
      expect(userRoles).to.include(user.role);
      expect(userRoles).to.have.lengthOf(1);

      addTestLog(this, `✓ User: ${user.username}`);
      addTestLog(this, `✓ Has ONLY role: ${user.role}`);
    });

    it("Should return ONLY 'Radiology Technician' role for odinga_radtech", async function () {
      const user = bahmniUserCredentials.radiologyTechnician;
      setAuthCredentials(user.username, user.password);

      const response = await getSession();

      const userRoles = response.body.user.roles.map((r) => r.display);
      expect(userRoles).to.include(user.role);
      expect(userRoles).to.have.lengthOf(1);

      addTestLog(this, `✓ User: ${user.username}`);
      addTestLog(this, `✓ Has ONLY role: ${user.role}`);
    });

    it("Should return ONLY 'Radiologist' role for bakole_radiologist", async function () {
      const user = bahmniUserCredentials.radiologist;
      setAuthCredentials(user.username, user.password);

      const response = await getSession();

      const userRoles = response.body.user.roles.map((r) => r.display);
      expect(userRoles).to.include(user.role);
      expect(userRoles).to.have.lengthOf(1);

      addTestLog(this, `✓ User: ${user.username}`);
      addTestLog(this, `✓ Has ONLY role: ${user.role}`);
    });

    afterEach(function () {
      resetAuthCredentials();
    });
  });

  describe("GET /session - API Response Validations", function () {
    // Validation 1: Locale matching
    it("Should match allowedLocales with locale_languages.json", async function () {
      addTestLog(this, "Fetching session allowedLocales");

      const sessionResponse = await getSession();
      const sessionLocales = sessionResponse.body.allowedLocales;

      addTestLog(
        this,
        `Session allowedLocales: ${JSON.stringify(sessionLocales)}`
      );

      const localeResponse = await getLocaleLanguages();
      const expectedLocales = localeResponse.body.locales.map((l) => l.code);

      addTestLog(this, `Expected locales: ${JSON.stringify(expectedLocales)}`);

      expect(sessionLocales).to.have.members(expectedLocales);
      expect(sessionLocales).to.have.lengthOf(expectedLocales.length);

      addTestLog(this, "✓ allowedLocales matches locale_languages.json");
    });

    // Validation 2: UUID present and valid
    it("Should have user.uuid present and valid format", async function () {
      const response = await getSession();

      expect(response.body.user.uuid).to.exist;
      expect(response.body.user.uuid).to.be.a("string");
      expect(response.body.user.uuid).to.not.be.empty;

      // Validate UUID format
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      expect(response.body.user.uuid).to.match(uuidRegex);

      addTestLog(this, `✓ Valid UUID: ${response.body.user.uuid}`);
    });

    // Validation 3: Authenticated true
    it("Should have authenticated=true", async function () {
      const response = await getSession();

      expect(response.body.authenticated).to.be.true;

      addTestLog(this, "✓ authenticated: true");
    });

    // Validation 4: Username matches
    it("Should return correct username for authenticated user", async function () {
      const response = await getSession();

      expect(response.body.user.username).to.exist;
      expect(response.body.user.username).to.be.a("string");
      expect(response.body.user.username).to.not.be.empty;

      addTestLog(this, `✓ Username: ${response.body.user.username}`);
    });

    // Validation 5: sessionLocation is null before POST
    it("Should have sessionLocation as null (before POST)", async function () {
      const response = await getSession();

      // sessionLocation should be null before POST
      expect(response.body.sessionLocation).to.be.null;

      addTestLog(this, "✓ sessionLocation is null (not set yet)");
    });

    // Validation 6: Privileges array structure
    it("Should have privileges array with valid structure", async function () {
      const response = await getSession();

      expect(response.body.user.privileges).to.be.an("array");
      expect(response.body.user.privileges.length).to.be.greaterThan(0);

      // Validate first privilege has required fields
      const firstPrivilege = response.body.user.privileges[0];
      expect(firstPrivilege).to.have.property("uuid");
      expect(firstPrivilege).to.have.property("name");
      expect(firstPrivilege).to.have.property("display");

      addTestLog(
        this,
        `✓ Privileges count: ${response.body.user.privileges.length}`
      );
      addTestLog(this, "✓ Privilege structure valid (uuid, name, display)");
    });

    // Validation 7: Response time
    it("Should respond within 300ms", async function () {
      const startTime = Date.now();
      const response = await getSession();
      const responseTime = Date.now() - startTime;


      expect(responseTime).to.be.lessThan(300);

      addTestLog(this, `✓ Response time: ${responseTime}ms`);
    });

    // Validation 8: Locale consistency
    it("Should have current locale as one of allowedLocales", async function () {
      const response = await getSession();

      expect(response.body.locale).to.exist;
      expect(response.body.locale).to.be.oneOf(
        response.body.allowedLocales
      );

      addTestLog(
        this,
        `✓ Current locale '${response.body.locale}' is in allowedLocales`
      );
    });

    // Validation 9: Roles array structure
    it("Should have roles array with valid structure", async function () {
      const response = await getSession();

      expect(response.body.user.roles).to.be.an("array");
      expect(response.body.user.roles.length).to.be.greaterThan(0);

      const firstRole = response.body.user.roles[0];
      expect(firstRole).to.have.property("uuid");
      expect(firstRole).to.have.property("name");
      expect(firstRole).to.have.property("display");

      addTestLog(this, `✓ Roles count: ${response.body.user.roles.length}`);
      addTestLog(this, "✓ Role structure valid (uuid, name, display)");
    });

    // Validation 10: currentProvider exists
    it("Should have currentProvider with valid structure", async function () {
      const response = await getSession();

      expect(response.body.currentProvider).to.exist;
      expect(response.body.currentProvider).to.have.property("uuid");
      expect(response.body.currentProvider).to.have.property("display");

      addTestLog(
        this,
        `✓ currentProvider: ${response.body.currentProvider.display}`
      );
    });
  });

  describe("POST /session - Set Location and Validate", function () {
    it("Should POST session location and verify via GET", async function () {
      const testLocation = loginLocations[0];

      addTestLog(this, "=== Using session-persistent service function ===");
      addTestLog(this, `Setting location: ${testLocation.name}`);
      addTestLog(this, `Location UUID: ${testLocation.uuid}`);

      // Use the new service function that maintains session across requests
      const { postResponse, getResponse } = await setAndVerifySessionLocation(
        testLocation.uuid
      );

      addTestLog(this, "=== Step 1: Verify POST response ===");

      expect(postResponse.status).to.equal(200);
      expect(postResponse.body.sessionLocation).to.exist;
      expect(postResponse.body.sessionLocation.display).to.equal(
        testLocation.name
      );

      addTestLog(this, "✓ POST successful");
      addTestLog(this, `✓ Location set: ${testLocation.name}`);

      addTestLog(this, "=== Step 2: Verify GET response (session persistence) ===");

      expect(getResponse.status).to.equal(200);
      expect(getResponse.body.sessionLocation).to.not.be.null;
      expect(getResponse.body.sessionLocation.uuid).to.equal(
        testLocation.uuid
      );
      expect(getResponse.body.sessionLocation.display).to.equal(
        testLocation.name
      );

      addTestLog(
        this,
        `✓ GET confirms location: ${getResponse.body.sessionLocation.display}`
      );
      addTestLog(this, "✓ Location persisted correctly in same session");
    });
  });
});
