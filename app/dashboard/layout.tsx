import { DashboardNav } from '@/app/components/dashboard/dashboard-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-6xl py-4">
        <DashboardNav />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}