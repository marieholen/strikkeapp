import { describe, expect, it } from "vitest";

import { validatePdfFile } from "../features/recipes/pdfValidation";

describe("validatePdfFile", () => {
  it("accepts PDF files", () => {
    const file = new File(["pdf content"], "pattern.pdf", {
      type: "application/pdf",
    });

    expect(validatePdfFile(file)).toBeNull();
  });

  it("rejects non-PDF files", () => {
    const file = new File(["image content"], "pattern.png", {
      type: "image/png",
    });

    expect(validatePdfFile(file)).toBe("Filen må være en PDF.");
  });
});
