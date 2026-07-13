export interface QuizWithQuestions {
  id: string;
  title: string;
  description: string | null;
  weekNumber: number;
  durationMinutes: number;
  isActive: boolean;
  submissionDeadline: string | null;
  questions: {
    id: string;
    text: string;
    options: string[];
    order: number;
  }[];
}

export interface AttemptResult {
  id: string;
  participantName: string;
  totalScore: number;
  correctCount: number;
  wrongCount: number;
  timeTakenSeconds: number;
  accuracy: number;
  totalQuestions: number;
  answers: {
    questionText: string;
    selectedOption: string | null;
    correctOption: string;
    isCorrect: boolean;
    timeTakenSeconds: number;
    totalPoints: number;
  }[];
}

export interface QuizAnalytics {
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
  questionStats: {
    questionId: string;
    questionText: string;
    order: number;
    totalAttempts: number;
    correctCount: number;
    accuracy: number;
  }[];
  participants: {
    id: string;
    name: string;
    uid: string;
    mobile: string;
    email: string;
    department: string;
    totalScore: number;
    correctCount: number;
    wrongCount: number;
    accuracy: number;
    timeTakenSeconds: number;
    questionBreakdown: {
      questionId: string;
      questionText: string;
      isCorrect: boolean;
      timeTakenSeconds: number;
    }[];
  }[];
}
