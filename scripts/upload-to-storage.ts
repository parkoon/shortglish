import fs from 'node:fs'
import path from 'node:path'
import readline from 'node:readline'
import { fileURLToPath } from 'node:url'

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// ============================================
// 설정 및 상수
// ============================================

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 올바른 프로젝트 ID
const EXPECTED_PROJECT_ID = 'guuzamgogpvihafgwhdn'
const STORAGE_BUCKET = 'video-contents'

// .env 파일 로드
const envPath = path.resolve(__dirname, '..', '.env')
const envResult = config({ path: envPath })

if (envResult.error) {
  console.warn('⚠️  .env 파일을 찾을 수 없습니다. 환경 변수를 직접 설정해주세요.')
}

// ============================================
// 환경 변수 검증
// ============================================

const SUPABASE_URL = process.env.VITE_APP_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_APP_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ 환경 변수가 설정되지 않았습니다.')
  console.error('\n필수 환경 변수:')
  console.error('  - VITE_APP_SUPABASE_URL 또는 SUPABASE_URL')
  console.error('  - VITE_APP_SUPABASE_ANON_KEY 또는 SUPABASE_ANON_KEY')
  console.error('\n.env 파일을 생성하거나 환경 변수를 설정해주세요.')
  console.error(`예시: https://${EXPECTED_PROJECT_ID}.supabase.co`)
  process.exit(1)
}

// 프로젝트 ID 검증
function extractProjectId(url: string): string | null {
  const match = url.match(/https?:\/\/([^.]+)\.supabase\.co/)
  return match?.[1] ?? null
}

const urlProjectId = extractProjectId(SUPABASE_URL)

if (!urlProjectId) {
  console.error('❌ 유효하지 않은 Supabase URL 형식입니다.')
  console.error(`   현재 URL: ${SUPABASE_URL}`)
  console.error(`   예상 형식: https://${EXPECTED_PROJECT_ID}.supabase.co`)
  process.exit(1)
}

if (urlProjectId !== EXPECTED_PROJECT_ID) {
  console.error('❌ 잘못된 Supabase 프로젝트입니다!')
  console.error(`   현재 URL의 프로젝트 ID: ${urlProjectId}`)
  console.error(`   올바른 프로젝트 ID: ${EXPECTED_PROJECT_ID}`)
  console.error('\n.env 파일의 VITE_APP_SUPABASE_URL을 확인해주세요.')
  console.error(`   올바른 URL: https://${EXPECTED_PROJECT_ID}.supabase.co`)
  process.exit(1)
}

console.log('✅ 프로젝트 확인 완료')
console.log(`   프로젝트 ID: ${EXPECTED_PROJECT_ID}`)
console.log(`   URL: ${SUPABASE_URL}\n`)

// Supabase 클라이언트 초기화
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ============================================
// 타입 정의
// ============================================

interface UploadResult {
  videoId: string
  url: string
  size: number
}

interface UploadError {
  videoId: string
  error: string
  details?: unknown
}

interface FileInfo {
  videoId: string
  filePath: string
  size: number
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * public/contents 디렉토리 경로 반환
 */
function getContentsPath(): string {
  const projectRoot = path.resolve(__dirname, '..')
  return path.join(projectRoot, 'public', 'contents')
}

/**
 * JSON 파일 읽기 및 검증
 */
function readJsonFile(filePath: string): { content: unknown; size: number } {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error('파일이 존재하지 않습니다')
    }

    const content = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(content)
    const size = fs.statSync(filePath).size

    return { content: parsed, size }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`JSON 파일 읽기 실패 (${filePath}): ${errorMessage}`)
  }
}

/**
 * 버킷 존재 여부 및 접근 권한 확인
 */
