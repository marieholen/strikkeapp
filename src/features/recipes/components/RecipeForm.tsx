import { useState } from "react";

import {
  recipeCategories,
  recipeDifficulties,
  type Recipe,
  type RecipeCategory,
  type RecipeDifficulty,
} from "../recipeTypes";

import {
  validateRecipeForm,
  type RecipeFormData,
  type RecipeFormErrors,
} from "../recipeValidation";

import { validatePdfFile } from "../pdfValidation";

interface RecipeFormProps {
  onCreate: (recipe: Recipe, pdfFile?: File) => void;
}

const initialForm: RecipeFormData = {
  title: "",
  category: "",
  needleSizes: "",
  difficulty: "",
  used: false,
  notes: "",
};

export function RecipeForm({ onCreate }: RecipeFormProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<RecipeFormErrors>({});

  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [pdfError, setPdfError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateRecipeForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const recipe: Recipe = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category as RecipeCategory,
      needleSizes: form.needleSizes
        .split(",")
        .map((size) => Number(size.trim()))
        .filter((size) => !Number.isNaN(size)),
      difficulty: form.difficulty as RecipeDifficulty,
      used: form.used,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    onCreate(recipe, pdfFile);

    setForm(initialForm);
    setErrors({});
    setPdfFile(undefined);
    setPdfError(null);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ny oppskrift</h2>

      <div>
        <label>
          Navn
          <input
            type="text"
            value={form.title}
            onChange={(event) => {
              setForm({
                ...form,
                title: event.target.value,
              });
            }}
          />
        </label>

        {errors.title && <p>{errors.title}</p>}
      </div>

      <div>
        <label>
          Kategori
          <select
            value={form.category}
            onChange={(event) => {
              setForm({
                ...form,
                category: event.target.value,
              });
            }}
          >
            <option value="">Velg kategori</option>

            {recipeCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        {errors.category && <p>{errors.category}</p>}
      </div>

      <div>
        <label>
          Pinestørrelse
          <input
            type="text"
            placeholder="For eksempel 3.5, 4"
            value={form.needleSizes}
            onChange={(event) => {
              setForm({
                ...form,
                needleSizes: event.target.value,
              });
            }}
          />
        </label>

        {errors.needleSizes && <p>{errors.needleSizes}</p>}
      </div>

      <div>
        <label>
          Vanskelighetsgrad
          <select
            value={form.difficulty}
            onChange={(event) => {
              setForm({
                ...form,
                difficulty: event.target.value,
              });
            }}
          >
            <option value="">Velg vanskelighetsgrad</option>

            {recipeDifficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </label>

        {errors.difficulty && <p>{errors.difficulty}</p>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={form.used}
            onChange={(event) => {
              setForm({
                ...form,
                used: event.target.checked,
              });
            }}
          />
          Har brukt oppskriften
        </label>
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

      <div>
        <label>
          PDF-oppskrift
          <input
            type="file"
            accept="application/pdf"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                setPdfFile(undefined);
                setPdfError(null);
                return;
              }

              const error = validatePdfFile(file);

              if (error) {
                setPdfFile(undefined);
                setPdfError(error);
                return;
              }

              setPdfFile(file);
              setPdfError(null);
            }}
          />
        </label>

        {pdfError && <p>{pdfError}</p>}

        {pdfFile && <p>Valgt fil: {pdfFile.name}</p>}
      </div>

      <button type="submit">Lagre oppskrift</button>
    </form>
  );
}
