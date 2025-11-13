/**
 * AccessToken 발급 엔드포인트
 */

import { Router } from 'express'
import { z } from 'zod'

import { generateToken } from '../../services/toss-api'
import type { GenerateTokenRequest } from '../../types/toss'

const router = Router()

const GenerateTokenSchema = z.object({
  authorizationCode: z.string().min(1),
  referrer: z.string().min(1),
})

router.post('/', async (req, res, next) => {
  try {
    const validated = GenerateTokenSchema.parse(req.body)
    const tokenData = await generateToken(validated as GenerateTokenRequest)
    res.json(tokenData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      })
      return
    }
    
    // 에러 메시지 추출
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate token'
    const statusCode = errorMessage.includes('API Error') ? 502 : 500
    
    res.status(statusCode).json({
      error: errorMessage,
    })
  }
})

export default router

