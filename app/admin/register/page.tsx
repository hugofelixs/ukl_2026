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
  nama_stan: string
  nama_pemilik: string
  telp: string
}

const initialForm: FormData = {
  username: "",
  password: "",
  konfirmasi_password: "",
  nama_stan: "",
  nama_pemilik: "",
  telp: "",
}

export default function RegisterAdminPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPass, setShowPass] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.username.trim()) return setError("Username tidak boleh kosong")
    if (form.password.length < 6) return setError("Password minimal 6 karakter")
    if (form.password !== form.konfirmasi_password)
      return setError("Password dan konfirmasi tidak sama")
    setStep(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!form.nama_stan.trim()) return setError("Nama stan tidak boleh kosong")
    if (!form.nama_pemilik.trim()) return setError("Nama pemilik tidak boleh kosong")

    setLoading(true)
    try {
      const res = await fetch(`${BASE_API_URL}/api/auth/register/stan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password,
          nama_stan: form.nama_stan,
          nama_pemilik: form.nama_pemilik,
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
          <h1 className="text-[#0055a4] text-2xl font-semibold tracking-tight">Daftar Admin Stan</h1>
          <p className="text-[#004483]/40 text-sm mt-2">Buat akun untuk kelola stan kantin</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-[#0055a4]" : "bg-white/10"}`} />
          <div className={`flex-1 h-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-[#0055a4]" : "bg-white/10"}`} />
        </div>
        <div className="flex justify-between mb-6">
          <p className={`text-xs ${step === 1 ? "text-[#0055a4]" : "text-[#004483]/30"}`}>1. Akun</p>
          <p className={`text-xs ${step === 2 ? "text-[#0055a4]" : "text-[#004483]/30"}`}>2. Info Stan</p>
        </div>

        <div className="bg-white/[0.15] border border-white/[0.1] rounded-2xl p-7 backdrop-blur-sm shadow-lg">

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">Username</label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={set("username")}
                  placeholder="username untuk login"
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
                  <span className="text-red-400 text-sm">⚠</span>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" className="w-full bg-[#0055a4] hover:bg-[#004488] active:scale-[0.99] text-[#dcf4a2] font-semibold rounded-xl py-3 text-sm transition-all mt-2">
                Lanjut →
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">Nama Stan</label>
                <input
                  type="text"
                  required
                  value={form.nama_stan}
                  onChange={set("nama_stan")}
                  placeholder="Stan Mak Nyus"
                  className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">Nama Pemilik</label>
                <input
                  type="text"
                  required
                  value={form.nama_pemilik}
                  onChange={set("nama_pemilik")}
                  placeholder="Ibu Sari"
                  className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#0055a4]/70 text-xs uppercase tracking-widest">
                  No. HP <span className="text-[#0055a4]/25 normal-case tracking-normal">(opsional)</span>
                </label>
                <input
                  type="tel"
                  value={form.telp}
                  onChange={set("telp")}
                  placeholder="08987654321"
                  className="w-full bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-3 text-[#0055a4]/70 text-sm placeholder-[#0055a4]/20 focus:outline-none focus:border-[#0055a4]/50 transition-all"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-400/[0.08] border border-red-400/20 rounded-xl px-4 py-3">
                  <span className="text-red-400 text-sm">⚠</span>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(null) }}
                  className="flex-1 bg-white/[0.04] border border-[#004483]/[0.2] text-[#004483]/50 hover:text-[#004483]/80 font-medium rounded-xl py-3 text-sm transition-all"
                >
                  ← Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0055a4] hover:bg-[#004488] disabled:opacity-50 disabled:cursor-not-allowed text-[#dcf4a2] font-semibold rounded-xl py-3 text-sm transition-all"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#0a0c10]/30 border-t-[#0a0c10] rounded-full animate-spin" />
                      Daftar...
                    </span>
                  ) : "Daftar Sekarang"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-white/30 text-sm mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-amber-400 hover:text-amber-300 transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  )
}