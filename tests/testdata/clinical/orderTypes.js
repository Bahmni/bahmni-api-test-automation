/**
 * Order Types test data
 * Source: Actual API response from Clinical Dashboard
 * Used for validating order type configuration and concept class mappings
 */

export const expectedOrderTypes = {
  drugOrder: {
    uuid: "131168f4-15f5-102d-96e4-000c29c2a5d7",
    display: "Drug Order",
    conceptClassCount: 1,
    conceptClasses: [
      {
        uuid: "8d490dfc-c2cc-11de-8d13-0010c6dffd0f",
        name: "Drug",
      },
    ],
  },
  testOrder: {
    uuid: "52a447d3-a64a-11e3-9aeb-50e549534c5e",
    display: "Test Order",
    conceptClassCount: 0, // EDGE CASE: Empty conceptClasses array
    conceptClasses: [],
  },
  labOrder: {
    uuid: "5f34135d-1d0c-11f1-b099-5a3ed7acdb7e",
    display: "Lab Order",
    conceptClassCount: 3, // Most complex - has 3 concept classes
    conceptClasses: [
      {
        uuid: "8d4907b2-c2cc-11de-8d13-0010c6dffd0f",
        name: "Test",
      },
      {
        uuid: "8d492026-c2cc-11de-8d13-0010c6dffd0f",
        name: "LabSet",
      },
      {
        uuid: "600eaab2-1d0c-11f1-b099-5a3ed7acdb7e",
        name: "LabTest",
      },
    ],
  },
  radiologyOrder: {
    uuid: "5f342329-1d0c-11f1-b099-5a3ed7acdb7e",
    display: "Radiology Order",
    conceptClassCount: 2,
    conceptClasses: [
      {
        uuid: "600fed4c-1d0c-11f1-b099-5a3ed7acdb7e",
        name: "Radiology",
      },
      {
        uuid: "c6664c16-16b4-4bf4-91da-93f2ac88a0eb",
        name: "Radiology/Imaging Procedure", // Special char in name
      },
    ],
  },
  examinationOrder: {
    uuid: "0a04e914-0f57-425e-95a1-738428d6abbb",
    display: "Examination Order",
    conceptClassCount: 1,
    conceptClasses: [
      {
        uuid: "93325e29-8c6f-4d8c-a5ee-756d4997f96b",
        name: "Examination",
      },
    ],
  },
  cspOrder: {
    uuid: "398cc049-47c2-48d6-ac11-9a14fe708234",
    display: "CSP Order",
    conceptClassCount: 1,
    conceptClasses: [
      {
        uuid: "18c882dd-0ee7-4910-960e-7d5ba84f10cf",
        name: "CSP",
      },
    ],
  },
};

// Expected counts for validation
export const EXPECTED_ORDER_TYPE_COUNT = 6;

// Critical order types required for Clinical operations
export const CRITICAL_ORDER_TYPES = ["Drug Order", "Lab Order", "Radiology Order"];