async function verifyBucketAccess(): Promise<boolean> {
  try {
    console.log('🔍 버킷 확인 중...')

    // 버킷 목록 조회
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error('❌ 버킷 목록 조회 실패:', listError.message)
      console.error('   권한이 없거나 네트워크 오류일 수 있습니다.')
      return false
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET) ?? false

    if (!bucketExists) {
      console.error(`❌ 버킷 '${STORAGE_BUCKET}'이 존재하지 않습니다.`)
      console.error('\n해결 방법:')
      console.error('  1. Supabase 대시보드 접속')
      console.error('  2. Storage 메뉴로 이동')
      console.error(`  3. '${STORAGE_BUCKET}' 버킷 생성`)
      console.error('  4. Public으로 설정 (또는 적절한 RLS 정책 설정)')
      return false
    }

    // 버킷 접근 테스트 (파일 목록 조회)
    const { error: accessError } = await supabase.storage.from(STORAGE_BUCKET).list('', {
      limit: 1,
    })

    if (accessError) {
      console.error('❌ 버킷 접근 권한이 없습니다:', accessError.message)
      console.error('\n해결 방법:')
      console.error('  1. 버킷이 Public인지 확인')
      console.error('  2. RLS 정책에서 SELECT 권한 확인')
      return false
    }

    console.log(`✅ 버킷 '${STORAGE_BUCKET}' 확인 완료\n`)
    return true
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('❌ 버킷 확인 중 오류:', errorMessage)
    return false
  }
}

// ============================================
// 업로드 함수
// ============================================

/**
 * 단일 파일 업로드
 */
async function uploadFile(videoId: string, filePath: string): Promise<UploadResult> {
  console.log(`📤 업로드 중: ${videoId}.json`)

  try {
    // 파일 읽기
    const { content, size } = readJsonFile(filePath)
    const fileSizeKB = (size / 1024).toFixed(2)
    console.log(`   파일 크기: ${fileSizeKB} KB`)

    // JSON 문자열로 변환
    const fileContent = JSON.stringify(content, null, 2)
    const buffer = Buffer.from(fileContent, 'utf-8')

    // Storage 경로 설정
    const storagePath = `${videoId}.json`
    console.log(`   버킷: ${STORAGE_BUCKET}`)
    console.log(`   경로: ${storagePath}`)

    // 업로드 실행
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, buffer, {
        contentType: 'application/json',
        upsert: true,
      })

    if (uploadError) {
      // 에러 상세 정보 출력
      console.error('   ❌ 업로드 에러 상세:')
      console.error('      메시지:', uploadError.message)
      if ('statusCode' in uploadError) {
        console.error('      상태 코드:', uploadError.statusCode)
      }

      // 권한 관련 에러인 경우 안내
      if (
        uploadError.message.includes('new row violates') ||
        uploadError.message.includes('permission')
      ) {
        console.error('\n   💡 권한 문제로 보입니다.')
        console.error('      해결 방법:')
        console.error('      1. 버킷이 Public인지 확인')
        console.error('      2. RLS 정책에서 INSERT/UPDATE 권한 확인')
      }

      throw new Error(`업로드 실패: ${uploadError.message}`)
    }

    // 공개 URL 가져오기
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath)

    if (!urlData?.publicUrl) {
      throw new Error('공개 URL을 가져올 수 없습니다')
    }

    console.log(`   ✅ 업로드 완료`)
    console.log(`   URL: ${urlData.publicUrl}`)

    return {
      videoId,
      url: urlData.publicUrl,
      size,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`   ❌ 업로드 실패: ${errorMessage}`)
    throw error
  }
}

/**
 * 모든 JSON 파일 업로드
 */
