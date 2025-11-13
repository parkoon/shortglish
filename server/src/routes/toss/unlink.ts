/**
 * 로그인 연결 끊기 엔드포인트
 */

import { Router } from 'express'
import { z } from 'zod'

import { unlinkByAccessToken, unlinkByUserKey } from '../../services/toss-api'
import type { UnlinkByUserKeyRequest } from '../../types/toss'

const router = Router()

const UnlinkByUserKeySchema = z.object({
  userKey: z.number(),
})

/**
 * AccessToken으로 연결 끊기
 */
router.post('/access-token', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization header with Bearer token is required',
      })
      return
    }

    const accessToken = authHeader.substring(7)
    await unlinkByAccessToken(accessToken)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

/**
 * userKey로 연결 끊기
 */
router.post('/user-key', async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authorization header with Bearer token is required',
      })
      return
    }

    const accessToken = authHeader.substring(7)
    const validated = UnlinkByUserKeySchema.parse(req.body)
    const result = await unlinkByUserKey(accessToken, validated as UnlinkByUserKeyRequest)
    res.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Invalid request',
        details: error.errors,
      })
      return
    }
    next(error)
  }
})

export default router

