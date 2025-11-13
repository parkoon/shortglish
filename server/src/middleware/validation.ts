/**
 * 요청 검증 미들웨어
 */

import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

/**
 * Zod 스키마로 요청 본문 검증하는 미들웨어 생성
 */
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation Error',
          details: error.errors,
        })
      } else {
        next(error)
      }
    }
  }
}

/**
 * Authorization Bearer 토큰 검증 미들웨어
 */
export function validateBearerToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Authorization header with Bearer token is required',
    })
    return
  }

  // 토큰을 req 객체에 추가하여 컨트롤러에서 사용할 수 있도록 함
  ;(req as Request & { accessToken: string }).accessToken = authHeader.substring(7)
  next()
}
