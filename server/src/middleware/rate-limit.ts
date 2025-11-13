/**
 * Rate Limiting 미들웨어
 */

import rateLimit from 'express-rate-limit'

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100회 요청
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

export const tossApiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 50, // 토스 API는 더 엄격하게 제한
  message: 'Too many requests to Toss API, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

