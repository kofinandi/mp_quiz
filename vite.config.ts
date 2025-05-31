import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mp_quiz/',
  plugins: [
    react(),
    {
      name: 'quiz-files',
      configureServer(server) {
        server.middlewares.use('/mp_quiz/api/quizzes', (_, res) => {
          const publicDir = path.join(process.cwd(), 'public')
          try {
            const files = fs.readdirSync(publicDir)
              .filter(file => file.endsWith('.xml'))
              .map(file => ({
                name: path.basename(file, '.xml')
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' '),
                path: `/mp_quiz/${file}`
              }))

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(files))
          } catch (error) {
            console.error('Error reading quiz files:', error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Failed to read quiz files' }))
          }
        })
      }
    }
  ]
})
