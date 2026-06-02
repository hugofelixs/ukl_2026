"use client"

import { useState } from "react"
import { Stan } from "@/types/stan"

interface FormState {
  nama_stan: string
  nama_pemilik: string
  telp: string
}

export default function ProfilClient({ initialProfil }: { initialProfil: Stan | null }) {
  const [profil, setProfil] = useState<Stan | null>(initialProfil)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<FormState>({
    nama_stan: profil?.nama_stan ?? "",
    nama_pemilik: profil?.nama_pemilik ?? "",
    telp: profil?.telp ?? "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const startEdit = () => {
    setForm({
      nama_stan: profil?.nama_stan ?? "",
      nama_pemilik: profil?.nama_pemilik ?? "",
      telp: profil?.telp ?? "",
    })
    setError(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/stan/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_stan: form.nama_stan,
          nama_pemilik: form.nama_pemilik,
          telp: form.telp,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Gagal memperbarui profil")

      const updated: Stan = json.data ?? json
      setProfil(updated)
      setEditing(false)
      showToast("Profil berhasil diperbarui!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    // ✨ FULL WIDTH – menempel ke kiri, padding kanan & vertikal saja
    <div className="py-8 w-full pl-0 pr-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[60] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === "ok" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "ok" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}

      {/* Header – juga mepet kiri */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#004483] text-xl font-semibold">Profil Stan</h1>
          <p className="text-[#004483]/40 text-sm mt-1">Kelola informasi stan kamu</p>
        </div>
        {!editing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 bg-[#0055a4] hover:bg-[#004483] active:scale-[0.98] text-[#dcf4a2] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg"
          >
            ✎ Edit Profil
          </button>
        )}
      </div>

      {/* Profil Card – LEBAR PENUH (tanpa max-w-2xl) */}
      <div className="w-full">
        <div className="bg-white/40 border border-white/50 rounded-2xl p-8">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">Nama Stan</label>
                <input
                  type="text"
                  required
                  value={form.nama_stan}
                  onChange={(e) => setForm((prev) => ({ ...prev, nama_stan: e.target.value }))}
                  placeholder="Stan Mak Nyus"
                  className="w-full bg-[#dcf4a2]/20 border border-[#0055a4]/15 rounded-xl px-4 py-3 text-[#004483] text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#0055a4] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">Nama Pemilik</label>
                <input
                  type="text"
                  required
                  value={form.nama_pemilik}
                  onChange={(e) => setForm((prev) => ({ ...prev, nama_pemilik: e.target.value }))}
                  placeholder="Ibu Sari"
                  className="w-full bg-[#dcf4a2]/20 border border-[#0055a4]/15 rounded-xl px-4 py-3 text-[#004483] text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#0055a4] transition-all"
                />
              </div>

              <div>
                <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">
                  No. HP <span className="text-[#004483]/35 normal-case tracking-normal">(opsional)</span>
                </label>
                <input
                  type="tel"
                  value={form.telp}
                  onChange={(e) => setForm((prev) => ({ ...prev, telp: e.target.value }))}
                  placeholder="08987654321"
                  className="w-full bg-[#dcf4a2]/20 border border-[#0055a4]/15 rounded-xl px-4 py-3 text-[#004483] text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#0055a4] transition-all"
                />
              </div>

              {error && (
                <div className="flex gap-2 bg-red-100 border border-red-200 rounded-xl px-4 py-3">
                  <span className="text-red-500 text-sm">⚠</span>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={cancelEdit} className="flex-1 bg-[#dcf4a2]/30 hover:bg-[#dcf4a2]/50 text-[#004483]/60 font-medium rounded-xl py-3 text-sm transition-all">
                  Batal
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 disabled:cursor-not-allowed text-[#dcf4a2] font-semibold rounded-xl py-3 text-sm transition-all">
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          ) : profil ? (
            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-[#0055a4] flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profil.nama_stan?.[0]?.toUpperCase() ?? "S"}
                </div>
                <div>
                  <h2 className="text-[#004483] text-xl font-bold">{profil.nama_stan}</h2>
                  <p className="text-[#004483]/50 text-sm">ID Stan: #{profil.id}</p>
                </div>
              </div>

              <div className="border-t border-[#0055a4]/10 pt-6 space-y-4">
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <p className="text-[#004483]/50 text-sm">Nama Pemilik</p>
                  <p className="text-[#004483] text-sm font-medium">{profil.nama_pemilik}</p>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <p className="text-[#004483]/50 text-sm">No. HP</p>
                  <p className="text-[#004483] text-sm font-medium">{profil.telp ?? "—"}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#004483]/30 text-sm">Gagal memuat profil. Coba refresh halaman.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}