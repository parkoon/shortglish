import { PageLayout } from '@/components/layouts/page-layout'
import { useAppCloseConfirm } from '@/hooks/use-app-close-confirm'

const MyPage = () => {
  useAppCloseConfirm()
  return <PageLayout>zz</PageLayout>
}

export default MyPage
