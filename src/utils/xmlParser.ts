import type { Quiz, Problem, Answer } from '../types/quiz';

export const parseXMLQuiz = (xmlContent: string): Promise<Quiz> => {
  return new Promise((resolve, reject) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
      
      const problems: Problem[] = Array.from(xmlDoc.getElementsByTagName('problem')).map(problem => {
        const question = problem.getElementsByTagName('question')[0].textContent || '';
        const answersElement = problem.getElementsByTagName('answers')[0];
        const answers: Answer[] = Array.from(answersElement.getElementsByTagName('answer')).map(answer => ({
          text: answer.textContent || '',
          correct: answer.getAttribute('correct') === 'true'
        }));
        const explanation = problem.getElementsByTagName('explanation')[0].textContent || '';

        return {
          question,
          answers,
          explanation
        };
      });

      resolve({ problems });
    } catch (err) {
      reject(err instanceof Error ? err : new Error('Failed to parse XML'));
    }
  });
}; 