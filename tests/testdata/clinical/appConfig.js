/**
 * Clinical App Configuration test data
 * Source: Actual config from app.json
 * Used for validating clinical application master configuration
 * 
 * This config defines the entire Clinical app structure including:
 * - Available dashboards
 * - Consultation pad input controls (what forms doctors can use)
 * - Allergy concept mappings
 * - Program context fields
 */

// Required top-level fields
export const REQUIRED_TOP_LEVEL_FIELDS = [
  "patientInformation",
  "contextInformation",
  "actions",
  "dashboards",
  "consultationPad",
];

// Required dashboard fields
export const REQUIRED_DASHBOARD_FIELDS = [
  "name",
  "url",
  "requiredPrivileges",
];

// Expected dashboards (2) - STRICT validation
export const EXPECTED_DASHBOARDS = ["General Dashboard", "EOC Dashboard"];

// Required allergyConceptMap UUIDs (4) - CRITICAL for allergy recording
export const REQUIRED_ALLERGY_CONCEPT_UUIDS = [
  "medicationAllergenUuid",
  "foodAllergenUuid",
  "environmentalAllergenUuid",
  "allergyReactionUuid",
];

// Expected input control types (9) - STRICT validation
// These are the forms available in consultation pad
export const EXPECTED_INPUT_CONTROL_TYPES = [
  "encounterDetails",
  "allergies",
  "investigations",
  "medications",
  "observationForms",
  "vaccinations",
  "conditionsAndDiagnoses",
  "immunizationHistory",
  "immunizationAdministration",
];

// Required input control fields
export const REQUIRED_INPUT_CONTROL_FIELDS = [
  "type",
  "encounterTypes",
  "privileges",
];

// Minimum expected counts
export const MIN_EXPECTED_DASHBOARDS = 1;
export const MIN_EXPECTED_INPUT_CONTROLS = 1;
