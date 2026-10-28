import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecipeFilters } from "../features/recipes/components/RecipeFilters";
import type { RecipeFilters as Filters } from "../features/recipes/recipeFilters";

function TestFilters() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    category: "Alle",
    needleSize: "Alle",
    difficulty: "Alle",
    used: "Alle",
  });

  return <RecipeFilters filters={filters} onChange={setFilters} />;
}

describe("recipe filters", () => {
  it("keeps search visible while the other controls are collapsed", () => {
    render(<TestFilters />);

    expect(screen.getByRole("searchbox", { name: "Søk" })).toBeVisible();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filtrer" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("keeps selected filters when closing and reopening", () => {
    render(<TestFilters />);
    fireEvent.click(screen.getByRole("button", { name: "Filtrer" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Type oppskrift" }), {
      target: { value: "Genser" },
    });

    const toggle = screen.getByRole("button", { name: "Filtrer (1)" });
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(toggle);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    expect(
      screen.getByRole("combobox", { name: "Type oppskrift" }),
    ).toHaveValue("Genser");
  });

  it("resets search and filters even when the controls are collapsed", () => {
    render(<TestFilters />);
    fireEvent.change(screen.getByRole("searchbox", { name: "Søk" }), {
      target: { value: "Genser" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Filtrer" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Status" }), {
      target: { value: "Brukt" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Filtrer (1)" }));
    fireEvent.click(screen.getByRole("button", { name: "Nullstill filtre" }));

    expect(screen.getByRole("searchbox", { name: "Søk" })).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: "Filtrer" }));
    expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue(
      "Alle",
    );
  });
});
