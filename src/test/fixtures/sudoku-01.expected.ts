/**
 * Expected OCR results for sudoku-01.jpg
 * 0 = empty cell, 1-9 = digit
 */
export const SUDOKU_01_EXPECTED = [
  // Row 0
  0, 0, 1, 8, 9, 2, 6, 0, 0,
  // Row 1
  0, 9, 0, 0, 0, 0, 0, 2, 0,
  // Row 2
  0, 5, 0, 0, 0, 0, 0, 0, 0,
  // Row 3
  0, 8, 4, 0, 0, 0, 0, 0, 0,
  // Row 4
  0, 0, 3, 5, 4, 7, 9, 0, 0,
  // Row 5
  0, 0, 0, 0, 0, 0, 1, 5, 0,
  // Row 6
  0, 0, 0, 0, 0, 0, 0, 3, 0,
  // Row 7
  0, 7, 0, 0, 0, 0, 0, 8, 0,
  // Row 8
  0, 0, 8, 1, 5, 3, 4, 0, 0,
];

/**
 * Compare OCR results against expected values
 * Returns accuracy metrics
 */
export function compareResults(
  actual: number[],
  expected: number[],
): {
  accuracy: number;
  correctDigits: number;
  missedDigits: number; // Expected digit, got 0
  falsePositives: number; // Expected 0, got digit
  wrongDigits: number; // Expected digit X, got digit Y
  errors: {
    index: number;
    row: number;
    col: number;
    expected: number;
    actual: number;
  }[];
} {
  const errors: {
    index: number;
    row: number;
    col: number;
    expected: number;
    actual: number;
  }[] = [];
  let correct = 0;
  let missed = 0;
  let falsePos = 0;
  let wrong = 0;

  for (let i = 0; i < 81; i++) {
    const exp = expected[i];
    const act = actual[i];

    if (exp === act) {
      correct++;
    } else {
      const row = Math.floor(i / 9);
      const col = i % 9;
      errors.push({ index: i, row, col, expected: exp, actual: act });

      if (exp === 0 && act !== 0) {
        falsePos++;
      } else if (exp !== 0 && act === 0) {
        missed++;
      } else {
        wrong++;
      }
    }
  }

  return {
    accuracy: correct / 81,
    correctDigits: correct,
    missedDigits: missed,
    falsePositives: falsePos,
    wrongDigits: wrong,
    errors,
  };
}
