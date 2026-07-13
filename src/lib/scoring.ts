export const BASE_POINTS = 10;
export const SPEED_BONUS_5S = 5;
export const SPEED_BONUS_10S = 3;

export function calculateSpeedBonus(timeTakenSeconds: number): number {
  if (timeTakenSeconds <= 5) return SPEED_BONUS_5S;
  if (timeTakenSeconds <= 10) return SPEED_BONUS_10S;
  return 0;
}

export function calculateAnswerScore(
  isCorrect: boolean,
  timeTakenSeconds: number
): { basePoints: number; speedBonus: number; totalPoints: number } {
  if (!isCorrect) {
    return { basePoints: 0, speedBonus: 0, totalPoints: 0 };
  }
  const speedBonus = calculateSpeedBonus(timeTakenSeconds);
  return {
    basePoints: BASE_POINTS,
    speedBonus,
    totalPoints: BASE_POINTS + speedBonus,
  };
}

export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
}
