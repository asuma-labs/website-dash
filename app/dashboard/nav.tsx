// app/dashboard/nav.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Home, Bot, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav({ user }: { user: any }) {
  const supabase = createClient()
  const router = useRouter()
  const pathname = usePathname()

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const links = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/bots', label: 'Bot Saya', icon: Bot },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="w-64 fixed h-full bg-gray-900 border-r border-gray-800 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-green-400">🤖 Asuma MD</h1>
        <p className="text-sm text-gray-500 mt-1">Dashboard</p>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              pathname === href
                ? 'bg-green-500/20 text-green-400'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800 pt-4 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <img src={user.user_metadata?.avatar_url} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-sm font-medium">{user.user_metadata?.full_name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 text-gray-400 hover:text-red-400 transition w-full px-4 py-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  )
}
