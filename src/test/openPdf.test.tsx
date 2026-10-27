import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "../App";
import { getPdf } from "../features/recipes/pdfStorage";

vi.mock("../features/recipes/pdfStorage", () => ({
  getPdf: vi.fn(),
  savePdf: vi.fn(),
}));

describe("opening a saved PDF", () => {
  beforeEach(() => {
    localStorage.setItem(
      "strikkeoppskrift-recipes",
      JSON.stringify([
        {
          id: "recipe-1",
          title: "Testoppskrift",
          category: "Genser",
          needleSizes: [4],
          difficulty: "Enkel",
          used: false,
          notes: "",
          pdfId: "pdf-1",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ]),
    );
    vi.stubGlobal("alert", vi.fn());
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:test"),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("opens a tab before loading the PDF and shows it when ready", async () => {
    let finishLoading!: (pdf: Blob) => void;
    vi.mocked(getPdf).mockReturnValueOnce(
      new Promise((resolve) => {
        finishLoading = resolve;
      }),
    );
    const pdfWindow = { location: { href: "" }, close: vi.fn(), opener: null };
    const open = vi
      .spyOn(window, "open")
      .mockReturnValueOnce(pdfWindow as unknown as Window);
    const pdf = new Blob(["test"], { type: "application/pdf" });

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Åpne PDF" }));

    expect(open).toHaveBeenCalledOnce();
    expect(getPdf).toHaveBeenCalledWith("pdf-1");
    finishLoading(pdf);

    await waitFor(() => expect(pdfWindow.location.href).toBe("blob:test"));
    expect(URL.createObjectURL).toHaveBeenCalledWith(pdf);
  });

  it("shows an error when the browser blocks the new tab", () => {
    vi.spyOn(window, "open").mockReturnValueOnce(null);

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Åpne PDF" }));

    expect(window.alert).toHaveBeenCalledWith(
      "Kunne ikke åpne PDF-filen. Tillat popup-vinduer og prøv igjen.",
    );
    expect(getPdf).not.toHaveBeenCalled();
  });

  it("closes the new tab and shows an error if loading fails", async () => {
    vi.mocked(getPdf).mockRejectedValueOnce(new Error("Missing PDF"));
    const pdfWindow = { location: { href: "" }, close: vi.fn(), opener: null };
    vi.spyOn(window, "open").mockReturnValueOnce(
      pdfWindow as unknown as Window,
    );

    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Åpne PDF" }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith("Kunne ikke åpne PDF-filen."),
    );
    expect(pdfWindow.close).toHaveBeenCalledOnce();
  });
});
