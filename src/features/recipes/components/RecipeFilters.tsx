import {
  recipeCategories,
  recipeDifficulties,
} from '../recipeTypes'
import type { RecipeFilters as RecipeFiltersState } from '../recipeFilters'

interface RecipeFiltersProps {
  filters: RecipeFiltersState
  onChange: (filters: RecipeFiltersState) => void
}

export function RecipeFilters({
  filters,
  onChange,
}: RecipeFiltersProps) {
  return (
    <section aria-label="Filtrer oppskrifter">
      <label>
        Søk
        <input
          type="search"
          value={filters.search}
          onChange={(event) =>
            onChange({
              ...filters,
              search: event.target.value,
            })
          }
        />
      </label>

      <label>
        Kategori
        <select
          value={filters.category}
          onChange={(event) =>
            onChange({
              ...filters,
              category: event.target.value as RecipeFiltersState['category'],
            })
          }
        >
          <option value="Alle">Alle</option>

          {recipeCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Vanskelighetsgrad
        <select
          value={filters.difficulty}
          onChange={(event) =>
            onChange({
              ...filters,
              difficulty:
                event.target.value as RecipeFiltersState['difficulty'],
            })
          }
        >
          <option value="Alle">Alle</option>

          {recipeDifficulties.map((difficulty) => (
            <option key={difficulty} value={difficulty}>
              {difficulty}
            </option>
          ))}
        </select>
      </label>

      <label>
        Status
        <select
          value={filters.used}
          onChange={(event) =>
            onChange({
              ...filters,
              used: event.target.value as RecipeFiltersState['used'],
            })
          }
        >
          <option value="Alle">Alle</option>
          <option value="Brukt">Brukt</option>
          <option value="Ikke brukt">Ikke brukt</option>
        </select>
      </label>

      <button
        type="button"
        onClick={() =>
          onChange({
            search: '',
            category: 'Alle',
            needleSize: 'Alle',
            difficulty: 'Alle',
            used: 'Alle',
          })
        }
      >
        Nullstill filtre
      </button>
    </section>
  )
}