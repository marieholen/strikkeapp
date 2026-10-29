import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "../App";
import { savePdf } from "../features/recipes/pdfStorage";

vi.mock("../features/recipes/pdfStorage", () => ({
  savePdf: vi.fn(),
  getPdf: vi.fn(),
}));

function fillRecipeForm() {
  fireEvent.click(screen.getByRole("button", { name: "Legg til oppskrift" }));
  fireEvent.change(screen.getByRole("textbox", { name: "Navn på oppskrift" }), {
    target: { value: "Vintergenser" },
  });
  fireEvent.change(screen.getByRole("combobox", { name: "Type oppskrift" }), {
    target: { value: "Genser" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Pinnestørrelse" }), {
    target: { value: "4" },
  });
  fireEvent.change(
    screen.getByRole("combobox", { name: "Vanskelighetsgrad" }),
    {
      target: { value: "Enkel" },
    },
  );
  fireEvent.click(
    screen.getByRole("checkbox", { name: "Har brukt oppskriften" }),
  );
  fireEvent.change(screen.getByRole("textbox", { name: "Notater" }), {
    target: { value: "Strikkes i ull." },
  });
}

function selectPdf() {
  const file = new File(["test"], "oppskrift.pdf", { type: "application/pdf" });
  fireEvent.change(screen.getByLabelText("PDF-oppskrift"), {
    target: { files: [file] },
  });
  return file;
}

function savedRecipes() {
  return JSON.parse(localStorage.getItem("strikkeoppskrift-recipes") ?? "[]");
}

describe("recipe saving", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal("alert", vi.fn());
    vi.mocked(savePdf).mockResolvedValue("pdf-1");
    window.history.replaceState(null, "", window.location.pathname);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("waits for PDF saving and clears all fields after success", async () => {
    let finishSaving!: (id: string) => void;
    vi.mocked(savePdf).mockReturnValueOnce(
      new Promise((resolve) => {
        finishSaving = resolve;
      }),
    );
    render(<App />);
    fillRecipeForm();
    const file = selectPdf();
    const fileInput = screen.getByLabelText(
      "PDF-oppskrift",
    ) as HTMLInputElement;
    // Simulated file selection does not set the native filename in jsdom.
    const clearFileInput = vi.spyOn(fileInput, "value", "set");

    fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));

    expect(screen.getByRole("button", { name: "Lagrer..." })).toBeDisabled();
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("Vintergenser");
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toBeDisabled();
    expect(savedRecipes()).toHaveLength(0);
    expect(savePdf).toHaveBeenCalledWith(file);

    await act(async () => finishSaving("pdf-1"));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Lagre oppskrift" }),
      ).toBeEnabled();
    });
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("");
    expect(
      screen.getByRole("combobox", { name: "Type oppskrift" }),
    ).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Pinnestørrelse" })).toHaveValue(
      "",
    );
    expect(
      screen.getByRole("combobox", { name: "Vanskelighetsgrad" }),
    ).toHaveValue("");
    expect(
      screen.getByRole("checkbox", { name: "Har brukt oppskriften" }),
    ).not.toBeChecked();
    expect(screen.getByRole("textbox", { name: "Notater" })).toHaveValue("");
    expect(
      screen.queryByText("Valgt fil: oppskrift.pdf"),
    ).not.toBeInTheDocument();
    expect(clearFileInput).toHaveBeenCalledWith("");
    expect(savedRecipes()).toEqual([
      expect.objectContaining({ title: "Vintergenser", pdfId: "pdf-1" }),
    ]);
    expect(
      screen.getByRole("heading", { name: "Vintergenser" }),
    ).toBeInTheDocument();
  });

  it("keeps input and the PDF after failure and allows retrying", async () => {
    vi.mocked(savePdf).mockRejectedValueOnce(new Error("Storage unavailable"));
    render(<App />);
    fillRecipeForm();
    const file = selectPdf();
    fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Kunne ikke lagre oppskriften. Prøv igjen.",
    );
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("Vintergenser");
    expect(screen.getByRole("textbox", { name: "Notater" })).toHaveValue(
      "Strikkes i ull.",
    );
    expect(screen.getByText("Valgt fil: oppskrift.pdf")).toBeInTheDocument();
    expect(savedRecipes()).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));
    await waitFor(() => expect(savedRecipes()).toHaveLength(1));
    expect(savePdf).toHaveBeenLastCalledWith(file);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("keeps input and existing recipes if localStorage saving fails", async () => {
    const original = JSON.stringify([
      {
        id: "existing-recipe",
        title: "Tidligere oppskrift",
        category: "Genser",
        needleSizes: [4],
        difficulty: "Enkel",
        used: false,
        notes: "",
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ]);
    localStorage.setItem("strikkeoppskrift-recipes", original);
    render(<App />);
    fillRecipeForm();
    vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
      throw new Error("Storage full");
    });
    fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Kunne ikke lagre oppskriften.",
    );
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("Vintergenser");
    expect(localStorage.getItem("strikkeoppskrift-recipes")).toBe(original);
    expect(
      screen.queryByRole("heading", { name: "Vintergenser" }),
    ).not.toBeInTheDocument();
    expect(savePdf).not.toHaveBeenCalled();
    expect(
      screen.getByRole("heading", { name: "Tidligere oppskrift" }),
    ).toBeInTheDocument();
  });

  it("saves a recipe without a PDF", async () => {
    render(<App />);
    fillRecipeForm();
    fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));

    await waitFor(() =>
      expect(
        screen.getByRole("textbox", { name: "Navn på oppskrift" }),
      ).toHaveValue(""),
    );
    expect(savedRecipes()).toHaveLength(1);
    expect(savedRecipes()[0]).not.toHaveProperty("pdfId");
    expect(savePdf).not.toHaveBeenCalled();
  });

  it("does not submit twice while PDF saving is pending", async () => {
    let finishSaving!: (id: string) => void;
    vi.mocked(savePdf).mockReturnValueOnce(
      new Promise((resolve) => {
        finishSaving = resolve;
      }),
    );
    render(<App />);
    fillRecipeForm();
    selectPdf();
    const form = screen
      .getByRole("button", { name: "Lagre oppskrift" })
      .closest("form")!;

    act(() => {
      fireEvent.submit(form);
      fireEvent.submit(form);
    });

    expect(savePdf).toHaveBeenCalledOnce();
    await act(async () => finishSaving("pdf-1"));
    await waitFor(() => expect(savedRecipes()).toHaveLength(1));
  });

  it("does not save while an invalid PDF is selected", () => {
    render(<App />);
    fillRecipeForm();
    fireEvent.change(screen.getByLabelText("PDF-oppskrift"), {
      target: {
        files: [new File(["image"], "image.png", { type: "image/png" })],
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));

    expect(screen.getByText("Filen må være en PDF.")).toBeInTheDocument();
    expect(savedRecipes()).toHaveLength(0);
    expect(savePdf).not.toHaveBeenCalled();
    expect(
      screen.getByRole("textbox", { name: "Navn på oppskrift" }),
    ).toHaveValue("Vintergenser");
  });

  it("allows removing an invalid file before saving without a PDF", async () => {
    render(<App />);
    fillRecipeForm();
    fireEvent.change(screen.getByLabelText("PDF-oppskrift"), {
      target: {
        files: [new File(["image"], "image.png", { type: "image/png" })],
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Fjern fil" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));
    await waitFor(() => expect(savedRecipes()).toHaveLength(1));
    expect(savedRecipes()[0]).not.toHaveProperty("pdfId");
    expect(savePdf).not.toHaveBeenCalled();
  });

  it.each(["abc", "0", "-2", "4, abc", "4,"])(
    "blocks invalid needle sizes (%s) and allows correction",
    async (input) => {
      render(<App />);
      fillRecipeForm();
      const sizes = screen.getByRole("textbox", { name: "Pinnestørrelse" });
      fireEvent.change(sizes, { target: { value: input } });
      fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));

      expect(screen.getByRole("alert")).toHaveTextContent("Bruk positive tall");
      expect(sizes).toHaveAttribute("aria-invalid", "true");
      expect(sizes).toHaveValue(input);
      expect(savedRecipes()).toHaveLength(0);
      expect(savePdf).not.toHaveBeenCalled();

      fireEvent.change(sizes, { target: { value: "3.5, 4" } });
      fireEvent.click(screen.getByRole("button", { name: "Lagre oppskrift" }));
      await waitFor(() => expect(savedRecipes()).toHaveLength(1));
      expect(savedRecipes()[0].needleSizes).toEqual([3.5, 4]);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    },
  );
});
