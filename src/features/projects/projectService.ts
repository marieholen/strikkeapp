import type { Project } from "./projectTypes";

const STORAGE_KEY = "strikkeapp-projects";

export function getProjects(): Project[] {
  const storedProjects = localStorage.getItem(STORAGE_KEY);

  if (!storedProjects) {
    return [];
  }

  return JSON.parse(storedProjects) as Project[];
}

export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addProject(project: Project): void {
  const projects = getProjects();

  saveProjects([...projects, project]);
}
