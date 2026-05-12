/**
 * Published Forms test data
 * Source: Actual API response from Clinical Dashboard
 * Used for validating form structure and availability
 * 
 * Note: Forms can be added/removed over time, so we focus on
 * structure validation rather than specific form counts/names
 */

// Required fields that must be present in each form
export const REQUIRED_FIELDS = [
  "name",
  "uuid",
  "version",
  "published",
  "id",
  "resources",
  "privileges",
  "nameTranslation",
];

// Minimum expected count (ensures at least some forms exist)
export const MIN_EXPECTED_FORMS = 1;

// Optional: Define critical forms if needed for your environment
// Uncomment and modify based on your specific requirements
/*
export const CRITICAL_FORMS = [
  "Vitals (6 years or older)",
  "Vitals (less than 6 years)",
  "Registration Details"
];
*/
