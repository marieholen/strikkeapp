import type { Recipe } from "../../recipes/recipeTypes";

import { projectStatuses, type Project } from "../projectTypes";

import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  recipes: Recipe[];
}

export function ProjectList({ projects, recipes }: ProjectListProps) {
  return (
    <section aria-label="Prosjekter">
      <h2>Prosjekter</h2>

      {projectStatuses.map((status) => {
        const statusProjects = projects.filter(
          (project) => project.status === status,
        );

        return (
          <section key={status}>
            <h3>{status}</h3>

            {statusProjects.length === 0 ? (
              <p>Ingen prosjekter med status {status.toLowerCase()}.</p>
            ) : (
              statusProjects.map((project) => {
                const recipe = recipes.find(
                  (item) => item.id === project.recipeId,
                );

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    recipe={recipe}
                  />
                );
              })
            )}
          </section>
        );
      })}
    </section>
  );
}
