// @ts-check
// @ts-nocheck
// eslint-disable-next-line @typescript-eslint/no-var-requires
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');
const outputPath = path.join(publicDir, 'quiz-files.json');

try {
  const files = fs.readdirSync(publicDir)
    .filter(file => file.endsWith('.xml'))
    .map(file => ({
      name: path.basename(file, '.xml')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      path: `/mp_quiz/${file}`
    }));

  fs.writeFileSync(outputPath, JSON.stringify(files, null, 2));
  console.log('Successfully generated quiz-files.json');
} catch (error) {
  console.error('Error generating quiz-files.json:', error);
  process.exit(1);
} 