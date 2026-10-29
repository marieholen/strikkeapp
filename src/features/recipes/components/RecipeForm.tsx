import { useId, useRef, useState } from "react";

import {
  recipeCategories,
  recipeDifficulties,
  type Recipe,
  type RecipeCategory,
  type RecipeDifficulty,
} from "../recipeTypes";

import {
  parseNeedleSizes,
  validateRecipeForm,
  type RecipeFormData,
  type RecipeFormErrors,
} from "../recipeValidation";

import { validatePdfFile } from "../pdfValidation";

interface RecipeFormProps {
  onCreate: (recipe: Recipe, pdfFile?: File) => Promise<void>;
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
  const needleHelpId = useId();
  const needleErrorId = useId();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<RecipeFormErrors>({});
  const [pdfFile, setPdfFile] = useState<File | undefined>();
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);

  function clearPdf() {
    setPdfFile(undefined);
    setPdfError(null);
    if (pdfInputRef.current) {
      pdfInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (savingRef.current) return;

    setSaveError(null);
    const validationErrors = validateRecipeForm(form);
    const needleSizes = parseNeedleSizes(form.needleSizes);

    if (
      Object.keys(validationErrors).length > 0 ||
      pdfError ||
      needleSizes === null
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    savingRef.current = true;
    setIsSaving(true);

    try {
      const recipe: Recipe = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        category: form.category as RecipeCategory,
        needleSizes,
        difficulty: form.difficulty as RecipeDifficulty,
        used: form.used,
        notes: form.notes.trim(),
        createdAt: new Date().toISOString(),
      };

      await onCreate(recipe, pdfFile);

      setForm(initialForm);
      setErrors({});
      clearPdf();
    } catch {
      setSaveError("Kunne ikke lagre oppskriften. Prøv igjen.");
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={isSaving}>
      <h2>Ny oppskrift</h2>

      <div>
        <label>
          Navn på oppskrift
          <input
            disabled={isSaving}
            type="text"
            value={form.title}
            onChange={(event) =>
              setForm({ ...form, title: event.target.value })
            }
          />
        </label>

        {errors.title && <p>{errors.title}</p>}
      </div>

      <div>
        <label>
          Type oppskrift
          <select
            disabled={isSaving}
            value={form.category}
            onChange={(event) =>
              setForm({ ...form, category: event.target.value })
            }
          >
            <option value="">Velg type oppskrift</option>

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
          Pinnestørrelse
          <input
            disabled={isSaving}
            type="text"
            placeholder="For eksempel 3.5, 4"
            aria-describedby={`${needleHelpId}${errors.needleSizes ? ` ${needleErrorId}` : ""}`}
            aria-invalid={Boolean(errors.needleSizes)}
            value={form.needleSizes}
            onChange={(event) =>
              setForm({ ...form, needleSizes: event.target.value })
            }
          />
        </label>

        <p id={needleHelpId}>
          Oppgi størrelser i mm. Bruk punktum som desimaltegn og komma mellom
          størrelsene, for eksempel 3.5, 4.
        </p>
        {errors.needleSizes && (
          <p id={needleErrorId} role="alert">
            {errors.needleSizes}
          </p>
        )}
      </div>

      <div>
        <label>
          Vanskelighetsgrad
          <select
            disabled={isSaving}
            value={form.difficulty}
            onChange={(event) =>
              setForm({ ...form, difficulty: event.target.value })
            }
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
            disabled={isSaving}
            type="checkbox"
            checked={form.used}
            onChange={(event) =>
              setForm({ ...form, used: event.target.checked })
            }
          />
          Har brukt oppskriften
        </label>
      </div>

      <div>
        <label>
          Notater
          <textarea
            disabled={isSaving}
            value={form.notes}
            onChange={(event) =>
              setForm({ ...form, notes: event.target.value })
            }
          />
        </label>
      </div>

      <div>
        <label>
          PDF-oppskrift
          <input
            disabled={isSaving}
            ref={pdfInputRef}
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

        {pdfError && <p role="alert">{pdfError}</p>}

        {pdfFile && <p>Valgt fil: {pdfFile.name}</p>}

        {(pdfFile || pdfError) && (
          <button
            type="button"
            className="secondary-button"
            disabled={isSaving}
            onClick={clearPdf}
          >
            Fjern fil
          </button>
        )}
      </div>

      {saveError && (
        <p className="save-error" role="alert">
          {saveError}
        </p>
      )}

      <button type="submit" disabled={isSaving}>
        {isSaving ? "Lagrer..." : "Lagre oppskrift"}
      </button>
    </form>
  );
}
