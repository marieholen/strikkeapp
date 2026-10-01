import type { Recipe } from "../../recipes/recipeTypes";

import type { Project } from "../projectTypes";

interface ProjectCardProps {
  project: Project;
  recipe?: Recipe;
}

export function ProjectCard({ project, recipe }: ProjectCardProps) {
  return (
    <article>
      <h3>{project.name}</h3>

      {recipe && <p>Oppskrift: {recipe.title}</p>}

      <p>Status: {project.status}</p>

      <p>Fremgang: {project.progress} %</p>

      {project.notes && <p>Notater: {project.notes}</p>}

      <p>
        Opprettet: {new Date(project.createdAt).toLocaleDateString("nb-NO")}
      </p>
    </article>
  );
}
