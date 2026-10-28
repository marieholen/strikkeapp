import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import App from "../App";

function openPage(hash: string) {
  window.history.replaceState(null, "", hash);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

describe("navigation", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", window.location.pathname);
  });

  afterEach(() => {
    window.history.replaceState(null, "", window.location.pathname);
  });

  it("shows recipes by default", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Oppskriftsbibliotek" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Oppskrifter" })).toHaveAttribute(
      "href",
      "#/recipes",
    );
    expect(screen.getByRole("link", { name: "Oppskrifter" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Prosjekter" })).toHaveAttribute(
      "href",
      "#/projects",
    );
  });

  it("opens the projects page from a direct link", () => {
    openPage("#/projects");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Prosjekter" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Prosjekter" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("switches pages without losing unsaved form input", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Legg til oppskrift" }));
    fireEvent.change(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
      { target: { value: "Min genser" } },
    );
    act(() => openPage("#/projects"));
    expect(
      screen.getByRole("heading", { level: 1, name: "Prosjekter" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 1, name: "Oppskriftsbibliotek" }),
    ).not.toBeInTheDocument();
    act(() => openPage("#/recipes"));
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("Min genser");
  });

  it("shows a message for an unknown page", () => {
    openPage("#/unknown");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Siden finnes ikke" }),
    ).toBeInTheDocument();
  });
});
