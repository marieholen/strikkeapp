export interface ProjectFormData {
  name: string;
  recipeId: string;
  status: string;
  progress: number;
  notes: string;
}

export interface ProjectFormErrors {
  name?: string;
  recipeId?: string;
  status?: string;
  progress?: string;
}

export function validateProjectForm(data: ProjectFormData): ProjectFormErrors {
  const errors: ProjectFormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Navn er påkrevd.";
  }

  if (!data.recipeId) {
    errors.recipeId = "Velg en oppskrift.";
  }

  if (!data.status) {
    errors.status = "Velg en status.";
  }

  if (
    !Number.isInteger(data.progress) ||
    data.progress < 0 ||
    data.progress > 100
  ) {
    errors.progress = "Fremgang må være mellom 0 og 100 %.";
  }

  return errors;
}
