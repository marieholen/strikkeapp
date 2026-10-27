import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import App from "../App";

function openPage(hash: string) {
  window.location.hash = hash;
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
      screen.getByRole("heading", { name: "Ny oppskrift" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Oppskrifter" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("opens the projects page from a direct link", () => {
    openPage("#/projects");

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Nytt prosjekt" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Prosjekter" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("switches between recipes and projects", () => {
    render(<App />);

    act(() => {
      openPage("#/projects");
    });

    expect(
      screen.getByRole("heading", { name: "Nytt prosjekt" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Ny oppskrift" }),
    ).not.toBeInTheDocument();

    act(() => {
      openPage("#/recipes");
    });

    expect(
      screen.getByRole("heading", { name: "Ny oppskrift" }),
    ).toBeInTheDocument();
  });

  it("shows a message for an unknown page", () => {
    openPage("#/unknown");

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Siden finnes ikke" }),
    ).toBeInTheDocument();
  });
});
