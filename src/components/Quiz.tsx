import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  FormControlLabel,
  Switch,
  Box,
  Paper
} from '@mui/material';
import type { Problem } from '../types/quiz';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface QuizProps {
  problems: Problem[];
}

export const Quiz: React.FC<QuizProps> = ({ problems }) => {
  const [visibleExplanations, setVisibleExplanations] = useState<Set<number>>(new Set());
  const [shuffleAnswers, setShuffleAnswers] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<{ [key: number]: number[] }>({});
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});

  const getShuffledIndices = (problemIndex: number, answerCount: number) => {
    if (!shuffleAnswers) {
      return Array.from({ length: answerCount }, (_, i) => i);
    }

    if (!shuffledIndices[problemIndex]) {
      const indices = Array.from({ length: answerCount }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(prev => ({ ...prev, [problemIndex]: indices }));
      return indices;
    }

    return shuffledIndices[problemIndex];
  };

  const handleAnswerClick = (problemIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [problemIndex]: answerIndex
    }));
    setVisibleExplanations(prev => {
      const newSet = new Set(prev);
      newSet.add(problemIndex);
      return newSet;
    });
  };

  const handleShuffleToggle = () => {
    setShuffleAnswers(!shuffleAnswers);
    setShuffledIndices({});
  };

  return (
    <Box sx={{ 
      margin: 0,
      padding: 2, 
      width: '100%', 
      minWidth: '100%',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      maxWidth: 'none',
      boxSizing: 'border-box'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: '100%' }}>
        <FormControlLabel
          control={
            <Switch
              checked={shuffleAnswers}
              onChange={handleShuffleToggle}
            />
          }
          label="Shuffle Answers"
        />
      </Box>
      {problems.map((problem, problemIndex) => (
        <Card key={problemIndex} sx={{ mb: 2, width: 800 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {problem.question.split('$').map((part, i) => 
                i % 2 === 0 ? part : <InlineMath key={i}>{part}</InlineMath>
              )}
            </Typography>
            <List>
              {getShuffledIndices(problemIndex, problem.answers.length).map((answerIndex) => {
                const answer = problem.answers[answerIndex];
                const isSelected = selectedAnswers[problemIndex] === answerIndex;
                const hasWrongSelection = selectedAnswers[problemIndex] !== undefined && 
                  !problems[problemIndex].answers[selectedAnswers[problemIndex]].correct;
                const isProblemAnswered = selectedAnswers[problemIndex] !== undefined;
                return (
                  <ListItem key={answerIndex} disablePadding>
                    <ListItemButton
                      onClick={() => handleAnswerClick(problemIndex, answerIndex)}
                      disabled={isProblemAnswered}
                      sx={{
                        bgcolor: 
                          (isSelected && !answer.correct) ? 'error.light' :
                          ((isSelected && answer.correct) || (hasWrongSelection && answer.correct)) ? 'success.light' :
                          'inherit',
                        '&:hover': {
                          bgcolor: 
                            (isSelected && !answer.correct) ? 'error.light' :
                            ((isSelected && answer.correct) || (hasWrongSelection && answer.correct)) ? 'success.light' :
                            isProblemAnswered ? 'inherit' : undefined,
                        },
                        '&.Mui-disabled': {
                          opacity: 0.7,
                          cursor: 'not-allowed'
                        }
                      }}
                    >
                      {answer.text.split('$').map((part, i) => 
                        i % 2 === 0 ? part : <InlineMath key={i}>{part}</InlineMath>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            {visibleExplanations.has(problemIndex) && (
              <Paper elevation={1} sx={{ mt: 2, p: 2, bgcolor: 'info.light' }}>
                <Typography variant="body1">
                  {problem.explanation.split('$').map((part, i) => 
                    i % 2 === 0 ? part : <InlineMath key={i}>{part}</InlineMath>
                  )}
                </Typography>
              </Paper>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}; 