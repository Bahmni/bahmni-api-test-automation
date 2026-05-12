/**
 * EOC Dashboard Configuration test data
 * Source: Actual config from eocDashboard.json
 * Used for validating clinical dashboard structure
 * 
 * The dashboard config defines sections and controls for clinical workflow
 */

// Required top-level fields
export const REQUIRED_FIELDS = ["sections"];

// Required fields for each section
export const REQUIRED_SECTION_FIELDS = [
  "name",
  "translationKey",
  "icon",
  "controls",
];

// Required fields for each control
export const REQUIRED_CONTROL_FIELDS = ["type"];

// Expected sections (8) - ALL must exist
// Strict validation: Missing any section will fail the test
// Note: Immunization section merged into Vaccinations (now has 2 controls)
export const EXPECTED_SECTIONS = [
  "Allergies",
  "Examinations",
  "Lab Investigations",
  "Radiology Investigations",
  "Observations",
  "Forms",
  "Vaccinations",
  "Medications",
];

// Expected control types (8) - ALL must exist
// Note: "treatment" is used by both Vaccinations AND Medications sections
// Note: "immunizationHistory" moved to Vaccinations section
export const EXPECTED_CONTROL_TYPES = [
  "allergies",
  "ordersControl",
  "labOrders",
  "pacsOrders",
  "observations",
  "forms",
  "treatment",
  "immunizationHistory",
];

// Minimum expected sections (for basic validation)
export const MIN_EXPECTED_SECTIONS = 8;
