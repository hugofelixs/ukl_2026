"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Menu, JenisMenu } from "@/types/menu"
import { BASE_API_URL } from "@/global"

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n)
}

function getHargaDiskon(menu: Menu): number | null {
  if (!menu.menu_diskon?.length) return null
  const diskon = menu.menu_diskon[0].diskon
  return Math.round(menu.harga - (menu.harga * diskon.persentase_diskon) / 100)
}

type ModalMode = "tambah" | "edit"

interface FormState {
  nama_makanan: string
  harga: string
  jenis: JenisMenu
  deskripsi: string
  foto: File | null
  previewFoto: string | null
}

const emptyForm: FormState = {
  nama_makanan: "",
  harga: "",
  jenis: "makanan",
  deskripsi: "",
  foto: null,
  previewFoto: null,
}

interface ModalProps {
  mode: ModalMode
  form: FormState
  loading: boolean
  error: string | null
  onChange: (key: keyof FormState, value: string | File | null) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

function MenuModal({ mode, form, loading, error, onChange, onSubmit, onClose }: ModalProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    onChange("foto", file)
    if (file) onChange("previewFoto", URL.createObjectURL(file))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#dcf4a2] border-[#dcf4a2]/[0.08] rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <h2 className="text-[#004483] font-semibold text-base">
            {mode === "tambah" ? "Tambah Menu" : "Edit Menu"}
          </h2>
          <button onClick={onClose} className="text-[#004483]/70 hover:text-[#004483] transition-colors text-lg">✕</button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Foto */}
          <div>
            <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">Foto Menu</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-[#004483]/10 hover:border-[#004483]/50 rounded-xl overflow-hidden transition-colors"
            >
              {form.previewFoto ? (
                <div className="relative h-36 w-full">
                  <Image src={form.previewFoto} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs">Ganti foto</p>
                  </div>
                </div>
              ) : (
                <div className="h-36 flex flex-col items-center justify-center gap-2">
                  <span className="text-3xl">🖼️</span>
                  <p className="text-[#004483]/30 text-xs">Klik untuk upload foto</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          {/* Nama */}
          <div>
            <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">Nama Menu</label>
            <input
              type="text"
              required
              value={form.nama_makanan}
              onChange={(e) => onChange("nama_makanan", e.target.value)}
              placeholder="Nasi Goreng Spesial"
              className="w-full bg-white/[0.04] border border-[#004483]/[0.08] rounded-xl px-4 py-3 text-[#004483]/70 text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#004483]/50 transition-all"
            />
          </div>

          {/* Jenis */}
          <div>
            <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">Jenis</label>
            <div className="flex gap-2">
              {(["makanan", "minuman"] as JenisMenu[]).map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => onChange("jenis", j)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all capitalize ${form.jenis === j
                      ? "bg-[#004483] text-[#dcf4a2]"
                      : "bg-white/[0.04] border border-[#004483]/[0.08] text-[#004483]/50 hover:text-[#004483]/80"
                    }`}
                >
                  {j === "makanan" ? "🍔 Makanan" : "🥤 Minuman"}
                </button>
              ))}
            </div>
          </div>

          {/* Harga */}
          <div>
            <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">Harga (Rp)</label>
            <input
              type="number"
              required
              min={0}
              value={form.harga}
              onChange={(e) => onChange("harga", e.target.value)}
              placeholder="15000"
              className="w-full bg-white/[0.04] border border-[#004483]/[0.08] rounded-xl px-4 py-3 text-[#004483]/70 text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#004483]/50 transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-[#004483]/50 text-xs uppercase tracking-widest mb-2">
              Deskripsi <span className="text-[#004483]/25 normal-case tracking-normal">(opsional)</span>
            </label>
            <textarea
              rows={2}
              value={form.deskripsi}
              onChange={(e) => onChange("deskripsi", e.target.value)}
              placeholder="Deskripsi singkat menu..."
              className="w-full bg-white/[0.04] border border-[#004483]/[0.08] rounded-xl px-4 py-3 text-[#004483]/70 text-sm placeholder-[#004483]/30 focus:outline-none focus:border-[#004483]/50 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="flex gap-2 bg-red-400/[0.08] border border-red-400/20 rounded-xl px-4 py-3">
              <span className="text-red-400 text-sm">⚠</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/[0.04] border border-[#004483]/[0.2] text-[#004483]/50 hover:text-[#004483]/80 font-medium rounded-xl py-3 text-sm transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#004483] hover:bg-[#003366] disabled:opacity-50 disabled:cursor-not-allowed text-[#dcf4a2] font-semibold rounded-xl py-3 text-sm transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a0c10]/30 border-t-[#0a0c10] rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : mode === "tambah" ? "Tambah Menu" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ConfirmDelete({ menu, loading, onConfirm, onClose }: {
  menu: Menu
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#13151c] border border-white/[0.08] rounded-2xl shadow-2xl p-6 text-center space-y-4">
        <div className="text-4xl">🗑️</div>
        <div>
          <p className="text-white font-semibold text-base">Hapus Menu?</p>
          <p className="text-white/40 text-sm mt-1">
            <span className="text-white/70">{menu.nama_makanan}</span> akan dihapus permanen.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] text-white/60 font-medium rounded-xl py-3 text-sm transition-all">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold rounded-xl py-3 text-sm transition-all"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MenuClient({ initialMenus }: { initialMenus: Menu[] }) {
  const [menus, setMenus] = useState<Menu[]>(initialMenus)
  const [modal, setModal] = useState<{ open: boolean; mode: ModalMode; target?: Menu }>({ open: false, mode: "tambah" })
  const [deleteTarget, setDeleteTarget] = useState<Menu | null>(null)
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

  const openEdit = (menu: Menu) => {
    setForm({
      nama_makanan: menu.nama_makanan,
      harga: String(menu.harga),
      jenis: menu.jenis,
      deskripsi: menu.deskripsi ?? "",
      foto: null,
      previewFoto: menu.foto ? `${BASE_API_URL}/uploads/menu/${menu.foto}` : null,
    })
    setError(null)
    setModal({ open: true, mode: "edit", target: menu })
  }

  const handleFormChange = (key: keyof FormState, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("nama_makanan", form.nama_makanan)
      fd.append("harga", form.harga)
      fd.append("jenis", form.jenis)
      if (form.deskripsi) fd.append("deskripsi", form.deskripsi)
      if (form.foto) fd.append("foto", form.foto)

      if (modal.mode === "tambah") {
        const res = await fetch("/api/menu", { method: "POST", body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal menambahkan menu")
        setMenus((prev) => [json.data ?? json, ...prev])
        showToast("Menu berhasil ditambahkan!")
      } else if (modal.target) {
        const res = await fetch(`/api/menu/${modal.target.id}`, { method: "PUT", body: fd })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal memperbarui menu")
        const updated: Menu = json.data ?? json
        setMenus((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
        showToast("Menu berhasil diperbarui!")
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
      const res = await fetch(`/api/menu/${deleteTarget.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setMenus((prev) => prev.filter((m) => m.id !== deleteTarget.id))
      showToast("Menu berhasil dihapus!")
      setDeleteTarget(null)
    } catch {
      showToast("Gagal menghapus menu", "err")
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    // ✨ Ubah dari px-8 menjadi pl-0 pr-8, sama seperti ProfilClient
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
          <h1 className="text-[#004483] text-xl font-semibold">Kelola Menu</h1>
          <p className="text-[#004483]/35 text-sm mt-1">{menus.length} menu tersedia</p>
        </div>
        <button
          onClick={openTambah}
          className="flex items-center gap-2 bg-[#0055a4] hover:bg-[#004483] active:scale-[0.98] text-[#dcf4a2] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg"
        >
          <span className="text-base">+</span> Tambah Menu
        </button>
      </div>

      {/* Grid Menu - full width, tanpa batasan */}
      {menus.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🍔</p>
          <p className="text-[#004483]/35 text-sm">Belum ada menu. Tambahkan menu pertamamu!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {menus.map((menu) => {
            const hargaDiskon = getHargaDiskon(menu)
            const diskon = menu.menu_diskon?.[0]?.diskon
            return (
              <div
                key={menu.id}
                className="bg-white/40 border border-white/50 rounded-2xl overflow-hidden hover:bg-white/50 transition-all shadow-sm"
              >
                {/* Foto */}
                <div className="relative h-40 bg-white/[0.03]">
                  {menu.foto ? (
                    <Image
                      src={`${BASE_API_URL}/uploads/menu/${menu.foto}`}
                      alt={menu.nama_makanan}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-4xl text-white/10">
                      {menu.jenis === "minuman" ? "🥤" : "🍽️"}
                    </div>
                  )}
                  {diskon && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-lg">
                      -{diskon.persentase_diskon}%
                    </div>
                  )}
                  <div className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-lg font-semibold ${menu.jenis === "minuman" ? "bg-[#0055a4]/80 text-[#dcf4a2]" : "bg-[#dcf4a2]/80 text-[#0055a4]"}`}>
                    {menu.jenis}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-[#004483] font-semibold text-sm truncate">{menu.nama_makanan}</p>
                  {menu.deskripsi && (
                    <p className="text-[#004483]/45 text-xs mt-0.5 line-clamp-1">{menu.deskripsi}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      {hargaDiskon ? (
                        <>
                          <p className="text-[#004483] text-sm font-semibold">{formatRupiah(hargaDiskon)}</p>
                          <p className="text-[#004483]/25 text-xs line-through">{formatRupiah(menu.harga)}</p>
                        </>
                      ) : (
                        <p className="text-[#004483] text-sm font-semibold">{formatRupiah(menu.harga)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(menu)}
                        className="px-3 py-1.5 rounded-lg bg-[#0055a4] hover:bg-[#004488] text-[#dcf4a2] hover:text-white/80 text-xs font-semibold transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(menu)}
                        className="px-3 py-1.5 rounded-lg bg-red-400/[0.08] hover:bg-red-400/[0.15] text-red-400 text-xs font-semibold transition-all"
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
        <MenuModal
          mode={modal.mode}
          form={form}
          loading={loading}
          error={error}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onClose={() => setModal({ open: false, mode: "tambah" })}
        />
      )}

      {deleteTarget && (
        <ConfirmDelete
          menu={deleteTarget}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}