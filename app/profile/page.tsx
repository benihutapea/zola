import { Metadata } from 'next'
import { ProfileInfo } from '@/app/components/profile/profile-info'
import { ProfileTabs } from '@/app/components/profile/profile-tabs'
import { APP_NAME } from '@/lib/config'

export const metadata: Metadata = {
  title: `Your Profile | ${APP_NAME}`,
  description: 'View and edit your profile information'
}

export default function ProfilePage() {
  return (
    <div className="container max-w-5xl py-10">
      <div className="space-y-8">
        <ProfileInfo />
        <ProfileTabs />
      </div>
    </div>
  )
}