"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BASE_API_URL } from "@/global"
import { getClientCookie } from "@/lib/client.cookie"

// Perluas interface untuk mencakup detail_transaksi
interface DetailTransaksiItem {
  id: number
  id_menu: number
  qty: number
  harga_beli: number
  menu?: { nama_makanan: string }
}

interface Transaksi {
  id: number
  id_siswa: number
  siswa?: { nama_siswa: string }
  status: "belum_dikonfirm" | "dimasak" | "diantar" | "sampai"
  total?: number
  tanggal: string
  detail_transaksi?: DetailTransaksiItem[] // tambahan
}

interface Stats {
  totalMenu: number
  totalTransaksiHariIni: number
  pemasukanBulanIni: number
  menungguKonfirmasi: number
}

function formatRupiah(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n)
}

function formatWaktu(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const statusConfig: Record<
  Transaksi["status"],
  { label: string; dot: string; badge: string }
> = {
  belum_dikonfirm: { label: "Menunggu", dot: "bg-amber-400", badge: "bg-amber-400/10 text-amber-500 border-amber-400/20" },
  dimasak: { label: "Dimasak", dot: "bg-orange-400", badge: "bg-orange-400/10 text-orange-500 border-orange-400/20" },
  diantar: { label: "Diantar", dot: "bg-blue-400", badge: "bg-blue-400/10 text-blue-500 border-blue-400/20" },
  sampai: { label: "Sampai", dot: "bg-emerald-400", badge: "bg-emerald-400/10 text-emerald-600 border-emerald-400/20" },
}

function StatCard({ label, value, sub, icon }: {
  label: string
  value: string | number
  sub?: string
  icon: string
}) {
  return (
    <div className="bg-white/40 border border-white/50 rounded-2xl p-5 hover:bg-white/50 transition-colors shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <p className="text-[#004483]/60 text-xs uppercase tracking-widest">{label}</p>
        <span className="text-lg leading-none">{icon}</span>
      </div>
      <p className="text-2xl font-semibold text-[#004483]">{value}</p>
      {sub && <p className="text-[#004483]/40 text-xs mt-1.5">{sub}</p>}
    </div>
  )
}

async function fetchWithToken(url: string) {
  const token = getClientCookie("token")
  const res = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  return res.json()
}

// Helper untuk menghitung total dari detail_transaksi
function getTotalTransaksi(t: Transaksi): number {
  if (t.detail_transaksi && t.detail_transaksi.length > 0) {
    return t.detail_transaksi.reduce((sum, item) => sum + (item.harga_beli * item.qty), 0)
  }
  return t.total ?? 0
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [transaksi, setTransaksi] = useState<Transaksi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const now = new Date()
  const bulan = now.getMonth() + 1
  const tahun = now.getFullYear()
  const bulanLabel = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" })

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const token = getClientCookie("token")

        // Fetch profil stan dulu untuk dapat id_stan
        const profilRes = await fetch(`${BASE_API_URL}/api/stan/admin/profile`, {
          headers: { authorization: `Bearer ${token}` },
          cache: "no-store",
        })
        const profil = await profilRes.json()
        const idStan = profil?.id ?? profil?.data?.id

        const [menuRes, transaksiRes, rekapRes] = await Promise.allSettled([
          fetch(`${BASE_API_URL}/api/menu?id_stan=${idStan}`, {
            headers: { authorization: `Bearer ${token}` },
          }).then((r) => r.json()),

          fetch(`${BASE_API_URL}/api/transaksi/admin/all?bulan=${bulan}&tahun=${tahun}`, {
            headers: { authorization: `Bearer ${token}` },
          }).then((r) => r.json()),

          fetch(`${BASE_API_URL}/api/transaksi/admin/rekap?tahun=${tahun}`, {
            headers: { authorization: `Bearer ${token}` },
          }).then((r) => r.json()),
        ])

        const menus = menuRes.status === "fulfilled"
          ? (Array.isArray(menuRes.value) ? menuRes.value : menuRes.value?.data ?? [])
          : []

        const transaksis = transaksiRes.status === "fulfilled"
          ? (Array.isArray(transaksiRes.value) ? transaksiRes.value : transaksiRes.value?.data ?? [])
          : []

        const rekap = rekapRes.status === "fulfilled" ? rekapRes.value : null
        const rekapBulanIni = Array.isArray(rekap?.rekap)
          ? rekap.rekap.find((r: { bulan: number; total_pemasukan: number }) => r.bulan === bulan)
          : null

        const todayStr = new Date().toDateString()
        const hariIni = transaksis.filter(
          (t: Transaksi) => new Date(t.tanggal).toDateString() === todayStr
        )
        const menunggu = transaksis.filter(
          (t: Transaksi) => t.status === "belum_dikonfirm"
        )

        setStats({
          totalMenu: menus.length,
          totalTransaksiHariIni: hariIni.length,
          pemasukanBulanIni: rekapBulanIni?.total_pemasukan ?? 0,
          menungguKonfirmasi: menunggu.length,
        })

        setTransaksi(transaksis.slice(0, 8))
      } catch (e) {
        setError(e instanceof Error ? e.message : "Gagal memuat data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [bulan, tahun])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#0055a4] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#004483]/50 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-screen">
        <div className="text-center space-y-3">
          <p className="text-red-500 text-sm">⚠ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-[#004483]/50 text-xs hover:text-[#004483] transition-colors underline underline-offset-2"
          >
            Coba lagi
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 py-6 w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[#004483] text-xl font-semibold">Dashboard</h1>
        <p className="text-[#004483]/40 text-sm mt-1">
          Ringkasan aktivitas stan — {bulanLabel}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Menu" value={stats?.totalMenu ?? 0} sub="item tersedia" icon="🍔" />
        <StatCard label="Transaksi Hari Ini" value={stats?.totalTransaksiHariIni ?? 0} sub="pesanan masuk" icon="🧾" />
        <StatCard label="Pemasukan Bulan Ini" value={formatRupiah(stats?.pemasukanBulanIni ?? 0)} sub={bulanLabel} icon="💰" />
        <StatCard label="Perlu Konfirmasi" value={stats?.menungguKonfirmasi ?? 0} sub="pesanan menunggu" icon="⏳" />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/40 border border-white/50 rounded-2xl overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-white/40 flex items-center justify-between">
          <h2 className="text-[#004483] text-sm font-semibold">Transaksi Terbaru</h2>
          <Link
            href="/admin/dashboard/transaksi"
            className="text-[#004483]/50 text-xs hover:text-[#004483] transition-colors"
          >
            Lihat semua →
          </Link>
        </div>

        {transaksi.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-4xl mb-3">🧾</p>
            <p className="text-[#004483]/35 text-sm">Belum ada transaksi bulan ini</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-2.5 grid grid-cols-[3rem_1fr_auto_7rem] gap-4 border-b border-white/30">
              <p className="text-[#004483]/40 text-xs">ID</p>
              <p className="text-[#004483]/40 text-xs">Pelanggan</p>
              <p className="text-[#004483]/40 text-xs text-right">Status</p>
              <p className="text-[#004483]/40 text-xs text-right">Total</p>
            </div>

            <div className="divide-y divide-white/30">
              {transaksi.map((t) => {
                const cfg = statusConfig[t.status] ?? statusConfig.belum_dikonfirm
                const total = getTotalTransaksi(t) // hitung ulang
                return (
                  <div
                    key={t.id}
                    className="px-6 py-4 grid grid-cols-[3rem_1fr_auto_7rem] gap-4 items-center hover:bg-white/20 transition-colors"
                  >
                    <p className="text-[#004483]/30 text-xs font-mono">#{t.id}</p>

                    <div>
                      <p className="text-[#004483] text-sm font-medium">
                        {t.siswa?.nama_siswa ?? `Siswa #${t.id_siswa}`}
                      </p>
                      <p className="text-[#004483]/40 text-xs mt-0.5">
                        {formatWaktu(t.tanggal)}
                      </p>
                    </div>

                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>

                    <p className="text-[#004483] text-sm font-semibold tabular-nums text-right">
                      {formatRupiah(total)}
                    </p>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}