export const recipeCategories = [
  "Genser",
  "Cardigan",
  "Sokker",
  "Lue",
  "Votter",
  "Tilbehør",
  "Annet",
] as const;

export type RecipeCategory = (typeof recipeCategories)[number];

export const recipeDifficulties = ["Enkel", "Middels", "Vanskelig"] as const;

export type RecipeDifficulty = (typeof recipeDifficulties)[number];

export interface Recipe {
  id: string;
  title: string;
  category: RecipeCategory;
  needleSizes: number[];
  difficulty: RecipeDifficulty;
  used: boolean;
  notes: string;
  pdfId?: string;
  createdAt: string;
}
