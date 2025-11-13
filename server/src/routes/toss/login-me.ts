/**
 * 사용자 정보 조회 엔드포인트
 */

import { Router } from 'express'

import { loginMe } from '../../services/toss-api'

const router = Router()

router.get('/', async (req, res) => {
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
    const userInfo = await loginMe(accessToken)
    res.json(userInfo)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get user info'
    const statusCode = errorMessage.includes('API Error') ? 502 : 500
    
    res.status(statusCode).json({
      error: errorMessage,
    })
  }
})

export default router

