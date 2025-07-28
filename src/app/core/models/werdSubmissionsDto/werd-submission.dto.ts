export interface WerdSubmissionDto {
  id: number;
  werdTitle: string;
  isCompleted: boolean | null;
  date: string;
  score: number;
  subTasksCompleted: number;
  maxScore: number;
  werdDescription: string;
}
