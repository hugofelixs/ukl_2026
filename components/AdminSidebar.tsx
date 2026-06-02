"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { deleteClientCookie, getClientCookie } from "@/lib/client.cookie"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "⊞", exact: true },
  { href: "/admin/dashboard/menu", label: "Menu", icon: "🍔" },
  { href: "/admin/dashboard/diskon", label: "Diskon", icon: "🏷️" },
  { href: "/admin/dashboard/transaksi", label: "Transaksi", icon: "🧾" },
  { href: "/admin/dashboard/profil", label: "Profil Stan", icon: "🏪" },
]

type Props = {
  children: React.ReactNode
}

const AdminSidebar = ({ children }: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  const stanRaw = typeof window !== "undefined" ? getClientCookie("stan") : undefined
  const stan = stanRaw ? JSON.parse(decodeURIComponent(stanRaw)) : null

  const handleLogout = () => {
    deleteClientCookie("token")
    deleteClientCookie("stan")
    router.push("/login")
  }

  return (
    <div className="flex h-screen bg-[#dcf4a2]">
      {/* Sidebar */}
      <aside className="w-56 h-screen bg-[#0055a4] flex flex-col border-r border-white/[0.06] shrink-0 fixed top-0 left-0">
        {/* Logo & Stan */}
        <div className="px-5 py-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#dcf4a2] flex items-center justify-center text-[#0055a4] font-bold text-base shadow-md shrink-0">
              T!
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold leading-none">
                {stan?.nama_stan ?? "Stan TrayUp!"}
              </p>
              <p className="text-white/35 text-xs mt-1">Dashboard Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[#dcf4a2]/65 text-[10px] uppercase tracking-widest px-3 mb-3">
            Menu Utama
          </p>
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-[#dcf4a2]/20 text-[#dcf4a2] font-medium"
                    : "text-[#dcf4a2]/55 hover:text-[#dcf4a2]/85 hover:bg-[#dcf4a2]/10"
                }`}
              >
                <span className="text-base leading-none w-5 text-center">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User & Logout */}
        <div className="px-3 py-4 border-t border-white/[0.06] space-y-1">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-[#dcf4a2]/20 flex items-center justify-center text-[#dcf4a2] text-xs font-bold shrink-0">
              {stan?.nama_pemilik?.[0]?.toUpperCase() ?? "A"}
            </div>
            <p className="text-[#dcf4a2]/60 text-xs truncate">
              {stan?.nama_pemilik ?? "Admin"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#dcf4a2]/55 hover:text-red-300 hover:bg-red-400/[0.08] transition-all"
          >
            <span className="text-base leading-none w-5 text-center">↩</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content — full height, scrollable */}
      <main className="flex-1 ml-36 h-screen overflow-y-auto bg-[#dcf4a2]">
        {children}
      </main>
    </div>
  )
}

export default AdminSidebar