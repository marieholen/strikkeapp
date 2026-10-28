import type { Recipe } from "../../recipes/recipeTypes";
import { projectStatuses, type Project } from "../projectTypes";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  recipes: Recipe[];
}

export function ProjectList({ projects, recipes }: ProjectListProps) {
  return (
    <section aria-label="Prosjekter" className="project-board">
      {projectStatuses.map((status) => {
        const statusProjects = projects.filter(
          (project) => project.status === status,
        );

        return (
          <section key={status} className="project-column" aria-label={status}>
            <div className="column-heading">
              <h2>{status}</h2>
              <span className="count-badge">{statusProjects.length}</span>
            </div>
            {statusProjects.length === 0 ? (
              <p className="card-meta">Ingen prosjekter ennå.</p>
            ) : (
              statusProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  recipe={recipes.find(
                    (recipe) => recipe.id === project.recipeId,
                  )}
                />
              ))
            )}
          </section>
        );
      })}
    </section>
  );
}
