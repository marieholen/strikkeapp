import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "../App";

const emptyMessage = "Du har ingen oppskrifter ennå.";
const noMatchesMessage = "Ingen oppskrifter passer søket eller filtrene.";

function seedRecipe() {
  localStorage.setItem(
    "strikkeoppskrift-recipes",
    JSON.stringify([
      {
        id: "recipe-1",
        title: "Vintergenser",
        category: "Genser",
        needleSizes: [4],
        difficulty: "Enkel",
        used: false,
        notes: "",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]),
  );
}

describe("recipe empty states", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "#/recipes");
  });

  afterEach(() => {
    window.history.replaceState(null, "", window.location.pathname);
  });

  it("shows the empty library message even when search is entered", () => {
    render(<App />);

    expect(screen.getByRole("status")).toHaveTextContent(emptyMessage);

    fireEvent.change(screen.getByRole("searchbox", { name: "Søk" }), {
      target: { value: "Sokker" },
    });

    expect(screen.getByRole("status")).toHaveTextContent(emptyMessage);
    expect(screen.queryByText(noMatchesMessage)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Nullstill filtre" }));

    expect(screen.getByRole("status")).toHaveTextContent(emptyMessage);
  });

  it("distinguishes unmatched search from an empty library and restores results", () => {
    seedRecipe();
    render(<App />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Søk" }), {
      target: { value: "Sokker" },
    });

    expect(screen.getByRole("status")).toHaveTextContent(noMatchesMessage);
    expect(screen.queryByText(emptyMessage)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Vintergenser" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Nullstill filtre" }));

    expect(screen.getByRole("searchbox", { name: "Søk" })).toHaveValue("");
    expect(
      screen.getByRole("heading", { name: "Vintergenser" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("restores results after resetting combined filters while collapsed", () => {
    seedRecipe();
    render(<App />);

    fireEvent.change(screen.getByRole("searchbox", { name: "Søk" }), {
      target: { value: "Vinter" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Filtrer" }));
    fireEvent.change(screen.getByRole("combobox", { name: "Type oppskrift" }), {
      target: { value: "Sokker" },
    });

    expect(screen.getByRole("status")).toHaveTextContent(noMatchesMessage);

    fireEvent.click(screen.getByRole("button", { name: "Filtrer (1)" }));

    expect(screen.getByRole("status")).toHaveTextContent(noMatchesMessage);

    fireEvent.click(screen.getByRole("button", { name: "Nullstill filtre" }));

    expect(
      screen.getByRole("heading", { name: "Vintergenser" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Filtrer" }));

    expect(
      screen.getByRole("combobox", { name: "Type oppskrift" }),
    ).toHaveValue("Alle");
  });
});
