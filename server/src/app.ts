/**
 * Express 앱 설정
 */

import express from 'express'

import { env } from './config/env'
import { corsMiddleware } from './middleware/cors'
import { errorHandler } from './middleware/error-handler'
import { apiRateLimiter, tossApiRateLimiter } from './middleware/rate-limit'
import tossRoutes from './routes/toss.routes'

const app = express()

// 미들웨어
app.use(express.json())
app.use(corsMiddleware)
app.use(apiRateLimiter)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 토스 API 라우트
app.use('/api/toss', tossApiRateLimiter, tossRoutes)

// 에러 핸들링
app.use(errorHandler)

// 404 핸들러
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

const PORT = parseInt(env.PORT, 10)

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📝 Environment: ${env.NODE_ENV}`)
  console.log(`🌐 Allowed origins: ${env.ALLOWED_ORIGINS}`)
})

export default app
