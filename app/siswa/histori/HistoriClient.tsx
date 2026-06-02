"use client"

import { useState } from "react"
import { Transaksi, StatusPesanan } from "@/types/transaksi"
import { getClientCookie } from "@/lib/client.cookie"
import { BASE_API_URL } from "@/global"

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n)
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

const statusConfig: Record<StatusPesanan, { label: string; badge: string }> = {
  belum_dikonfirm: { label: "Menunggu", badge: "bg-amber-100 text-amber-600" },
  dimasak:         { label: "Dimasak",  badge: "bg-orange-100 text-orange-600" },
  diantar:         { label: "Diantar",  badge: "bg-blue-100 text-blue-600" },
  sampai:          { label: "Selesai",  badge: "bg-emerald-100 text-emerald-600" },
}

const BULAN = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"]

function NotaModal({ transaksi, onClose }: {
  transaksi: Transaksi
  onClose: () => void
}) {
  const total = transaksi.detail_transaksi?.reduce(
    (sum, item) => sum + item.harga_beli * item.qty, 0
  ) ?? transaksi.total ?? 0

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Nota header */}
        <div className="bg-[#0055a4] px-6 py-5 text-center">
          <p className="text-white/60 text-xs">TrayUp! Kantin Sekolah</p>
          <p className="text-white font-bold text-lg mt-1">Bukti Pesanan</p>
          <p className="text-white/60 text-xs mt-0.5">#{transaksi.id}</p>
        </div>

        {/* Dashed separator */}
        <div className="px-6 py-1">
          <div className="border-t-2 border-dashed border-gray-200" />
        </div>

        <div className="px-6 py-4 space-y-3">
          {/* Info */}
          <div className="flex justify-between text-sm">
            <p className="text-gray-400">Tanggal</p>
            <p className="text-[#004483] font-medium text-right">{formatTanggal(transaksi.tanggal)}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-400">Stan</p>
            <p className="text-[#004483] font-medium">{transaksi.stan?.nama_stan ?? "-"}</p>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-400">Status</p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[transaksi.status].badge}`}>
              {statusConfig[transaksi.status].label}
            </span>
          </div>
        </div>

        <div className="px-6 py-1">
          <div className="border-t-2 border-dashed border-gray-200" />
        </div>

        {/* Items */}
        <div className="px-6 py-4 space-y-2">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Item</p>
          {transaksi.detail_transaksi?.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div>
                <p className="text-[#004483] text-sm font-medium">
                  {item.menu?.nama_makanan ?? `Menu #${item.id_menu}`}
                </p>
                <p className="text-gray-400 text-xs">
                  {formatRupiah(item.harga_beli)} × {item.qty}
                </p>
              </div>
              <p className="text-[#004483] text-sm font-semibold">
                {formatRupiah(item.harga_beli * item.qty)}
              </p>
            </div>
          ))}
        </div>

        <div className="px-6 py-1">
          <div className="border-t-2 border-dashed border-gray-200" />
        </div>

        {/* Total */}
        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-[#004483] font-bold text-base">Total</p>
          <p className="text-[#0055a4] font-bold text-xl">{formatRupiah(total)}</p>
        </div>

        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full bg-[#dcf4a2] hover:bg-[#c8e888] text-[#004483] font-semibold rounded-2xl py-3 text-sm transition-all"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HistoriClient({ initialTransaksis, initialBulan, initialTahun }: {
  initialTransaksis: Transaksi[]
  initialBulan: number
  initialTahun: number
}) {
  const [transaksis, setTransaksis] = useState<Transaksi[]>(initialTransaksis)
  const [selected, setSelected] = useState<Transaksi | null>(null)
  const [filterBulan, setFilterBulan] = useState(initialBulan)
  const [filterTahun, setFilterTahun] = useState(initialTahun)
  const [loading, setLoading] = useState(false)

  const totalPemasukan = transaksis
    .filter((t) => t.status === "sampai")
    .reduce((sum, t) => {
      return sum + (t.detail_transaksi?.reduce((s, i) => s + i.harga_beli * i.qty, 0) ?? t.total ?? 0)
    }, 0)

  const handleFilter = async () => {
    setLoading(true)
    try {
      const token = getClientCookie("token")
      const res = await fetch(
        `${BASE_API_URL}/api/transaksi/history?bulan=${filterBulan}&tahun=${filterTahun}`,
        { headers: { authorization: `Bearer ${token}` }, cache: "no-store" }
      )
      const json = await res.json()
      setTransaksis(Array.isArray(json) ? json : json.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#dcf4a2]">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[#004483] text-xl font-bold">Histori Transaksi</h1>
          <p className="text-[#004483]/50 text-sm mt-0.5">
            {BULAN[filterBulan - 1]} {filterTahun}
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <select
            value={filterBulan}
            onChange={(e) => setFilterBulan(Number(e.target.value))}
            className="bg-white rounded-xl px-4 py-2.5 text-[#004483] text-sm focus:outline-none shadow-sm"
          >
            {BULAN.map((b, i) => (
              <option key={i} value={i + 1}>{b}</option>
            ))}
          </select>
          <select
            value={filterTahun}
            onChange={(e) => setFilterTahun(Number(e.target.value))}
            className="bg-white rounded-xl px-4 py-2.5 text-[#004483] text-sm focus:outline-none shadow-sm"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <button
            onClick={handleFilter}
            disabled={loading}
            className="bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
          >
            {loading ? "Memuat..." : "Filter"}
          </button>
        </div>

        {/* Summary card */}
        {transaksis.length > 0 && (
          <div className="bg-[#0055a4] rounded-3xl px-6 py-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Total Pengeluaran Bulan Ini</p>
              <p className="text-white font-bold text-2xl mt-1">{formatRupiah(totalPemasukan)}</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-xs">Transaksi</p>
              <p className="text-[#dcf4a2] font-bold text-2xl mt-1">{transaksis.length}x</p>
            </div>
          </div>
        )}

        {/* List */}
        {transaksis.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-[#004483] font-semibold">Tidak ada transaksi</p>
            <p className="text-[#004483]/50 text-sm mt-1">
              Belum ada transaksi di {BULAN[filterBulan - 1]} {filterTahun}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transaksis.map((t) => {
              const total = t.detail_transaksi?.reduce(
                (sum, item) => sum + item.harga_beli * item.qty, 0
              ) ?? t.total ?? 0
              const cfg = statusConfig[t.status]

              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className="w-full text-left bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#dcf4a2] flex items-center justify-center text-[#0055a4] font-bold text-xs">
                        #{t.id}
                      </div>
                      <div>
                        <p className="text-[#004483] font-semibold text-sm">
                          {t.stan?.nama_stan ?? "Stan Kantin"}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {formatTanggal(t.tanggal)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#0055a4] font-bold text-sm">{formatRupiah(total)}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                  {t.detail_transaksi && t.detail_transaksi.length > 0 && (
                    <p className="text-gray-400 text-xs mt-3 line-clamp-1 pl-13">
                      {t.detail_transaksi.map((d) => `${d.menu?.nama_makanan ?? "Menu"} ×${d.qty}`).join(", ")}
                    </p>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected && (
        <NotaModal
          transaksi={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}