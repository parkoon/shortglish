/**
 * 토스 API 컨트롤러
 * 요청/응답 처리 및 검증
 */

import type { Request, Response } from 'express'
import { z } from 'zod'

import * as tossService from '../services/toss.service'
import type { GenerateTokenRequest, UnlinkByUserKeyRequest } from '../types/toss'

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

/**
 * AccessToken 발급
 */
export async function generateToken(req: Request, res: Response): Promise<void> {
  const validated = GenerateTokenSchema.parse(req.body)
  const tokenData = await tossService.generateToken(validated as GenerateTokenRequest)
  res.json(tokenData)
}

/**
 * AccessToken 재발급
 */
export async function refreshToken(req: Request, res: Response): Promise<void> {
  const validated = RefreshTokenSchema.parse(req.body)
  const tokenData = await tossService.refreshToken(validated)
  res.json(tokenData)
}

/**
 * 사용자 정보 조회
 */
export async function getUserInfo(req: Request, res: Response): Promise<void> {
  const accessToken = (req as Request & { accessToken: string }).accessToken
  const userInfo = await tossService.getUserInfo(accessToken)
  res.json(userInfo)
}

/**
 * AccessToken으로 연결 끊기
 */
export async function unlinkByAccessToken(req: Request, res: Response): Promise<void> {
  const accessToken = (req as Request & { accessToken: string }).accessToken
  await tossService.unlinkByAccessToken(accessToken)
  res.json({ success: true })
}

/**
 * userKey로 연결 끊기
 */
export async function unlinkByUserKey(req: Request, res: Response): Promise<void> {
  const accessToken = (req as Request & { accessToken: string }).accessToken
  const validated = UnlinkByUserKeySchema.parse(req.body)
  const result = await tossService.unlinkByUserKey(accessToken, validated as UnlinkByUserKeyRequest)
  res.json(result)
}
