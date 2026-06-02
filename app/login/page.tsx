"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BASE_API_URL } from "@/global"
import { setClientCookie } from "@/lib/client.cookie"

interface LoginResponse {
  message: string
  data: {
    access_token: string
    role: "admin_stan" | "siswa"
    userId: number
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const json: LoginResponse = await res.json()
      if (!res.ok) throw new Error((json as any).message || "Login gagal")

      setClientCookie("token", json.data.access_token)

      if (json.data.role === "admin_stan") {
        router.push("/admin/dashboard")
      } else if (json.data.role === "siswa") {
        router.push("/siswa/dashboard")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Username atau password salah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#dcf4a2] flex items-center justify-center px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#0055a4] items-center justify-center text-[#dcf4a2] font-bold text-2xl mb-5 shadow-lg shadow-amber-400/20">
            T!
          </div>
          <h1 className="text-[#0055a4] text-2xl font-semibold tracking-tight">
            Selamat datang di TrayUp!
          </h1>
          <p className="text-[#004483]/40 text-sm mt-2">
            Masuk ke aplikasi kantin sekolah
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.15] border-white/[0.1] rounded-2xl p-7 backdrop-blur-md shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">
                Username
              </label>
              <input
                type="text"
                required
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username kamu"
                className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#004483]/70 text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#004483]/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 pr-24 text-[#004483]/70 text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#004483]/50 focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0055a4]/30 hover:text-[#0055a4]/60 transition-colors text-xs"
                >
                  {showPass ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 bg-red-400/[0.08] border border-red-400/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-sm mt-0.5">⚠</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055a4] hover:bg-[#004488] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-[#dcf4a2] font-semibold rounded-xl py-3 text-sm transition-all shadow-lg shadow-[#0055a4]/10 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#dcf4a2]/30 border-t-[#dcf4a2] rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[#004483]/50 text-sm mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-[#0055a4] hover:text-[#004483] transition-colors">
            Daftar sebagai siswa
          </Link>
          {" · "}
          <Link href="/admin/register" className="text-[#0055a4] hover:text-[#004483] transition-colors">
            Daftar stan
          </Link>
        </p>
      </div>
    </div>
  )
}