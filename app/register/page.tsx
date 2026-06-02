"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BASE_API_URL } from "@/global"
import { setClientCookie } from "@/lib/client.cookie"

interface FormData {
  username: string
  password: string
  konfirmasi_password: string
  nama_siswa: string
  alamat: string
  telp: string
}

const initialForm: FormData = {
  username: "",
  password: "",
  konfirmasi_password: "",
  nama_siswa: "",
  alamat: "",
  telp: "",
}

export default function RegisterSiswaPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (form.password.length < 6) return setError("Password minimal 6 karakter")
    if (form.password !== form.konfirmasi_password)
      return setError("Password dan konfirmasi tidak sama")

    setLoading(true)
    try {
      const res = await fetch(`${BASE_API_URL}/api/auth/register/siswa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          nama_siswa: form.nama_siswa,
          alamat: form.alamat,
          telp: form.telp,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Registrasi gagal")

      router.push("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#dcf4a2] flex items-center justify-center px-4 py-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#0055a4] items-center justify-center text-[#dcf4a2] font-bold text-2xl mb-5 shadow-lg shadow-amber-400/20">
            T!
          </div>
          <h1 className="text-[#0055a4] text-2xl font-semibold tracking-tight">
            Daftar Akun TrayUp!
          </h1>
          <p className="text-[#004483]/40 text-sm mt-2">
            Buat akun untuk mulai order makanan di kantin!
          </p>
        </div>

        <div className="bg-white/[0.15] border border-white/[0.1] rounded-2xl p-7 backdrop-blur-sm shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">Username</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={set("username")}
                placeholder="Masukkan Username"
                className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">Nama Lengkap</label>
              <input
                type="text"
                required
                value={form.nama_siswa}
                onChange={set("nama_siswa")}
                placeholder="Masukkan Nama Lengkap"
                className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">
                Alamat <span className="text-[#0055a4]/20 normal-case tracking-normal">(opsional)</span>
              </label>
              <input
                type="text"
                value={form.alamat}
                onChange={set("alamat")}
                placeholder="Jl. Mawar No.1"
                className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">
                No. HP <span className="text-[#0055a4]/20 normal-case tracking-normal">(opsional)</span>
              </label>
              <input
                type="tel"
                value={form.telp}
                onChange={set("telp")}
                placeholder="08123456789"
                className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Min. 6 karakter"
                  className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 pr-24 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
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

            <div className="space-y-2">
              <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">Konfirmasi Password</label>
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.konfirmasi_password}
                onChange={set("konfirmasi_password")}
                placeholder="Ulangi password"
                className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-400/[0.08] border border-red-400/20 rounded-xl px-4 py-3">
                <span className="text-red-400 text-sm mt-0.5">⚠</span>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055a4] hover:bg-[#004488] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-[#dcf4a2] font-semibold rounded-xl py-3 text-sm transition-all shadow-lg shadow-[#0055a4]/10 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#dcf4a2]/30 border-t-[#dcf4a2] rounded-full animate-spin" />
                  Mendaftar...
                </span>
              ) : "Daftar Sekarang"}
            </button>
          </form>
        </div>

        <p className="text-center text-[#004483]/50 text-sm mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#0055a4] hover:text-[#004483] transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}