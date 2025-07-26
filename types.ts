
export type Answer = string | string[] | Record<string, string>;

export interface Question {
  question: string;
  options: string[];
  answer: Answer;
  explanation: string;
  isMultipleChoice?: boolean;
  isMatching?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isImportant?: boolean;
}
