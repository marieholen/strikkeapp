import { useId, useState } from "react";

import { recipeCategories, recipeDifficulties } from "../recipeTypes";
import type { RecipeFilters as RecipeFiltersState } from "../recipeFilters";

interface RecipeFiltersProps {
  filters: RecipeFiltersState;
  onChange: (filters: RecipeFiltersState) => void;
}

export function RecipeFilters({ filters, onChange }: RecipeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const activeFilters = [
    filters.category,
    filters.difficulty,
    filters.used,
  ].filter((value) => value !== "Alle").length;

  return (
    <section aria-label="Filtrer oppskrifter" className="recipe-filters">
      <div className="filter-toolbar">
        <label className="recipe-search">
          Søk
          <input
            type="search"
            placeholder="Søk etter navn"
            value={filters.search}
            onChange={(event) =>
              onChange({ ...filters, search: event.target.value })
            }
          />
        </label>

        <button
          type="button"
          className="secondary-button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen(!isOpen)}
        >
          Filtrer{activeFilters > 0 ? ` (${activeFilters})` : ""}
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            onChange({
              search: "",
              category: "Alle",
              needleSize: "Alle",
              difficulty: "Alle",
              used: "Alle",
            })
          }
        >
          Nullstill filtre
        </button>
      </div>

      <div id={panelId} className="filter-options" hidden={!isOpen}>
        <label>
          Type oppskrift
          <select
            value={filters.category}
            onChange={(event) =>
              onChange({
                ...filters,
                category: event.target.value as RecipeFiltersState["category"],
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
                difficulty: event.target
                  .value as RecipeFiltersState["difficulty"],
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
                used: event.target.value as RecipeFiltersState["used"],
              })
            }
          >
            <option value="Alle">Alle</option>
            <option value="Brukt">Brukt</option>
            <option value="Ikke brukt">Ikke brukt</option>
          </select>
        </label>
      </div>
    </section>
  );
}