async function uploadAllFiles(): Promise<void> {
  const contentsDir = getContentsPath()

  if (!fs.existsSync(contentsDir)) {
    console.error(`❌ 디렉토리가 존재하지 않습니다: ${contentsDir}`)
    process.exit(1)
  }

  // JSON 파일 목록 가져오기
  const files: FileInfo[] = fs
    .readdirSync(contentsDir)
    .filter(file => file.endsWith('.json'))
    .map(file => {
      const filePath = path.join(contentsDir, file)
      const videoId = path.basename(file, '.json')
      const stats = fs.statSync(filePath)
      return { videoId, filePath, size: stats.size }
    })
    .sort((a, b) => a.videoId.localeCompare(b.videoId))

  if (files.length === 0) {
    console.log('⚠️  업로드할 JSON 파일이 없습니다.')
    return
  }

  console.log(`📋 발견된 파일: ${files.length}개\n`)
  files.forEach(({ videoId, size }) => {
    const sizeKB = (size / 1024).toFixed(2)
    console.log(`   - ${videoId}.json (${sizeKB} KB)`)
  })
  console.log()

  const results: UploadResult[] = []
  const errors: UploadError[] = []

  // 순차적으로 업로드 (동시 업로드 시 권한 문제 발생 가능)
  for (const { videoId, filePath } of files) {
    try {
      const result = await uploadFile(videoId, filePath)
      results.push(result)
      // 업로드 간 짧은 딜레이 (서버 부하 방지)
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      errors.push({
        videoId,
        error: errorMessage,
        details: error,
      })
    }
  }

  // 결과 요약
  console.log('\n' + '='.repeat(60))
  console.log('📊 업로드 결과 요약')
  console.log('='.repeat(60))
  console.log(`✅ 성공: ${results.length}개`)
  console.log(`❌ 실패: ${errors.length}개`)

  if (errors.length > 0) {
    console.log('\n❌ 실패한 파일:')
    errors.forEach(({ videoId, error }) => {
      console.log(`   - ${videoId}.json`)
      console.log(`     ${error}`)
    })
  }

  if (results.length > 0) {
    console.log('\n✅ 업로드된 파일:')
    results.forEach(({ videoId, url, size }) => {
      const sizeKB = (size / 1024).toFixed(2)
      console.log(`   - ${videoId}.json (${sizeKB} KB)`)
      console.log(`     ${url}`)
    })
  }

  console.log()
}

/**
 * 단일 파일 업로드
 */
async function uploadSingleFile(videoId: string): Promise<void> {
  const contentsDir = getContentsPath()
  const filePath = path.join(contentsDir, `${videoId}.json`)

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 파일이 존재하지 않습니다: ${filePath}`)
    process.exit(1)
  }

  await uploadFile(videoId, filePath)
}

// ============================================
// CLI 인터페이스
// ============================================

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

// ============================================
// 메인 실행 함수
// ============================================

async function main(): Promise<void> {
  const videoId = process.argv[2]
  const uploadAll = process.argv.includes('--all') || process.argv.includes('-a')

  console.log('='.repeat(60))
  console.log('🚀 Supabase Storage 업로드 도구')
  console.log(`   프로젝트: ${EXPECTED_PROJECT_ID}`)
  console.log(`   버킷: ${STORAGE_BUCKET}`)
  console.log('='.repeat(60))
  console.log()

  // 버킷 확인
  const hasAccess = await verifyBucketAccess()
  if (!hasAccess) {
    console.error('\n❌ 업로드를 진행할 수 없습니다.')
    process.exit(1)
  }

  // 업로드 실행
  if (uploadAll) {
    await uploadAllFiles()
  } else if (videoId) {
    await uploadSingleFile(videoId)
  } else {
    // 대화형 모드
    console.log('업로드 모드를 선택하세요:')
    console.log('  1. 특정 비디오 ID 업로드')
    console.log('  2. 모든 파일 업로드')

    const choice = await askQuestion('\n선택 (1 또는 2): ')

    if (choice === '1') {
      const inputVideoId = await askQuestion('비디오 ID를 입력하세요: ')
      if (!inputVideoId) {
        console.error('❌ 비디오 ID가 필요합니다.')
        process.exit(1)
      }
      await uploadSingleFile(inputVideoId)
    } else if (choice === '2') {
      await uploadAllFiles()
    } else {
      console.error('❌ 잘못된 선택입니다.')
      process.exit(1)
    }
  }

  console.log('\n✅ 작업 완료!')
}

// 스크립트 실행
main().catch(error => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  console.error('\n❌ 예상치 못한 오류:', errorMessage)
  if (error instanceof Error && error.stack) {
    console.error('\n스택 트레이스:')
    console.error(error.stack)
  }
  process.exit(1)
})
