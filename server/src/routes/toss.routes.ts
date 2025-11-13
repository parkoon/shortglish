/**
 * 토스 API 라우트
 */

import { Router } from 'express'

import * as tossController from '../controllers/toss.controller'
import { validateBearerToken } from '../middleware/validation'
import { validateBody } from '../middleware/validation'
import { z } from 'zod'

const router = Router()

// Validation Schemas
const GenerateTokenSchema = z.object({
  authorizationCode: z.string().min(1),
  referrer: z.string().min(1),
})

const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
})

const UnlinkByUserKeySchema = z.object({
  userKey: z.number(),
})

// Routes
router.post('/generate-token', validateBody(GenerateTokenSchema), tossController.generateToken)

router.post('/refresh-token', validateBody(RefreshTokenSchema), tossController.refreshToken)

router.get('/login-me', validateBearerToken, tossController.getUserInfo)

router.post('/unlink/access-token', validateBearerToken, tossController.unlinkByAccessToken)

router.post(
  '/unlink/user-key',
  validateBearerToken,
  validateBody(UnlinkByUserKeySchema),
  tossController.unlinkByUserKey
)

export default router
