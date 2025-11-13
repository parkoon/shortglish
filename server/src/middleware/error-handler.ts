/**
 * 에러 핸들링 미들웨어
 */

import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
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

  // API 에러 (외부 API 호출 실패)
  const errorMessage = err.message || 'Internal Server Error'
  const statusCode = err.statusCode || (errorMessage.includes('API Error') ? 502 : 500)

  res.status(statusCode).json({
    error: errorMessage,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
