import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "../App";

describe("App", () => {
  it("renders the app title", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Strikkeapp" }),
    ).toBeInTheDocument();
  });

  it("renders the recipe form with the needle size field", () => {
    render(<App />);

    expect(screen.getByLabelText("Pinnestørrelse")).toBeInTheDocument();
  });
});
