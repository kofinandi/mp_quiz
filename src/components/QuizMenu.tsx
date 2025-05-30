import { useEffect, useState } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';
import { fetchQuizFiles } from '../api/quizFiles';
import type { QuizFile } from '../api/quizFiles';

interface QuizMenuProps {
  onQuizSelect: (path: string) => void;
  selectedQuiz: string | null;
}

export const QuizMenu: React.FC<QuizMenuProps> = ({ onQuizSelect, selectedQuiz }) => {
  const [quizFiles, setQuizFiles] = useState<QuizFile[]>([]);

  useEffect(() => {
    const loadQuizFiles = async () => {
      const files = await fetchQuizFiles();
      setQuizFiles(files);
      
      // If no quiz is selected, select the first one by default
      if (!selectedQuiz && files.length > 0) {
        onQuizSelect(files[0].path);
      }
    };

    loadQuizFiles();
  }, [selectedQuiz]);

  return (
    <Paper sx={{ 
      width: 240, 
      height: '100%',
      borderRadius: 0,
      boxShadow: 2
    }}>
      <List>
        {quizFiles.map((quiz) => (
          <ListItem key={quiz.path} disablePadding>
            <ListItemButton
              selected={selectedQuiz === quiz.path}
              onClick={() => onQuizSelect(quiz.path)}
            >
              <ListItemText 
                primary={quiz.name} 
                primaryTypographyProps={{
                  sx: { textTransform: 'capitalize' }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}; 