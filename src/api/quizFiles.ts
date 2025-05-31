export interface QuizFile {
  name: string;
  path: string;
}

export const fetchQuizFiles = async (): Promise<QuizFile[]> => {
  try {
    const response = await fetch('/mp_quiz/quiz-files.json');
    if (!response.ok) {
      throw new Error('Failed to fetch quiz files');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz files:', error);
    return [];
  }
}; 