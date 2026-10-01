export interface RecipeFormData {
  title: string;
  category: string;
  needleSizes: string;
  difficulty: string;
  used: boolean;
  notes: string;
}

export interface RecipeFormErrors {
  title?: string;
  category?: string;
  needleSizes?: string;
  difficulty?: string;
}

export function validateRecipeForm(data: RecipeFormData): RecipeFormErrors {
  const errors: RecipeFormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Navn er påkrevd.";
  }

  if (!data.category) {
    errors.category = "Velg en kategori.";
  }

  if (!data.needleSizes.trim()) {
    errors.needleSizes = "Skriv inn minst én pinnestørrelse.";
  }

  if (!data.difficulty) {
    errors.difficulty = "Velg vanskelighetsgrad.";
  }

  return errors;
}
