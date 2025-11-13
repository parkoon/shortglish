/**
 * 환경 변수 설정
 */

import * as z from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const EnvSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  TOSS_API_BASE_URL: z.string().default('https://apps-in-toss-api.toss.im'),
  TOSS_CLIENT_CERT_PATH: z.string().optional(),
  TOSS_CLIENT_KEY_PATH: z.string().optional(),
  TOSS_CLIENT_CERT_BASE64: z.string().optional(),
  TOSS_CLIENT_KEY_BASE64: z.string().optional(),
  TOSS_DECRYPT_KEY: z.string().optional(),
  TOSS_AAD: z.string().default('TOSS'),
})

const parseEnv = () => {
  const envVars = {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    TOSS_API_BASE_URL: process.env.TOSS_API_BASE_URL,
    TOSS_CLIENT_CERT_PATH: process.env.TOSS_CLIENT_CERT_PATH,
    TOSS_CLIENT_KEY_PATH: process.env.TOSS_CLIENT_KEY_PATH,
    TOSS_CLIENT_CERT_BASE64: process.env.TOSS_CLIENT_CERT_BASE64,
    TOSS_CLIENT_KEY_BASE64: process.env.TOSS_CLIENT_KEY_BASE64,
    TOSS_DECRYPT_KEY: process.env.TOSS_DECRYPT_KEY,
    TOSS_AAD: process.env.TOSS_AAD,
  }

  const parsed = EnvSchema.safeParse(envVars)

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables: ${parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`,
    )
  }

  return parsed.data
}

export const env = parseEnv()

