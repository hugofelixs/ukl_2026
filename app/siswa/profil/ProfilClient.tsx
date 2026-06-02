"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Siswa } from "@/types/siswa"
import { BASE_API_URL } from "@/global"
import { getClientCookie } from "@/lib/client.cookie"

// ── Top Up Modal ──────────────────────────────────────────────────────────────
function TopUpModal({ saldo, onClose, onSuccess }: {
  saldo: number
  onClose: () => void
  onSuccess: (saldoBaru: number) => void
}) {
  const [nominal, setNominal] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nominalPreset = [10000, 20000, 50000, 100000]

  function formatRupiah(n: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(n)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const n = Number(nominal)
    if (!n || n < 1000) return setError("Minimal top up Rp 1.000")
    setLoading(true)
    setError(null)
    try {
      const token = getClientCookie("token")
      const res = await fetch(`${BASE_API_URL}/api/siswa/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nominal: n }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Gagal top up")
      onSuccess(json.saldo)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal top up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#0055a4] px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Saldo saat ini</p>
              <p className="text-white font-bold text-2xl mt-0.5">{formatRupiah(saldo)}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nominal presets */}
          <div>
            <p className="text-[#004483]/60 text-xs uppercase tracking-widest mb-3">
              Pilih Nominal
            </p>
            <div className="grid grid-cols-2 gap-2">
              {nominalPreset.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNominal(String(n))}
                  className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                    nominal === String(n)
                      ? "border-[#0055a4] bg-[#0055a4]/5 text-[#0055a4]"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {formatRupiah(n)}
                </button>
              ))}
            </div>
          </div>

          {/* Input manual */}
          <div>
            <p className="text-[#004483]/60 text-xs uppercase tracking-widest mb-2">
              Atau masukkan nominal lain
            </p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
              <input
                type="number"
                min={1000}
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-[#004483] text-sm focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm">
              ⚠ {error}
            </div>
          )}

          {/* Preview */}
          {nominal && Number(nominal) > 0 && (
            <div className="bg-[#dcf4a2]/50 border border-[#dcf4a2] rounded-xl px-4 py-3 flex justify-between items-center">
              <p className="text-[#004483] text-sm">Saldo setelah top up</p>
              <p className="text-[#0055a4] font-bold text-sm">
                {formatRupiah(saldo + Number(nominal))}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !nominal || Number(nominal) < 1000}
            className="w-full bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-4 text-sm transition-all active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </span>
            ) : "Top Up Sekarang"}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n)
}

export default function ProfilClient({ initialSiswa }: { initialSiswa: Siswa | null }) {
  const [siswa, setSiswa] = useState<Siswa | null>(initialSiswa)
  const [saldo, setSaldo] = useState<number>(initialSiswa?.saldo ?? 0)
  const [form, setForm] = useState({
    nama_siswa: initialSiswa?.nama_siswa ?? "",
    alamat: initialSiswa?.alamat ?? "",
    telp: initialSiswa?.telp ?? "",
  })
  const [foto, setFoto] = useState<File | null>(null)
  const [previewFoto, setPreviewFoto] = useState<string | null>(
    initialSiswa?.foto ? `${BASE_API_URL}/uploads/siswa/${initialSiswa.foto}` : null
  )
  const [loading, setLoading] = useState(false)
  const [showTopUp, setShowTopUp] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setFoto(file)
    if (file) setPreviewFoto(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = getClientCookie("token")
      const fd = new FormData()
      fd.append("nama_siswa", form.nama_siswa)
      fd.append("alamat", form.alamat)
      fd.append("telp", form.telp)
      if (foto) fd.append("foto", foto)

      const res = await fetch(`${BASE_API_URL}/api/siswa/profile`, {
        method: "PUT",
        headers: { authorization: `Bearer ${token}` },
        body: fd,
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Gagal memperbarui profil")

      setSiswa(json.data ?? json)
      setFoto(null)
      showToast("Profil berhasil diperbarui!")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal memperbarui profil", "err")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#dcf4a2]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-5 z-50 px-5 py-3 rounded-2xl text-sm font-medium shadow-lg ${
          toast.type === "ok" ? "bg-[#0055a4] text-white" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-lg mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#004483] text-xl font-bold">Profil Saya</h1>
          <p className="text-[#004483]/50 text-sm mt-0.5">Update informasi akunmu</p>
        </div>

        {/* Saldo card */}
        <div className="bg-[#0055a4] rounded-3xl px-6 py-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs">Saldo Kamu</p>
            <p className="text-white font-bold text-2xl mt-1">{formatRupiah(saldo)}</p>
          </div>
          <button
            onClick={() => setShowTopUp(true)}
            className="flex items-center gap-2 bg-[#dcf4a2] hover:bg-[#c8e888] text-[#0055a4] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98]"
          >
            <span>+</span> Top Up
          </button>
        </div>

        {/* Foto profil */}
        <div className="flex flex-col items-center mb-8">
          <div
            onClick={() => fileRef.current?.click()}
            className="relative w-24 h-24 rounded-full cursor-pointer group"
          >
            {previewFoto ? (
              <Image
                src={previewFoto}
                alt="Foto profil"
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#0055a4] flex items-center justify-center text-white text-3xl font-bold">
                {siswa?.nama_siswa?.[0]?.toUpperCase() ?? "S"}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium">Ganti</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 text-[#0055a4] text-sm font-medium hover:text-[#004483] transition-colors"
          >
            Ganti Foto Profil
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username readonly */}
            <div>
              <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">
                Username
              </label>
              <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-400 text-sm">
                {siswa?.username ?? "-"}
              </div>
            </div>

            {/* Nama */}
            <div>
              <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.nama_siswa}
                onChange={(e) => setForm({ ...form, nama_siswa: e.target.value })}
                placeholder="Nama lengkap kamu"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#004483] text-sm focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">
                Alamat
              </label>
              <input
                type="text"
                value={form.alamat}
                onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                placeholder="Jl. Mawar No. 1"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#004483] text-sm focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            {/* Telp */}
            <div>
              <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">
                No. HP
              </label>
              <input
                type="tel"
                value={form.telp}
                onChange={(e) => setForm({ ...form, telp: e.target.value })}
                placeholder="08123456789"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#004483] text-sm focus:outline-none focus:border-[#0055a4]/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-4 text-sm transition-all active:scale-[0.99]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : "Simpan Perubahan"}
            </button>
          </form>
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUp && (
        <TopUpModal
          saldo={saldo}
          onClose={() => setShowTopUp(false)}
          onSuccess={(saldoBaru) => {
            setSaldo(saldoBaru)
            setShowTopUp(false)
            showToast(`Top up berhasil! Saldo: ${formatRupiah(saldoBaru)} 💰`)
          }}
        />
      )}
    </div>
  )
}