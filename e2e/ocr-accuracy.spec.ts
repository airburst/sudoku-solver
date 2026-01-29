import { test, expect } from "@playwright/test";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  SUDOKU_01_EXPECTED,
  compareResults,
} from "../src/test/fixtures/sudoku-01.expected";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = join(__dirname, "../src/test/fixtures");

test.describe("OCR Accuracy", () => {
  test("sudoku-01.jpg should meet accuracy threshold", async ({ page }) => {
    await page.goto("/");

    // Click Import button (camera icon in setup mode)
    const importButton = page.locator("button", { hasText: "Import" });
    await importButton.click();

    // Wait for import modal
    await expect(page.locator("text=Import Puzzle")).toBeVisible();

    // Upload fixture image via hidden file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(join(FIXTURES_DIR, "sudoku-01.jpg"));

    // Wait for processing to complete and review screen to appear
    await expect(page.locator("text=Review Import")).toBeVisible({
      timeout: 30000,
    });

    // Extract recognized digits from the grid
    const cells = page.locator(".grid-cols-9 button");
    await expect(cells).toHaveCount(81);

    const recognizedDigits: number[] = [];
    for (let i = 0; i < 81; i++) {
      const text = await cells.nth(i).textContent();
      const digit = text?.trim() ? parseInt(text.trim(), 10) : 0;
      recognizedDigits.push(isNaN(digit) ? 0 : digit);
    }

    // Compare against expected
    const results = compareResults(recognizedDigits, SUDOKU_01_EXPECTED);

    console.log("\n=== OCR Accuracy Results ===");
    console.log(`Accuracy: ${(results.accuracy * 100).toFixed(1)}%`);
    console.log(`Correct: ${results.correctDigits}/81`);
    console.log(`Missed digits: ${results.missedDigits}`);
    console.log(`False positives: ${results.falsePositives}`);
    console.log(`Wrong digits: ${results.wrongDigits}`);

    if (results.errors.length > 0) {
      console.log("\nErrors:");
      for (const err of results.errors) {
        console.log(
          `  [${err.row},${err.col}] expected ${err.expected}, got ${err.actual}`,
        );
      }
    }

    // Assert minimum accuracy threshold (adjust as improvements are made)
    expect(
      results.accuracy,
      `Expected >90% accuracy, got ${(results.accuracy * 100).toFixed(1)}%`,
    ).toBeGreaterThan(0.9);

    // Assert no more than 3 false positives
    expect(
      results.falsePositives,
      `Expected <=3 false positives, got ${results.falsePositives}`,
    ).toBeLessThanOrEqual(3);
  });
});
