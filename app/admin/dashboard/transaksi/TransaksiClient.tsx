"use client"

import { useState } from "react"
import { Transaksi, StatusPesanan } from "@/types/transaksi"

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n)
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

const statusConfig: Record<StatusPesanan, { label: string; dot: string; badge: string }> = {
  belum_dikonfirm: { label: "Menunggu", dot: "bg-amber-400", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  dimasak: { label: "Dimasak", dot: "bg-orange-400", badge: "bg-orange-400/10 text-orange-400 border-orange-400/20" },
  diantar: { label: "Diantar", dot: "bg-blue-400", badge: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  sampai: { label: "Sampai", dot: "bg-emerald-400", badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
}

const nextStatus: Record<StatusPesanan, StatusPesanan | null> = {
  belum_dikonfirm: "dimasak",
  dimasak: "diantar",
  diantar: "sampai",
  sampai: null,
}

const nextStatusLabel: Record<StatusPesanan, string> = {
  belum_dikonfirm: "Konfirmasi & Masak",
  dimasak: "Tandai Diantar",
  diantar: "Tandai Sampai",
  sampai: "Selesai",
}

// Modal detail transaksi
function DetailModal({ transaksi, onClose, onUpdateStatus, onUpdatePayment, loadingId }: {
  transaksi: Transaksi
  onClose: () => void
  onUpdateStatus: (id: number, status: StatusPesanan) => void
  onUpdatePayment: (id: number) => void
  loadingId: number | null
}) {
  const cfg = statusConfig[transaksi.status]
  const next = nextStatus[transaksi.status]
  const isLoading = loadingId === transaksi.id

  const total = transaksi.detail_transaksi?.reduce(
    (sum, item) => sum + (item.harga_beli * item.qty), 0
  ) ?? 0

  const sudahLunas = transaksi.status_pembayaran === "lunas"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#dcf4a2] border border-[#dcf4a2]/[0.08] rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07]">
          <div>
            <h2 className="text-[#004483] font-semibold text-base">
              Detail Transaksi #{transaksi.id}
            </h2>
            <p className="text-[#004483]/35 text-xs mt-0.5">{formatTanggal(transaksi.tanggal)}</p>
          </div>
          <button onClick={onClose} className="text-[#004483]/35 hover:text-[#004483]/70 transition-colors text-lg">✕</button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Status pesanan */}
          <div className="flex items-center justify-between">
            <p className="text-[#004483]/50 text-xs uppercase tracking-widest">Status Pesanan</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${cfg.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>

          {/* Status pembayaran */}
          <div className="flex items-center justify-between">
            <p className="text-[#004483]/50 text-xs uppercase tracking-widest">Pembayaran</p>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${sudahLunas
                  ? "bg-emerald-400/10 text-emerald-600 border-emerald-400/20"
                  : "bg-red-400/10 text-red-500 border-red-400/20"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sudahLunas ? "bg-emerald-400" : "bg-red-400"}`} />
                {sudahLunas ? "Lunas" : "Belum Bayar"}
              </span>
              <span className={`text-xs px-2 py-1 rounded-lg font-medium ${transaksi.metode_pembayaran === "saldo"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-amber-100 text-amber-600"
                }`}>
                {transaksi.metode_pembayaran === "saldo" ? "💳 Saldo" : "💵 Tunai"}
              </span>
            </div>
          </div>

          {/* Siswa */}
          <div className="flex items-center justify-between">
            <p className="text-[#004483]/50 text-xs uppercase tracking-widest">Pelanggan</p>
            <div className="text-right">
              <p className="text-[#004483]/80 text-sm">
                {transaksi.siswa?.nama_siswa ?? `Siswa #${transaksi.id_siswa}`}
              </p>
              {transaksi.siswa?.telp && (
                <p className="text-[#004483]/40 text-xs">{transaksi.siswa.telp}</p>
              )}
            </div>
          </div>

          {/* Items */}
          {transaksi.detail_transaksi && transaksi.detail_transaksi.length > 0 && (
            <div>
              <p className="text-[#004483]/50 text-xs uppercase tracking-widest mb-3">Item Pesanan</p>
              <div className="space-y-2">
                {transaksi.detail_transaksi.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-[#0055a4] rounded-xl px-4 py-3">
                    <div>
                      <p className="text-[#dcf4a2] text-sm">{item.menu?.nama_makanan ?? `Menu #${item.id_menu}`}</p>
                      <p className="text-[#dcf4a2]/60 text-xs mt-0.5">{formatRupiah(item.harga_beli)} × {item.qty}</p>
                    </div>
                    <p className="text-[#dcf4a2] text-sm font-semibold">{formatRupiah(item.harga_beli * item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <p className="text-[#004483] font-medium">Total</p>
            <p className="text-[#004483] font-semibold text-lg">{formatRupiah(total)}</p>
          </div>

          {/* Konfirmasi pembayaran tunai */}
          {!sudahLunas && transaksi.metode_pembayaran === "tunai" && (
            <button
              onClick={() => onUpdatePayment(transaksi.id)}
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : "✓ Konfirmasi Pembayaran Tunai"}
            </button>
          )}

          {/* Update status pesanan */}
          {next && sudahLunas && (
            <button
              onClick={() => onUpdateStatus(transaksi.id, next)}
              disabled={isLoading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#0a0c10] font-semibold rounded-xl py-3 text-sm transition-all"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0a0c10]/30 border-t-[#0a0c10] rounded-full animate-spin" />
                  Memproses...
                </span>
              ) : nextStatusLabel[transaksi.status]}
            </button>
          )}

          {/* Belum bayar warning */}
          {next && !sudahLunas && transaksi.metode_pembayaran === "tunai" && (
            <p className="text-[#004483]/40 text-xs text-center">
              Konfirmasi pembayaran dulu sebelum proses pesanan
            </p>
          )}

          {!next && sudahLunas && (
            <div className="text-center py-2">
              <p className="text-emerald-500 text-sm font-medium">✓ Pesanan selesai & lunas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

export default function TransaksiClient({ initialTransaksis }: { initialTransaksis: Transaksi[] }) {
  const now = new Date()
  const [transaksis, setTransaksis] = useState<Transaksi[]>(initialTransaksis)
  const [selected, setSelected] = useState<Transaksi | null>(null)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)
  const [filterBulan, setFilterBulan] = useState(now.getMonth() + 1)
  const [filterTahun, setFilterTahun] = useState(now.getFullYear())
  const [loadingFilter, setLoadingFilter] = useState(false)

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleFilter = async () => {
    setLoadingFilter(true)
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transaksi/admin/all?bulan=${filterBulan}&tahun=${filterTahun}`,
        {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      )
      const json = await res.json()
      setTransaksis(Array.isArray(json) ? json : json.data ?? [])
    } catch {
      showToast("Gagal memuat data", "err")
    } finally {
      setLoadingFilter(false)
    }
  }

  const handleUpdateStatus = async (id: number, status: StatusPesanan) => {
    setLoadingId(id)
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transaksi/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Gagal update status")

      setTransaksis((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      )
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, status } : null)
      showToast("Status pesanan diperbarui!")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal update status", "err")
    } finally {
      setLoadingId(null)
    }
  }

  const handleUpdatePayment = async (id: number) => {
    setLoadingId(id)
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1]

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transaksi/${id}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status_pembayaran: "lunas" }),
        }
      )

      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Gagal konfirmasi pembayaran")

      setTransaksis((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status_pembayaran: "lunas" } : t))
      )
      if (selected?.id === id)
        setSelected((prev) => prev ? { ...prev, status_pembayaran: "lunas" } : null)
      showToast("Pembayaran dikonfirmasi!")
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Gagal konfirmasi pembayaran", "err")
    } finally {
      setLoadingId(null)
    }
  }

  const grouped = {
    belum_dikonfirm: transaksis.filter((t) => t.status === "belum_dikonfirm"),
    dimasak: transaksis.filter((t) => t.status === "dimasak"),
    diantar: transaksis.filter((t) => t.status === "diantar"),
    sampai: transaksis.filter((t) => t.status === "sampai"),
  }

  return (
    <div className="py-8 w-full pl-0 pr-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[60] px-5 py-3 rounded-xl text-sm font-medium shadow-lg ${toast.type === "ok" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"}`}>
          {toast.type === "ok" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#004483] text-xl font-semibold">Transaksi</h1>
        <p className="text-[#004483]/35 text-sm mt-1">{transaksis.length} pesanan ditemukan</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <select
          value={filterBulan}
          onChange={(e) => setFilterBulan(Number(e.target.value))}
          className="bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-2.5 text-[#0055a4]/70 text-sm focus:outline-none focus:border-[#0055a4]/50 transition-all"
        >
          {BULAN.map((b, i) => (
            <option key={i} value={i + 1} className="bg-[#13151c]">{b}</option>
          ))}
        </select>
        <select
          value={filterTahun}
          onChange={(e) => setFilterTahun(Number(e.target.value))}
          className="bg-white/[0.2] border border-[#dcf4a2]/[0.1] rounded-xl px-4 py-2.5 text-[#0055a4]/70 text-sm focus:outline-none focus:border-[#0055a4]/50 transition-all"
        >
          {[2024, 2025, 2026, 2027].map((y) => (
            <option key={y} value={y} className="bg-[#13151c]">{y}</option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          disabled={loadingFilter}
          className="bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 text-[#dcf4a2] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
        >
          {loadingFilter ? "Memuat..." : "Filter"}
        </button>
      </div>

      {/* Kanban */}
      {transaksis.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🧾</p>
          <p className="text-[#004483]/35 text-sm">Belum ada transaksi pada periode ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.entries(grouped) as [StatusPesanan, Transaksi[]][]).map(([status, items]) => {
            const cfg = statusConfig[status]
            return (
              <div key={status} className="bg-white/[0.2] border border-white/[0.06] rounded-2xl p-4">
                {/* Column header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${cfg.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <span className="text-[#004483]/50 text-xs font-mono">{items.length}</span>
                </div>

                {/* Cards */}
                <div className="space-y-3">
                  {items.length === 0 && (
                    <p className="text-[#004483]/30 text-xs text-center py-6">Tidak ada</p>
                  )}
                  {items.map((t) => {
                    // Hitung total dari detail transaksi jika ada
                    const totalFromDetails = t.detail_transaksi?.reduce(
                      (sum, item) => sum + (item.harga_beli * item.qty),
                      0
                    ) ?? t.total ?? 0

                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelected(t)}
                        className="w-full text-left bg-[#dcf4a2]/[0.7] hover:bg-[#dcf4a2] border border-white/[0.06] rounded-xl p-4 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[#0055a4]/40 text-xs">#{t.id}</p>
                          <p className="text-[#0055a4]/40 text-xs">
                            {new Date(t.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <p className="text-[#004383] text-sm font-medium truncate">
                          {t.siswa?.nama_siswa ?? `Siswa #${t.id_siswa}`}
                        </p>
                        <p className="text-amber-400 text-sm font-semibold mt-1">
                          {formatRupiah(totalFromDetails)}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <DetailModal
          transaksi={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePayment={handleUpdatePayment}   // <-- tambahkan ini
          loadingId={loadingId}
        />
      )}
    </div>
  )
}