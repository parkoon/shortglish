import * as z from 'zod'

const createEnv = () => {
  const EnvSchema = z.object({
    POSTHOG_KEY: z.string(),
    POSTHOG_HOST: z.string(),
    SUPABASE_URL: z.string(),
    SUPABASE_ANON_KEY: z.string(),
    API_BASE_URL: z.string().optional(),
    TOSS_DECRYPT_KEY: z.string().optional(),
    TOSS_AAD: z.string().optional(),
  })

  const envVars = Object.entries(import.meta.env).reduce<Record<string, string>>((acc, curr) => {
    const [key, value] = curr
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value
    }
    return acc
  }, {})

  const parsedEnv = EnvSchema.safeParse(envVars)

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided. The following variables are missing or invalid: ${Object.entries(
        parsedEnv.error.flatten().fieldErrors,
      )
        .map(([k, v]) => `- ${k}: ${v}`)
        .join('\n')}`,
    )
  }

  const env = parsedEnv.data

  return {
    ...env,
    API_BASE_URL: env.API_BASE_URL || 'http://localhost:4000',
    TOSS_AAD: env.TOSS_AAD || 'TOSS',
  }
}

export const env = createEnv()
