import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart,
  Settings,
  FileText,
  CreditCard
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  href: string
  label: string
  icon: React.ReactNode
  isActive?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, isActive }) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
      isActive
        ? "bg-primary text-primary-foreground font-medium"
        : "hover:bg-muted text-muted-foreground hover:text-foreground"
    )}
  >
    {icon}
    {label}
  </Link>
)

export function DashboardNav() {
  const pathname = usePathname()
  
  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: <BarChart className="h-4 w-4" />
    },
    {
      href: "/dashboard/conversations",
      label: "Conversations",
      icon: <FileText className="h-4 w-4" />
    },
    {
      href: "/dashboard/usage",
      label: "Usage & Billing",
      icon: <CreditCard className="h-4 w-4" />
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />
    }
  ]
  
  return (
    <nav className="flex space-x-1">
      {navItems.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          isActive={pathname === item.href}
        />
      ))}
    </nav>
  )
}