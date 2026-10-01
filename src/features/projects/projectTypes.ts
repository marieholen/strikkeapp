export const projectStatuses = ["Planlagt", "Pågående", "Ferdig"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export interface Project {
  id: string;
  name: string;
  recipeId: string;
  status: ProjectStatus;
  progress: number;
  notes: string;
  createdAt: string;
}
