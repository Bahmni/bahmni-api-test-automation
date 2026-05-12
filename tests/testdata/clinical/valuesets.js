/**
 * ValueSet UUIDs for allergen and reaction concepts
 * Used in Clinical module allergy management
 * 
 * APIs: 14 (Allergen Concepts), 15 (Reaction Concepts)
 * 
 * Note: These UUIDs are consistent across all environments (Local, Dev, QA, UAT)
 */

export const valueSetUuids = {
  // Food allergens (Peanuts, Shellfish, Eggs, etc.)
  foodAllergens: "162553AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",

  // Environmental allergens (Pollen, Dust, Bee stings, etc.)
  environmentalAllergens: "162554AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",

  // Drug allergens (Penicillins, Aspirin, NSAIDs, etc.)
  drugAllergens: "162552AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",

  // Allergic reactions (Rash, Hives, Anaphylaxis, etc.)
  reactions: "162555AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
};
