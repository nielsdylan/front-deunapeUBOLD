
import { LayoutProvider } from '@/context/useLayoutContext'
import { NotificationProvider } from '@/context/useNotificationContext'
import type { ChildrenType } from '@/types'

const AppWrapper = ({ children }: ChildrenType) => {
  return (
    <LayoutProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </LayoutProvider>
  )
}

export default AppWrapper
