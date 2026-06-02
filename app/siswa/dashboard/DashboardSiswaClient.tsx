"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Menu } from "@/types/menu"
import { Siswa } from "@/types/siswa"
import { MetodePembayaran } from "@/types/transaksi"
import { BASE_API_URL } from "@/global"
import { getClientCookie } from "@/lib/client.cookie"

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Types ─────────────────────────────────────────────────────────────────────
interface CartItem {
  menu: Menu
  qty: number
}

// ── Menu Detail Modal ─────────────────────────────────────────────────────────
function MenuDetailModal({ menu, qty, onAdd, onRemove, onClose }: {
  menu: Menu
  qty: number
  onAdd: () => void
  onRemove: () => void
  onClose: () => void
}) {
  const hargaDiskon = getHargaDiskon(menu)
  const diskon = menu.menu_diskon?.[0]?.diskon

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Foto */}
        <div className="relative h-56 bg-[#dcf4a2]/30">
          {menu.foto ? (
            <Image
              src={`${BASE_API_URL}/uploads/menu/${menu.foto}`}
              alt={menu.nama_makanan}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-7xl">
              {menu.jenis === "minuman" ? "🥤" : "🍽️"}
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all shadow-sm"
          >
            ✕
          </button>
          {diskon && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {diskon.persentase_diskon}% OFF
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-6">
          <span className={`inline-flex text-xs px-2.5 py-1 rounded-full font-medium mb-3 ${
            menu.jenis === "minuman"
              ? "bg-blue-100 text-blue-600"
              : "bg-orange-100 text-orange-600"
          }`}>
            {menu.jenis === "minuman" ? "🥤 Minuman" : "🍔 Makanan"}
          </span>

          <h2 className="text-[#004483] font-bold text-xl">{menu.nama_makanan}</h2>

          {menu.stan && (
            <p className="text-gray-400 text-xs mt-1">🏪 {menu.stan.nama_stan}</p>
          )}

          {menu.deskripsi ? (
            <p className="text-gray-500 text-sm mt-3 leading-relaxed">{menu.deskripsi}</p>
          ) : (
            <p className="text-gray-300 text-sm mt-3 italic">Tidak ada deskripsi</p>
          )}

          {/* Harga */}
          <div className="mt-4 flex items-center gap-3">
            {hargaDiskon ? (
              <>
                <p className="text-[#0055a4] font-bold text-2xl">{formatRupiah(hargaDiskon)}</p>
                <div>
                  <p className="text-gray-300 text-xs line-through">{formatRupiah(menu.harga)}</p>
                  <p className="text-red-400 text-xs font-medium">
                    Hemat {formatRupiah(menu.harga - hargaDiskon)}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-[#0055a4] font-bold text-2xl">{formatRupiah(menu.harga)}</p>
            )}
          </div>

          {diskon && (
            <div className="mt-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <p className="text-red-400 text-xs">
                🏷️ Diskon berlaku s/d{" "}
                {new Date(diskon.tanggal_akhir).toLocaleDateString("id-ID", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
          )}

          {/* Add to cart */}
          <div className="mt-5">
            {qty === 0 ? (
              <button
                onClick={onAdd}
                className="w-full bg-[#0055a4] hover:bg-[#004483] text-white font-semibold rounded-2xl py-4 text-sm transition-all active:scale-[0.99] shadow-lg shadow-[#0055a4]/20"
              >
                + Tambah ke Keranjang
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={onRemove}
                  className="w-12 h-12 rounded-2xl bg-[#dcf4a2] hover:bg-[#c8e888] text-[#004483] font-bold text-xl transition-all flex items-center justify-center"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <p className="text-[#004483] font-bold text-lg">{qty}</p>
                  <p className="text-gray-400 text-xs">dalam keranjang</p>
                </div>
                <button
                  onClick={onAdd}
                  className="w-12 h-12 rounded-2xl bg-[#0055a4] hover:bg-[#004483] text-white font-bold text-xl transition-all flex items-center justify-center shadow-md shadow-[#0055a4]/20"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Order Modal ───────────────────────────────────────────────────────────────
function OrderModal({ cart, onQtyChange, onRemove, onClose, onSubmit, loading, error, metodePembayaran, onMetodeChange, saldo }: {
  cart: CartItem[]
  onQtyChange: (menuId: number, qty: number) => void
  onRemove: (menuId: number) => void
  onClose: () => void
  onSubmit: () => void
  loading: boolean
  error: string | null
  metodePembayaran: MetodePembayaran
  onMetodeChange: (m: MetodePembayaran) => void
  saldo: number
}) {
  const total = cart.reduce((sum, item) => {
    const harga = getHargaDiskon(item.menu) ?? item.menu.harga
    return sum + harga * item.qty
  }, 0)

  const saldoKurang = metodePembayaran === "saldo" && saldo < total

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-[#004483] font-bold text-lg">Keranjang Pesanan</h2>
            <p className="text-gray-400 text-xs mt-0.5">{cart.length} item dipilih</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="px-6 py-4 space-y-3 max-h-48 overflow-y-auto">
          {cart.map((item) => {
            const harga = getHargaDiskon(item.menu) ?? item.menu.harga
            return (
              <div key={item.menu.id} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {item.menu.foto ? (
                    <Image
                      src={`${BASE_API_URL}/uploads/menu/${item.menu.foto}`}
                      alt={item.menu.nama_makanan}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      {item.menu.jenis === "minuman" ? "🥤" : "🍽️"}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#004483] text-sm font-medium truncate">
                    {item.menu.nama_makanan}
                  </p>
                  <p className="text-[#0055a4] text-xs font-semibold">
                    {formatRupiah(harga)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      item.qty === 1
                        ? onRemove(item.menu.id)
                        : onQtyChange(item.menu.id, item.qty - 1)
                    }
                    className="w-7 h-7 rounded-full bg-[#dcf4a2] hover:bg-[#c8e888] text-[#004483] font-bold text-sm transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-[#004483] text-sm font-semibold w-5 text-center">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onQtyChange(item.menu.id, item.qty + 1)}
                    className="w-7 h-7 rounded-full bg-[#0055a4] hover:bg-[#004483] text-white font-bold text-sm transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Metode Pembayaran */}
        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-[#004483]/60 text-xs uppercase tracking-widest mb-3">
            Metode Pembayaran
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(["tunai", "saldo"] as MetodePembayaran[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onMetodeChange(m)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all ${
                  metodePembayaran === m
                    ? "border-[#0055a4] bg-[#0055a4]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-2xl">{m === "tunai" ? "💵" : "💳"}</span>
                <p className={`text-sm font-semibold ${
                  metodePembayaran === m ? "text-[#0055a4]" : "text-gray-500"
                }`}>
                  {m === "tunai" ? "Tunai" : "Saldo"}
                </p>
                {m === "saldo" && (
                  <p className={`text-xs ${saldo < total ? "text-red-400" : "text-gray-400"}`}>
                    {formatRupiah(saldo)}
                  </p>
                )}
              </button>
            ))}
          </div>

          {saldoKurang && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <p className="text-red-500 text-xs">
                ⚠ Saldo tidak cukup. Kekurangan {formatRupiah(total - saldo)}
              </p>
            </div>
          )}

          {metodePembayaran === "tunai" && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-amber-600 text-xs">
                💵 Pembayaran tunai dilakukan langsung ke stan
              </p>
            </div>
          )}
        </div>

        {/* Total & submit */}
        <div className="px-6 py-5 border-t border-gray-100 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-500 text-sm">
              ⚠ {error}
            </div>
          )}
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Total Pembayaran</p>
            <p className="text-[#004483] text-xl font-bold">{formatRupiah(total)}</p>
          </div>
          <button
            onClick={onSubmit}
            disabled={loading || cart.length === 0 || saldoKurang}
            className="w-full bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl py-4 text-sm transition-all active:scale-[0.99]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </span>
            ) : metodePembayaran === "tunai"
              ? "Pesan & Bayar di Stan"
              : "Pesan & Bayar Pakai Saldo"
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Menu Card ─────────────────────────────────────────────────────────────────
function MenuCard({ menu, qty, onAdd, onRemove, onOpenDetail }: {
  menu: Menu
  qty: number
  onAdd: () => void
  onRemove: () => void
  onOpenDetail: () => void
}) {
  const hargaDiskon = getHargaDiskon(menu)
  const diskon = menu.menu_diskon?.[0]?.diskon

  return (
    <div
      onClick={onOpenDetail}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
    >
      <div className="relative h-44 bg-[#dcf4a2]/30">
        {diskon && (
          <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {diskon.persentase_diskon}% OFF
          </div>
        )}
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            menu.jenis === "minuman"
              ? "bg-blue-100 text-blue-600"
              : "bg-orange-100 text-orange-600"
          }`}>
            {menu.jenis === "minuman" ? "🥤" : "🍔"} {menu.jenis}
          </span>
        </div>
        {menu.foto ? (
          <Image
            src={`${BASE_API_URL}/uploads/menu/${menu.foto}`}
            alt={menu.nama_makanan}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-6xl">
            {menu.jenis === "minuman" ? "🥤" : "🍽️"}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[#004483] font-bold text-sm">{menu.nama_makanan}</p>
        {menu.stan && (
          <p className="text-gray-400 text-xs mt-0.5">🏪 {menu.stan.nama_stan}</p>
        )}
        {menu.deskripsi ? (
          <p className="text-gray-400 text-xs mt-1 line-clamp-1">{menu.deskripsi}</p>
        ) : (
          <p className="text-gray-300 text-xs mt-1 italic">Tap untuk lihat detail</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div>
            {hargaDiskon ? (
              <>
                <p className="text-[#0055a4] font-bold text-base">{formatRupiah(hargaDiskon)}</p>
                <p className="text-gray-300 text-xs line-through">{formatRupiah(menu.harga)}</p>
              </>
            ) : (
              <p className="text-[#0055a4] font-bold text-base">{formatRupiah(menu.harga)}</p>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            {qty === 0 ? (
              <button
                onClick={onAdd}
                className="w-9 h-9 rounded-full bg-[#0055a4] hover:bg-[#004483] text-white font-bold text-lg transition-all active:scale-95 flex items-center justify-center shadow-md shadow-[#0055a4]/20"
              >
                +
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onRemove}
                  className="w-8 h-8 rounded-full bg-[#dcf4a2] hover:bg-[#c8e888] text-[#004483] font-bold text-sm transition-all flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-[#004483] font-bold text-sm w-5 text-center">{qty}</span>
                <button
                  onClick={onAdd}
                  className="w-8 h-8 rounded-full bg-[#0055a4] hover:bg-[#004483] text-white font-bold text-sm transition-all flex items-center justify-center"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
interface Props {
  initialMenus: Menu[]
  siswa: Siswa | null
}

export default function DashboardSiswaClient({ initialMenus, siswa }: Props) {
  const [menus] = useState<Menu[]>(initialMenus)
  const [cart, setCart] = useState<CartItem[]>([])
  const [filter, setFilter] = useState<"semua" | "makanan" | "minuman">("semua")
  const [search, setSearch] = useState("")
  const [showCart, setShowCart] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [metodePembayaran, setMetodePembayaran] = useState<MetodePembayaran>("tunai")
  const [saldo, setSaldo] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

  // Fetch saldo siswa
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const token = getClientCookie("token")
        const res = await fetch(`${BASE_API_URL}/api/siswa/profile`, {
          headers: { authorization: `Bearer ${token}` },
        })
        const json = await res.json()
        const data = json?.data ?? json
        setSaldo(data?.saldo ?? 0)
      } catch {
        setSaldo(0)
      }
    }
    fetchSaldo()
  }, [])

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Cart helpers ──
  const getQty = (menuId: number) =>
    cart.find((c) => c.menu.id === menuId)?.qty ?? 0

  const addToCart = (menu: Menu) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menu.id === menu.id)
      if (existing)
        return prev.map((c) =>
          c.menu.id === menu.id ? { ...c, qty: c.qty + 1 } : c
        )
      return [...prev, { menu, qty: 1 }]
    })
  }

  const removeFromCart = (menuId: number) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menu.id === menuId)
      if (!existing) return prev
      if (existing.qty === 1) return prev.filter((c) => c.menu.id !== menuId)
      return prev.map((c) =>
        c.menu.id === menuId ? { ...c, qty: c.qty - 1 } : c
      )
    })
  }

  const changeQty = (menuId: number, qty: number) => {
    setCart((prev) =>
      prev.map((c) => (c.menu.id === menuId ? { ...c, qty } : c))
    )
  }

  const removeItem = (menuId: number) => {
    setCart((prev) => prev.filter((c) => c.menu.id !== menuId))
  }

  // ── Filter & group ──
  const filtered = menus.filter((m) => {
    const matchFilter = filter === "semua" || m.jenis === filter
    const matchSearch =
      m.nama_makanan.toLowerCase().includes(search.toLowerCase()) ||
      m.stan?.nama_stan.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const grouped = filtered.reduce((acc, menu) => {
    const stanNama = menu.stan?.nama_stan ?? "Stan Lainnya"
    if (!acc[stanNama]) acc[stanNama] = []
    acc[stanNama].push(menu)
    return acc
  }, {} as Record<string, Menu[]>)

  // ── Submit order ──
  const handleOrder = async () => {
    if (cart.length === 0) return
    setLoading(true)
    setError(null)

    const stanIds = [...new Set(cart.map((c) => c.menu.id_stan))]
    if (stanIds.length > 1) {
      setError("Pesanan hanya bisa dari 1 stan. Hapus item dari stan lain terlebih dahulu.")
      setLoading(false)
      return
    }

    try {
      const token = getClientCookie("token")
      const res = await fetch(`${BASE_API_URL}/api/transaksi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_stan: stanIds[0],
          metode_pembayaran: metodePembayaran,
          items: cart.map((c) => ({ id_menu: c.menu.id, qty: c.qty })),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Gagal membuat pesanan")

      // Refresh saldo kalau bayar pakai saldo
      if (metodePembayaran === "saldo") {
        const profilRes = await fetch(`${BASE_API_URL}/api/siswa/profile`, {
          headers: { authorization: `Bearer ${token}` },
        })
        const profilJson = await profilRes.json()
        setSaldo((profilJson?.data ?? profilJson)?.saldo ?? 0)
      }

      setCart([])
      setShowCart(false)
      showToast(
        metodePembayaran === "saldo"
          ? "Pesanan berhasil! Saldo terpotong 🎉"
          : "Pesanan berhasil! Bayar tunai di stan 🎉"
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat pesanan")
    } finally {
      setLoading(false)
    }
  }

  const totalItem = cart.reduce((sum, c) => sum + c.qty, 0)
  const totalHarga = cart.reduce(
    (sum, c) => sum + (getHargaDiskon(c.menu) ?? c.menu.harga) * c.qty,
    0
  )

  return (
    <div className="min-h-screen bg-[#dcf4a2]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-5 z-[60] px-5 py-3 rounded-2xl text-sm font-medium shadow-lg ${
          toast.type === "ok" ? "bg-[#0055a4] text-white" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Hero */}
      <section className="max-w-8xl mx-auto px-6 pt-10 pb-8">
        <div className="bg-[#0055a4] rounded-3xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute -bottom-8 -right-4 w-32 h-32 bg-[#dcf4a2]/10 rounded-full" />
          <div className="relative z-10">
            <p className="text-[#dcf4a2] text-sm font-medium mb-2">
              👋 Halo, {siswa?.nama_siswa ?? "Siswa"}!
            </p>
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">
              Mau makan <br className="hidden md:block" />
              <span className="text-[#dcf4a2]">apa hari ini?</span>
            </h1>
            <p className="text-white/60 text-sm mt-3">
              Pilih menu favoritmu dari stan-stan kantin sekolah
            </p>
          </div>
          <div className="relative z-10 text-9xl select-none">🍱</div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="max-w-8xl mx-auto px-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu atau stan..."
              className="w-full bg-white rounded-2xl pl-11 pr-4 py-3.5 text-[#004483] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0055a4]/30 shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            {(["semua", "makanan", "minuman"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-3.5 rounded-2xl text-sm font-medium transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-[#0055a4] text-white shadow-md shadow-[#0055a4]/20"
                    : "bg-white text-[#004483]/60 hover:text-[#004483] shadow-sm"
                }`}
              >
                {f === "semua" ? "Semua" : f === "makanan" ? "🍔 Makanan" : "🥤 Minuman"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="max-w-8xl mx-auto px-6 pb-32">
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-[#004483]/40 text-sm">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(grouped).map(([stanNama, items]) => (
              <div key={stanNama}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-xl bg-[#0055a4] flex items-center justify-center text-white text-sm">
                    🏪
                  </div>
                  <h2 className="text-[#004483] font-bold text-lg">{stanNama}</h2>
                  <div className="flex-1 h-px bg-[#004483]/10" />
                  <span className="text-[#004483]/40 text-xs">{items.length} menu</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {items.map((menu) => (
                    <MenuCard
                      key={menu.id}
                      menu={menu}
                      qty={getQty(menu.id)}
                      onAdd={() => addToCart(menu)}
                      onRemove={() => removeFromCart(menu.id)}
                      onOpenDetail={() => setSelectedMenu(menu)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating cart button */}
      {totalItem > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => { setShowCart(true); setError(null) }}
            className="flex items-center gap-4 bg-[#0055a4] hover:bg-[#004483] text-white px-6 py-4 rounded-2xl shadow-xl shadow-[#0055a4]/30 transition-all active:scale-[0.98]"
          >
            <div className="relative">
              <span className="text-xl">🛒</span>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#dcf4a2] text-[#004483] text-xs font-bold rounded-full flex items-center justify-center">
                {totalItem}
              </span>
            </div>
            <div className="text-left">
              <p className="text-xs text-white/70">{totalItem} item dipilih</p>
              <p className="text-sm font-semibold">{formatRupiah(totalHarga)}</p>
            </div>
            <span className="text-white/60 text-sm">Pesan →</span>
          </button>
        </div>
      )}

      {/* Detail modal */}
      {selectedMenu && (
        <MenuDetailModal
          menu={selectedMenu}
          qty={getQty(selectedMenu.id)}
          onAdd={() => addToCart(selectedMenu)}
          onRemove={() => removeFromCart(selectedMenu.id)}
          onClose={() => setSelectedMenu(null)}
        />
      )}

      {/* Cart modal */}
      {showCart && (
        <OrderModal
          cart={cart}
          onQtyChange={changeQty}
          onRemove={removeItem}
          onClose={() => setShowCart(false)}
          onSubmit={handleOrder}
          loading={loading}
          error={error}
          metodePembayaran={metodePembayaran}
          onMetodeChange={setMetodePembayaran}
          saldo={saldo}
        />
      )}
    </div>
  )
}