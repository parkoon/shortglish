/**
 * 에러 핸들링 미들웨어
 */

import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // 이미 응답이 전송된 경우
  if (res.headersSent) {
    return next(err)
  }

  // Zod 검증 에러
  if (err.name === 'ZodError') {
    res.status(400).json({
      error: 'Validation Error',
      details: err.errors,
    })
    return
  }

  // 일반 에러
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

