import type { Recipe } from "../../recipes/recipeTypes";
import type { Project } from "../projectTypes";

interface ProjectCardProps {
  project: Project;
  recipe?: Recipe;
}

export function ProjectCard({ project, recipe }: ProjectCardProps) {
  return (
    <article className="project-card">
      <h3>{project.name}</h3>
      {recipe && <p className="card-meta">Oppskrift: {recipe.title}</p>}
      <label className="progress-label">
        <span>Fremgang: {project.progress} %</span>
        <progress value={project.progress} max={100} />
      </label>
      {project.notes && (
        <details className="card-notes">
          <summary>Notater</summary>
          <p>{project.notes}</p>
        </details>
      )}
      <p className="card-meta">
        Opprettet: {new Date(project.createdAt).toLocaleDateString("nb-NO")}
      </p>
    </article>
  );
}
