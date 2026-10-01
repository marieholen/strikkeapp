export function validatePdfFile(file: File): string | null {
  if (file.type !== "application/pdf") {
    return "Filen må være en PDF.";
  }

  return null;
}
