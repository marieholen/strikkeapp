import { useState } from "react";

import type { Recipe } from "../../recipes/recipeTypes";

import {
  projectStatuses,
  type Project,
  type ProjectStatus,
} from "../projectTypes";

import {
  validateProjectForm,
  type ProjectFormData,
  type ProjectFormErrors,
} from "../projectValidation";

interface ProjectFormProps {
  recipes: Recipe[];
  onCreate: (project: Project) => void;
}

const initialForm: ProjectFormData = {
  name: "",
  recipeId: "",
  status: "",
  progress: 0,
  notes: "",
};

export function ProjectForm({ recipes, onCreate }: ProjectFormProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<ProjectFormErrors>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateProjectForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const project: Project = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      recipeId: form.recipeId,
      status: form.status as ProjectStatus,
      progress: form.progress,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onCreate(project);

    setForm(initialForm);
    setErrors({});
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nytt prosjekt</h2>

      <div>
        <label>
          Navn
          <input
            type="text"
            value={form.name}
            onChange={(event) => {
              setForm({
                ...form,
                name: event.target.value,
              });
            }}
          />
        </label>

        {errors.name && <p>{errors.name}</p>}
      </div>

      <div>
        <label>
          Oppskrift
          <select
            value={form.recipeId}
            onChange={(event) => {
              setForm({
                ...form,
                recipeId: event.target.value,
              });
            }}
          >
            <option value="">Velg oppskrift</option>

            {recipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.title}
              </option>
            ))}
          </select>
        </label>

        {errors.recipeId && <p>{errors.recipeId}</p>}
      </div>

      <div>
        <label>
          Status
          <select
            value={form.status}
            onChange={(event) => {
              setForm({
                ...form,
                status: event.target.value,
              });
            }}
          >
            <option value="">Velg status</option>

            {projectStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        {errors.status && <p>{errors.status}</p>}
      </div>

      <div>
        <label>
          Fremgang: {form.progress} %
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={form.progress}
            onChange={(event) => {
              setForm({
                ...form,
                progress: Number(event.target.value),
              });
            }}
          />
        </label>

        {errors.progress && <p>{errors.progress}</p>}
      </div>

      <div>
        <label>
          Notater
          <textarea
            value={form.notes}
            onChange={(event) => {
              setForm({
                ...form,
                notes: event.target.value,
              });
            }}
          />
        </label>
      </div>

      <button type="submit">Lagre prosjekt</button>
    </form>
  );
}
