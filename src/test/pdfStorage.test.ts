// @vitest-environment node
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";

import { getPdf, savePdf } from "../features/recipes/pdfStorage";

function resetDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase("strikkeapp");

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

function storeOldPdf(id: string, pdf: Blob): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("strikkeapp", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("pdfs");
    };

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const database = request.result;
      const transaction = database.transaction("pdfs", "readwrite");

      transaction.objectStore("pdfs").put(pdf, id);

      transaction.oncomplete = () => {
        database.close();
        resolve();
      };

      transaction.onerror = () => {
        database.close();
        reject(transaction.error);
      };
    };
  });
}

describe("PDF storage", () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  it("saves and reads a PDF stored as bytes", async () => {
    const bytes = new TextEncoder().encode("PDF test").buffer;
    const file = new File([bytes], "test.pdf", {
      type: "application/pdf",
    });

    const id = await savePdf(file);
    const result = await getPdf(id);

    expect(result.type).toBe("application/pdf");
    expect(await result.arrayBuffer()).toEqual(bytes);
  });

  it("reads an existing PDF stored as a File", async () => {
    const bytes = new TextEncoder().encode("Old PDF").buffer;

    await storeOldPdf(
      "old-pdf",
      new File([bytes], "old.pdf", { type: "application/pdf" }),
    );

    const result = await getPdf("old-pdf");

    expect(result.type).toBe("application/pdf");
    expect(await result.arrayBuffer()).toEqual(bytes);
  });

  it("reports a missing PDF", async () => {
    await expect(getPdf("missing")).rejects.toThrow(
      "PDF-filen ble ikke funnet.",
    );
  });
});
