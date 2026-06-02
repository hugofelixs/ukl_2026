"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { deleteClientCookie, getClientCookie } from "@/lib/client.cookie"
import { useState } from "react"

const navItems = [
  { href: "/siswa/dashboard", label: "Menu" },
  { href: "/siswa/pesanan", label: "Pesanan" },
  { href: "/siswa/histori", label: "Histori" },
  { href: "/siswa/profil", label: "Profil" },
]

const SiswaNavbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const siswaRaw = typeof window !== "undefined" ? getClientCookie("siswa") : undefined
  const siswa = siswaRaw ? JSON.parse(decodeURIComponent(siswaRaw)) : null

  const handleLogout = () => {
    deleteClientCookie("token")
    deleteClientCookie("siswa")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0055a4] border-b border-white/[0.08] shadow-sm">
      <div className="max-w-8xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/siswa/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#dcf4a2] flex items-center justify-center text-[#0055a4] font-bold text-sm">
            T!
          </div>
          <span className="text-white font-bold text-lg tracking-tight">TrayUp!</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#dcf4a2] text-[#0055a4]"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#dcf4a2]/20 flex items-center justify-center text-[#dcf4a2] text-sm font-bold">
              {siswa?.nama_siswa?.[0]?.toUpperCase() ?? "S"}
            </div>
            <span className="text-white/80 text-sm">{siswa?.nama_siswa ?? "Siswa"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-400/20 text-white/60 hover:text-red-300 text-sm transition-all"
          >
            Keluar
          </button>
        </div>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white/70 hover:text-white transition-colors"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0055a4] border-t border-white/10 px-6 py-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-[#dcf4a2] text-[#0055a4]"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-white/10 mt-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-400/10 transition-all"
            >
              ↩ Keluar
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default SiswaNavbar