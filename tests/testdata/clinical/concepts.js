/**
 * Clinical concept test data for Search Concept by Name
 * These are the actual concepts called when Clinical Dashboard loads
 */

export const vitalSignConcepts = {
  pulse: {
    name: "Pulse",
    uuid: "5087AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Pulse",
  },
  height: {
    name: "Height (cm)",
    uuid: "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Height (cm)",
  },
  weight: {
    name: "Weight (kg)",
    uuid: "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    display: "Weight (kg)",
  },
};

/**
 * Invalid concept names for negative testing
 */
export const invalidConcepts = {
  nonExistent: "NonExistentConceptXYZ123",
  empty: "",
  specialChars: "@#$%^&*()",
};
