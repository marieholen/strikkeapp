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

export function parseNeedleSizes(input: string): number[] | null {
  const parts = input.split(",").map((part) => part.trim());

  if (parts.some((part) => !/^\d+(?:\.\d+)?$/.test(part))) {
    return null;
  }

  const sizes = parts.map(Number);
  return sizes.every((size) => Number.isFinite(size) && size > 0)
    ? sizes
    : null;
}

export function validateRecipeForm(data: RecipeFormData): RecipeFormErrors {
  const errors: RecipeFormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Navn på oppskrift er påkrevd.";
  }

  if (!data.category) {
    errors.category = "Velg en type oppskrift.";
  }

  if (!data.needleSizes.trim()) {
    errors.needleSizes = "Skriv inn minst én pinnestørrelse.";
  } else if (parseNeedleSizes(data.needleSizes) === null) {
    errors.needleSizes =
      "Bruk positive tall med punktum som desimaltegn og komma mellom størrelsene, for eksempel 3.5, 4.";
  }

  if (!data.difficulty) {
    errors.difficulty = "Velg vanskelighetsgrad.";
  }

  return errors;
}
