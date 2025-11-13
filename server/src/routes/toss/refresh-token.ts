/**
 * AccessToken 재발급 엔드포인트
 */

import { Router } from 'express'
import { z } from 'zod'

import { refreshToken } from '../../services/toss-api'
import type { RefreshTokenRequest } from '../../types/toss'

const router = Router()

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

router.post('/', async (req, res, next) => {
  try {
    const validated = RefreshTokenSchema.parse(req.body)
    const tokenData = await refreshToken(validated as RefreshTokenRequest)
    res.json(tokenData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      })
      return
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to refresh token'
    const statusCode = errorMessage.includes('API Error') ? 502 : 500
    
    res.status(statusCode).json({
      error: errorMessage,
    })
  }
})

export default router

