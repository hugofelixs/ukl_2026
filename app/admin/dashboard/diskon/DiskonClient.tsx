"use client"

import { useState } from "react"
import { Diskon } from "@/types/diskon"
import { Menu } from "@/types/menu"

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function formatPersen(n: number) {
  return `${n}%`
}

function isActive(tglAwal: string, tglAkhir: string) {
  const now = new Date()
  return new Date(tglAwal) <= now && new Date(tglAkhir) >= now
}

type ModalMode = "tambah" | "edit"

interface FormState {
  nama_diskon: string
  persentase_diskon: string
  tanggal_awal: string
  tanggal_akhir: string
  id_menu: number[]
}

const emptyForm: FormState = {
  nama_diskon: "",
  persentase_diskon: "",
  tanggal_awal: "",
  tanggal_akhir: "",
  id_menu: [],
}

function DiskonModal({
  mode,
  form,
  loading,
  error,
  menus,
  onChange,
  onSubmit,
  onClose,
}: {
  mode: ModalMode
  form: FormState
  loading: boolean
  error: string | null
  menus: Menu[]
  onChange: (key: keyof FormState, value: string | number[]) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}) {
  const toggleMenu = (id: number) => {
    const next = form.id_menu.includes(id)
      ? form.id_menu.filter((m) => m !== id)
      : [...form.id_menu, id]
    onChange("id_menu", next)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#dcf4a2] border border-[#0055a4]/10 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#0055a4]/10">
          <h2 className="text-[#004483] font-semibold text-base">
            {mode === "tambah" ? "Tambah Diskon" : "Edit Diskon"}
          </h2>
          <button onClick={onClose} className="text-[#004483]/40 hover:text-[#004483] transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">Nama Diskon</label>
            <input
              type="text"
              required
              value={form.nama_diskon}
              onChange={(e) => onChange("nama_diskon", e.target.value)}
              placeholder="Diskon Akhir Tahun"
              className="w-full bg-[#dcf4a2]/20 border border-[#0055a4]/15 rounded-xl px-4 py-3 text-[#004483] text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#0055a4] transition-all"
            />
          </div>

          <div>
            <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">Persentase (%)</label>
            <input
              type="number"
              required
              min={1}
              max={100}
              value={form.persentase_diskon}
              onChange={(e) => onChange("persentase_diskon", e.target.value)}
              placeholder="10"
              className="w-full bg-[#dcf4a2]/20 border border-[#0055a4]/15 rounded-xl px-4 py-3 text-[#004483] text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#0055a4] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">Tanggal Awal</label>
              <input
                type="date"
                required
                value={form.tanggal_awal}
                onChange={(e) => onChange("tanggal_awal", e.target.value)}
                className="w-full bg-[#dcf4a2]/20 border border-[#0055a4]/15 rounded-xl px-4 py-3 text-[#004483] text-sm focus:outline-none focus:border-[#0055a4] transition-all"
              />
            </div>
            <div>
              <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">Tanggal Akhir</label>
              <input
                type="date"
                required
                value={form.tanggal_akhir}
                onChange={(e) => onChange("tanggal_akhir", e.target.value)}
                className="w-full bg-[#dcf4a2]/20 border border-[#0055a4]/15 rounded-xl px-4 py-3 text-[#004483] text-sm focus:outline-none focus:border-[#0055a4] transition-all"
              />
            </div>
          </div>

          {/* Assign ke menu */}
          <div>
            <label className="block text-[#004483]/60 text-xs uppercase tracking-widest mb-2">
              Assign ke Menu <span className="text-[#004483]/35 normal-case tracking-normal">(opsional)</span>
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1 bg-[#dcf4a2]/10 rounded-xl p-2 border border-[#0055a4]/10">
              {menus.length === 0 ? (
                <p className="text-[#004483]/30 text-xs text-center py-2">Belum ada menu</p>
              ) : (
                menus.map((menu) => (
                  <label
                    key={menu.id}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                      form.id_menu.includes(menu.id)
                        ? "bg-[#0055a4]/10 text-[#004483] font-medium"
                        : "text-[#004483]/50 hover:bg-[#0055a4]/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.id_menu.includes(menu.id)}
                      onChange={() => toggleMenu(menu.id)}
                      className="accent-[#0055a4] w-4 h-4 rounded"
                    />
                    <span className="truncate">{menu.nama_makanan}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {error && (
            <div className="flex gap-2 bg-red-100 border border-red-200 rounded-xl px-4 py-3">
              <span className="text-red-500 text-sm">⚠</span>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 bg-[#dcf4a2]/30 hover:bg-[#dcf4a2]/50 text-[#004483]/60 font-medium rounded-xl py-3 text-sm transition-all">
              Batal
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all">
              {loading ? "Menyimpan..." : mode === "tambah" ? "Tambah Diskon" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmDelete({ diskon, loading, onConfirm, onClose }: {
  diskon: Diskon
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white border border-[#0055a4]/10 rounded-2xl shadow-2xl p-6 text-center space-y-4">
        <div className="text-4xl">🗑️</div>
        <div>
          <p className="text-[#004483] font-semibold text-base">Hapus Diskon?</p>
          <p className="text-[#004483]/50 text-sm mt-1">
            <span className="text-[#004483]/80 font-medium">{diskon.nama_diskon}</span> akan dihapus permanen.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-[#dcf4a2]/30 hover:bg-[#dcf4a2]/50 text-[#004483]/60 font-medium rounded-xl py-3 text-sm transition-all">Batal</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-all">
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DiskonClient({ initialDiskons, menus }: { initialDiskons: Diskon[]; menus: Menu[] }) {
  const [diskons, setDiskons] = useState<Diskon[]>(initialDiskons)
  const [modal, setModal] = useState<{ open: boolean; mode: ModalMode; target?: Diskon }>({ open: false, mode: "tambah" })
  const [deleteTarget, setDeleteTarget] = useState<Diskon | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const openTambah = () => {
    setForm(emptyForm)
    setError(null)
    setModal({ open: true, mode: "tambah" })
  }

  const openEdit = (diskon: Diskon) => {
    setForm({
      nama_diskon: diskon.nama_diskon,
      persentase_diskon: String(diskon.persentase_diskon),
      tanggal_awal: diskon.tanggal_awal.slice(0, 10),
      tanggal_akhir: diskon.tanggal_akhir.slice(0, 10),
      id_menu: diskon.menu_diskon?.map((md) => md.id_menu) ?? [],
    })
    setError(null)
    setModal({ open: true, mode: "edit", target: diskon })
  }

  const handleFormChange = (key: keyof FormState, value: string | number[]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const payload = {
      nama_diskon: form.nama_diskon,
      persentase_diskon: Number(form.persentase_diskon),
      tanggal_awal: form.tanggal_awal,
      tanggal_akhir: form.tanggal_akhir,
      id_menu: form.id_menu.length > 0 ? form.id_menu : undefined,
    }

    try {
      if (modal.mode === "tambah") {
        const res = await fetch("/api/diskon", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal menambahkan diskon")
        setDiskons((prev) => [json.data ?? json, ...prev])
        showToast("Diskon berhasil ditambahkan!")
      } else if (modal.target) {
        const res = await fetch(`/api/diskon/${modal.target.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal memperbarui diskon")
        const updated: Diskon = json.data ?? json
        setDiskons((prev) => prev.map((d) => (d.id === updated.id ? updated : d)))
        showToast("Diskon berhasil diperbarui!")
      }
      setModal({ open: false, mode: "tambah" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/diskon/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setDiskons((prev) => prev.filter((d) => d.id !== deleteTarget.id))
      showToast("Diskon berhasil dihapus!")
      setDeleteTarget(null)
    } catch {
      showToast("Gagal menghapus diskon", "err")
    } finally {
      setDeleteLoading(false)
    }
  }

  const now = new Date()

  return (
    <div className="py-8 w-full pl-0 pr-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[60] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === "ok" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "ok" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[#004483] text-xl font-semibold">Kelola Diskon</h1>
          <p className="text-[#004483]/40 text-sm mt-1">{diskons.length} diskon tersedia</p>
        </div>
        <button
          onClick={openTambah}
          className="flex items-center gap-2 bg-[#0055a4] hover:bg-[#004483] active:scale-[0.98] text-[#dcf4a2] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg"
        >
          <span className="text-base">+</span> Tambah Diskon
        </button>
      </div>

      {/* List */}
      {diskons.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏷️</p>
          <p className="text-[#004483]/35 text-sm">Belum ada diskon. Tambahkan diskon pertamamu!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {diskons.map((diskon) => {
            const active = isActive(diskon.tanggal_awal, diskon.tanggal_akhir)
            const menuList = diskon.menu_diskon?.map((md) => md.menu?.nama_makanan).filter(Boolean) ?? []
            return (
              <div
                key={diskon.id}
                className={`bg-white/40 border rounded-2xl p-5 transition-all ${
                  active ? "border-[#0055a4]/20" : "border-white/50 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[#004483] font-semibold text-base">{diskon.nama_diskon}</h3>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        active
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {active ? "● Aktif" : "○ Tidak Aktif"}
                      </span>
                    </div>
                    <p className="text-[#004483]/50 text-sm">
                      {formatTanggal(diskon.tanggal_awal)} — {formatTanggal(diskon.tanggal_akhir)}
                    </p>
                    {menuList.length > 0 && (
                      <p className="text-[#004483]/35 text-xs mt-1.5 truncate">
                        Menu: {menuList.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#0055a4]">{formatPersen(diskon.persentase_diskon)}</p>
                      <p className="text-[#004483]/40 text-xs">diskon</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(diskon)}
                        className="px-3 py-1.5 rounded-lg bg-[#dcf4a2]/30 hover:bg-[#dcf4a2]/50 text-[#004483]/60 hover:text-[#004483] text-xs transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(diskon)}
                        className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-500 text-xs transition-all"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal.open && (
        <DiskonModal
          mode={modal.mode}
          form={form}
          loading={loading}
          error={error}
          menus={menus}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={() => setModal({ open: false, mode: "tambah" })}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          diskon={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}