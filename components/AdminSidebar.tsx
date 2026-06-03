"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  // Animasi masuk dan keluar
  useEffect(() => {
    if (mobileOpen) {
      // Langsung render dulu, baru trigger animasi masuk
      requestAnimationFrame(() => setVisible(true))
    } else {
      // Trigger animasi keluar dulu, baru unmount
      setVisible(false)
    }
  }, [mobileOpen])

  const handleClose = () => setMobileOpen(false)

  const stanRaw = typeof window !== "undefined" ? getClientCookie("stan") : undefined
  const stan = stanRaw ? JSON.parse(decodeURIComponent(stanRaw)) : null

  const handleLogout = () => {
    deleteClientCookie("token")
    deleteClientCookie("stan")
    router.push("/login")
  }

  const SidebarContent = () => (
    <>
      {/* Logo & Stan */}
      <div className="px-5 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#dcf4a2] flex items-center justify-center text-[#0055a4] font-bold text-base shadow-md shrink-0">
            T!
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold leading-none truncate">
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
              onClick={handleClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? "bg-[#dcf4a2]/20 text-[#dcf4a2] font-medium"
                  : "text-[#dcf4a2]/55 hover:text-[#dcf4a2]/85 hover:bg-[#dcf4a2]/10"
              }`}
            >
              <span className="text-base leading-none w-5 text-center">{item.icon}</span>
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
    </>
  )

  return (
    <div className="flex h-screen bg-[#dcf4a2]">

      {/* ── Sidebar Desktop ── */}
      <aside className="hidden md:flex w-56 h-screen bg-[#0055a4] flex-col border-r border-white/[0.06] shrink-0 fixed top-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Top Navbar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0055a4] border-b border-white/[0.06]">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#dcf4a2] flex items-center justify-center text-[#0055a4] font-bold text-sm">
              T!
            </div>
            <p className="text-white font-semibold text-sm">
              {stan?.nama_stan ?? "TrayUp! Admin"}
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            {/* Animasi hamburger ke X */}
            <div className="relative w-5 h-5">
              <span className={`absolute left-0 block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                mobileOpen ? "top-2 rotate-45" : "top-0.5"
              }`} />
              <span className={`absolute left-0 top-2 block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                mobileOpen ? "opacity-0 translate-x-2" : "opacity-100"
              }`} />
              <span className={`absolute left-0 block w-5 h-0.5 bg-white rounded-full transition-all duration-300 ${
                mobileOpen ? "top-2 -rotate-45" : "top-3.5"
              }`} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer dengan transisi ── */}
      {mobileOpen && (
        <>
          {/* Backdrop fade in/out */}
          <div
            className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
          />

          {/* Drawer slide in dari kiri */}
          <aside
            className={`md:hidden fixed top-0 left-0 h-full w-64 bg-[#0055a4] z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
              visible ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-56 h-screen overflow-y-auto bg-[#dcf4a2] pt-[57px] md:pt-0">
        {children}
      </main>
    </div>
  )
}

export default AdminSidebar