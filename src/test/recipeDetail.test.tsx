import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "../App";
import type { Recipe } from "../features/recipes/recipeTypes";

const recipe: Recipe = {
  id: "recipe /1",
  title: "Vintergenser",
  category: "Genser",
  needleSizes: [3.5, 4],
  difficulty: "Middels",
  used: true,
  notes: "Legg opp 80 masker.\n\nStrikk rundt.",
  createdAt: "2026-01-01T00:00:00.000Z",
};
const detailHash = `#/recipes/${encodeURIComponent(recipe.id)}`;

function navigate(hash: string) {
  window.history.replaceState(null, "", hash);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

describe("recipe details", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "#/recipes");
    localStorage.setItem("strikkeoppskrift-recipes", JSON.stringify([recipe]));
  });
  afterEach(() => {
    window.history.replaceState(null, "", window.location.pathname);
  });

  it("links every card to its details and keeps notes off the card", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "Åpne" })).toHaveAttribute(
      "href",
      detailHash,
    );
    expect(
      screen.queryByText("Middels", { selector: ".recipe-card p" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Legg opp/)).not.toBeInTheDocument();
    act(() => navigate(detailHash));
    expect(
      screen.getByRole("heading", { level: 1, name: recipe.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("3.5, 4 mm")).toBeInTheDocument();
    expect(screen.getByText("Middels", { selector: "dd" })).toBeInTheDocument();
    expect(screen.getByText("Strikket før")).toBeInTheDocument();
    expect(screen.getByText(/Legg opp/).textContent).toBe(recipe.notes);
    expect(
      screen.queryByRole("button", { name: "Åpne PDF" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oppskrifter" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("loads saved details from a direct link and after remounting", () => {
    navigate(detailHash);
    const first = render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: recipe.title }),
    ).toBeInTheDocument();
    first.unmount();
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: recipe.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tilbake" })).toHaveAttribute(
      "href",
      "#/recipes",
    );
  });

  it("shows helpful empty notes and PDF messages", () => {
    localStorage.setItem(
      "strikkeoppskrift-recipes",
      JSON.stringify([{ ...recipe, notes: "" }]),
    );
    navigate(detailHash);
    render(<App />);
    expect(
      screen.getByText("Ingen notater eller fremgangsmåte er lagt til."),
    ).toBeInTheDocument();
    expect(screen.getByText("Ingen PDF er lagt til.")).toBeInTheDocument();
  });

  it("offers a way back for an unknown recipe", () => {
    navigate("#/recipes/missing");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Oppskriften finnes ikke" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Tilbake" })).toHaveAttribute(
      "href",
      "#/recipes",
    );
  });

  it("handles malformed encoded IDs without crashing", () => {
    navigate("#/recipes/%E0%A4%A");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Siden finnes ikke" }),
    ).toBeInTheDocument();
  });

  it("keeps search and unsaved form input when returning to the library", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Legg til oppskrift" }));
    fireEvent.change(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
      { target: { value: "Uferdig" } },
    );
    const search = screen.getByRole("searchbox", { name: /Søk/ });
    fireEvent.change(search, { target: { value: "Vinter" } });
    act(() => navigate(detailHash));
    act(() => navigate("#/recipes"));
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("Uferdig");
    expect(screen.getByRole("searchbox", { name: /Søk/ })).toHaveValue(
      "Vinter",
    );
  });
});
