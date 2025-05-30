export interface Answer {
  text: string;
  correct?: boolean;
}

export interface Problem {
  question: string;
  answers: Answer[];
  explanation: string;
}

export interface Quiz {
  problems: Problem[];
} 