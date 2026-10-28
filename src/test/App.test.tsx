import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "../App";

const recipe = {
  id: "recipe-1",
  title: "Testgenser",
  category: "Genser",
  needleSizes: [4],
  difficulty: "Enkel",
  used: false,
  notes: "",
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("App", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", window.location.pathname);
  });

  it("shows the library with the recipe form closed", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Oppskriftsbibliotek" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Navn på oppskrift" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Legg til oppskrift" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps recipe input and the selected PDF when closing and reopening", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Legg til oppskrift" }));
    fireEvent.change(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
      { target: { value: "Min genser" } },
    );
    const pdf = new File(["test"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(screen.getByLabelText("PDF-oppskrift"), {
      target: { files: [pdf] },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Lukk oppskriftsskjema" }),
    );
    expect(
      screen.queryByRole("textbox", { name: "Navn på oppskrift" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Legg til oppskrift" }));
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("Min genser");
    expect(screen.getByText("Valgt fil: test.pdf")).toBeInTheDocument();
  });

  it("keeps project input when closing and reopening", () => {
    window.history.replaceState(null, "", "#/projects");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Nytt prosjekt" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Navn" }), {
      target: { value: "Vintergenser" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Lukk prosjektskjema" }),
    );
    expect(
      screen.queryByRole("textbox", { name: "Navn" }),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Nytt prosjekt" }));
    expect(screen.getByRole("textbox", { name: "Navn" })).toHaveValue(
      "Vintergenser",
    );
  });

  it("combines and resets the existing recipe filters", () => {
    localStorage.setItem(
      "strikkeoppskrift-recipes",
      JSON.stringify([
        recipe,
        {
          ...recipe,
          id: "recipe-2",
          title: "Vinterlue",
          category: "Lue",
          difficulty: "Middels",
        },
      ]),
    );
    render(<App />);
    const filters = within(
      screen.getByRole("region", { name: "Filtrer oppskrifter" }),
    );
    fireEvent.click(filters.getByRole("button", { name: "Filtrer" }));
    fireEvent.change(
      filters.getByRole("combobox", { name: "Type oppskrift" }),
      { target: { value: "Genser" } },
    );
    fireEvent.change(
      filters.getByRole("combobox", { name: "Vanskelighetsgrad" }),
      { target: { value: "Enkel" } },
    );
    expect(
      screen.getByRole("heading", { name: "Testgenser" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Vinterlue" }),
    ).not.toBeInTheDocument();
    fireEvent.click(filters.getByRole("button", { name: "Nullstill filtre" }));
    expect(
      screen.getByRole("heading", { name: "Vinterlue" }),
    ).toBeInTheDocument();
  });
});
