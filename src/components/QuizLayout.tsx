import { useState } from 'react';
import { Box } from '@mui/material';
import { QuizMenu } from './QuizMenu';
import { Quiz } from './Quiz';
import type { Problem } from '../types/quiz';

export const QuizLayout: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);

  const loadQuiz = async (path: string) => {
    try {
      const response = await fetch(path);
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const problemElements = xmlDoc.getElementsByTagName('problem');
      const parsedProblems: Problem[] = Array.from(problemElements).map((problem) => {
        const answers = Array.from(problem.getElementsByTagName('answer')).map((answer) => ({
          text: answer.textContent || '',
          correct: answer.getAttribute('correct') === 'true'
        }));

        return {
          question: problem.getElementsByTagName('question')[0]?.textContent || '',
          answers: answers,
          explanation: problem.getElementsByTagName('explanation')[0]?.textContent || ''
        };
      });

      setProblems(parsedProblems);
    } catch (error) {
      console.error('Error loading quiz:', error);
      setProblems([]);
    }
  };

  const handleQuizSelect = (path: string) => {
    setSelectedQuiz(path);
    loadQuiz(path);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      width: '100vw',
      overflow: 'hidden'
    }}>
      <QuizMenu onQuizSelect={handleQuizSelect} selectedQuiz={selectedQuiz} />
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        bgcolor: '#f5f5f5'
      }}>
        <Quiz problems={problems} />
      </Box>
    </Box>
  );
}; 