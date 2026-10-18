/**
 * Shuffles an array using the Fisher-Yates (Knuth) algorithm
 * Does not mutate the original array, returns a freshly shuffled copy
 */
export function shuffleArray<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Normalizes user text for fair string comparison:
 * trims, collapses internal spaces, lowers case, removes trailing punctuation.
 */
export function normalizeAnswer(str: string): string {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/[.,;:!?]+$/, '')
    .replace(/\s+/g, ' ');
}

/**
 * Checks whether user input matches the expected correct answer
 * or any acceptable synonyms
 */
export function isAnswerCorrect(
  userInput: string,
  correctAnswer: string,
  acceptableAnswers?: string[]
): boolean {
  const cleanUser = normalizeAnswer(userInput);
  const cleanCorrect = normalizeAnswer(correctAnswer);

  if (cleanUser === cleanCorrect) return true;

  if (acceptableAnswers && acceptableAnswers.length > 0) {
    return acceptableAnswers.some(ans => normalizeAnswer(ans) === cleanUser);
  }

  return false;
}
