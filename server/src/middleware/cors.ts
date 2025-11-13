/**
 * CORS 미들웨어 설정
 */

import cors from 'cors'
import { env } from '../config/env'

const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // origin이 없으면 (같은 도메인 요청) 허용
    if (!origin) {
      callback(null, true)
      return
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

