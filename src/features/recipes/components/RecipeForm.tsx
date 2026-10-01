import { useState } from 'react'
import {
  recipeCategories,
  recipeDifficulties,
  type Recipe,
  type RecipeCategory,
  type RecipeDifficulty,
} from '../recipeTypes'
import {
  validateRecipeForm,
  type RecipeFormData,
} from '../recipeValidation'
import type { RecipeFormErrors } from '../recipeValidation'

interface RecipeFormProps {
  onCreate: (recipe: Recipe) => void
}

const initialForm: RecipeFormData = {
  title: '',
  category: '',
  needleSizes: '',
  difficulty: '',
  used: false,
  notes: '',
}

export function RecipeForm({ onCreate }: RecipeFormProps) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState<RecipeFormErrors>({})

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const validationErrors = validateRecipeForm(form)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const recipe: Recipe = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      category: form.category as RecipeCategory,
      needleSizes: form.needleSizes
        .split(',')
        .map((size) => Number(size.trim()))
        .filter((size) => !Number.isNaN(size)),
      difficulty: form.difficulty as RecipeDifficulty,
      used: form.used,
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    }

    onCreate(recipe)
    setForm(initialForm)
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Ny oppskrift</h2>

      <label>
        Navn
        <input
          value={form.title}
          onChange={(event) =>
            setForm({
              ...form,
              title: event.target.value,
            })
          }
        />
      </label>

      {errors.title && <p>{errors.title}</p>}

      <label>
        Kategori
        <select
          value={form.category}
          onChange={(event) =>
            setForm({
              ...form,
              category: event.target.value,
            })
          }
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

      <label>
        Pinestørrelser
        <input
          placeholder="For eksempel 4, 4.5"
          value={form.needleSizes}
          onChange={(event) =>
            setForm({
              ...form,
              needleSizes: event.target.value,
            })
          }
        />
      </label>

      {errors.needleSizes && <p>{errors.needleSizes}</p>}

      <label>
        Vanskelighetsgrad
        <select
          value={form.difficulty}
          onChange={(event) =>
            setForm({
              ...form,
              difficulty: event.target.value,
            })
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

      <label>
        <input
          type="checkbox"
          checked={form.used}
          onChange={(event) =>
            setForm({
              ...form,
              used: event.target.checked,
            })
          }
        />
        Har brukt denne oppskriften
      </label>

      <label>
        Notater
        <textarea
          value={form.notes}
          onChange={(event) =>
            setForm({
              ...form,
              notes: event.target.value,
            })
          }
        />
      </label>

      <button type="submit">Lagre oppskrift</button>
    </form>
  )
}