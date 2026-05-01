// app/[username]/layout.tsx
import DashboardNav from '@/app/dashboard/nav'

export default async function UsernameLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <DashboardNav user={{ user_metadata: { username } }} username={username} />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  )
}
