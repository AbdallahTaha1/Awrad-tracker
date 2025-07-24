export interface WeeklyReport {
  period: string;
  totalScore: number;
  maxScore: number;
  items: {
    title: string;
    totalSubmissions: number;
    completedCount: number;
    missedCount: number;
    totalScore: number;
    maxPossibleScore: number;
  }[];
}
