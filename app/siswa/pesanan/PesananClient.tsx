"use client"

import { useState } from "react"
import { Transaksi, StatusPesanan } from "@/types/transaksi"
import { getClientCookie } from "@/lib/client.cookie"
import { BASE_API_URL } from "@/global"
import Link from "next/link"

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

const statusSteps: StatusPesanan[] = ["belum_dikonfirm", "dimasak", "diantar", "sampai"]

const statusConfig: Record<StatusPesanan, { label: string; icon: string; color: string }> = {
    belum_dikonfirm: { label: "Menunggu Konfirmasi", icon: "⏳", color: "text-amber-500" },
    dimasak: { label: "Sedang Dimasak", icon: "👨‍🍳", color: "text-orange-500" },
    diantar: { label: "Sedang Diantar", icon: "🛵", color: "text-blue-500" },
    sampai: { label: "Pesanan Sampai", icon: "✅", color: "text-emerald-500" },
}

function DetailModal({ transaksi, onClose }: {
    transaksi: Transaksi
    onClose: () => void
}) {
    const stepIndex = statusSteps.indexOf(transaksi.status)
    const total = transaksi.detail_transaksi?.reduce(
        (sum, item) => sum + item.harga_beli * item.qty, 0
    ) ?? transaksi.total ?? 0
    const cfg = statusConfig[transaksi.status]

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#0055a4] px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white/60 text-xs">Pesanan #{transaksi.id}</p>
                            <p className="text-white font-bold text-lg mt-0.5">
                                {transaksi.stan?.nama_stan ?? "Stan Kantin"}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Status */}
                    <div className="mt-4 flex items-center gap-2">
                        <span className="text-2xl">{cfg.icon}</span>
                        <div>
                            <p className="text-white font-semibold text-sm">{cfg.label}</p>
                            <p className="text-white/50 text-xs">{formatTanggal(transaksi.tanggal)}</p>
                        </div>
                    </div>
                </div>

                {/* Progress steps */}
                <div className="px-6 py-4 bg-[#dcf4a2]/30">
                    <div className="flex items-center justify-between relative">
                        {/* Line */}
                        <div className="absolute top-3 left-3 right-3 h-0.5 bg-gray-200 z-0" />
                        <div
                            className="absolute top-3 left-3 h-0.5 bg-[#0055a4] z-0 transition-all duration-500"
                            style={{ width: `${(stepIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                        {statusSteps.map((step, i) => {
                            const done = i <= stepIndex
                            return (
                                <div key={step} className="relative z-10 flex flex-col items-center gap-1">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${done
                                            ? "bg-[#0055a4] border-[#0055a4] text-white"
                                            : "bg-white border-gray-300 text-gray-300"
                                        }`}>
                                        {done ? <span className="text-xs">✓</span> : <span className="text-xs">○</span>}
                                    </div>
                                    <p className={`text-[9px] text-center leading-tight max-w-[52px] ${done ? "text-[#0055a4] font-medium" : "text-gray-400"
                                        }`}>
                                        {statusConfig[step].label.split(" ")[0]}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-3 max-h-48 overflow-y-auto">
                    <p className="text-[#004483] text-xs font-semibold uppercase tracking-widest">Item Pesanan</p>
                    {transaksi.detail_transaksi?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div>
                                <p className="text-[#004483] text-sm font-medium">
                                    {item.menu?.nama_makanan ?? `Menu #${item.id_menu}`}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    {formatRupiah(item.harga_beli)} × {item.qty}
                                </p>
                            </div>
                            <p className="text-[#0055a4] text-sm font-semibold">
                                {formatRupiah(item.harga_beli * item.qty)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-gray-500 text-sm">Total Pembayaran</p>
                    <p className="text-[#004483] font-bold text-lg">{formatRupiah(total)}</p>
                </div>
            </div>
        </div>
    )
}

export default function PesananClient({ initialPesanan }: { initialPesanan: Transaksi[] }) {
    const [pesanan, setPesanan] = useState<Transaksi[]>(initialPesanan)
    const [selected, setSelected] = useState<Transaksi | null>(null)
    const [loading, setLoading] = useState(false)

    const refresh = async () => {
        setLoading(true)
        try {
            const token = getClientCookie("token")
            const res = await fetch(`${BASE_API_URL}/api/transaksi/history`, {
                headers: { authorization: `Bearer ${token}` },
                cache: "no-store",
            })
            const json = await res.json()
            const all: Transaksi[] = Array.isArray(json) ? json : json.data ?? []
            setPesanan(all.filter((t) => t.status !== "sampai"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#dcf4a2]">
            <div className="max-w-8xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-[#004483] text-xl font-bold">Pesanan Aktif</h1>
                        <p className="text-[#004483]/50 text-sm mt-0.5">{pesanan.length} pesanan berlangsung</p>
                    </div>
                    <button
                        onClick={refresh}
                        disabled={loading}
                        className="flex items-center gap-2 bg-[#0055a4] hover:bg-[#004483] disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "↻"
                        )}
                        Refresh
                    </button>
                </div>

                {pesanan.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">🍽️</p>
                        <p className="text-[#004483] font-semibold text-lg">Tidak ada pesanan aktif</p>
                        <p className="text-[#004483]/50 text-sm mt-1">Yuk pesan makanan di halaman menu!</p>
                        <Link
                            href="/siswa/dashboard"
                            className="inline-block mt-5 bg-[#0055a4] hover:bg-[#004483] text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-all"
                        >
                            Lihat Menu →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pesanan.map((t) => {
                            const cfg = statusConfig[t.status]
                            const total = t.detail_transaksi?.reduce(
                                (sum, item) => sum + item.harga_beli * item.qty, 0
                            ) ?? t.total ?? 0
                            const stepIndex = statusSteps.indexOf(t.status)

                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setSelected(t)}
                                    className="w-full text-left bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
                                >
                                    {/* Top */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-[#004483] font-bold text-base">
                                                {t.stan?.nama_stan ?? "Stan Kantin"}
                                            </p>
                                            <p className="text-gray-400 text-xs mt-0.5">
                                                {formatTanggal(t.tanggal)}
                                            </p>
                                        </div>
                                        <span className={`text-2xl`}>{cfg.icon}</span>
                                    </div>

                                    {/* Progress mini */}
                                    <div className="flex items-center gap-1 mb-4">
                                        {statusSteps.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 h-1.5 rounded-full transition-all ${i <= stepIndex ? "bg-[#0055a4]" : "bg-gray-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    {/* Status & total */}
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</span>
                                        <p className="text-[#004483] font-bold">{formatRupiah(total)}</p>
                                    </div>

                                    {/* Items preview */}
                                    {t.detail_transaksi && t.detail_transaksi.length > 0 && (
                                        <p className="text-gray-400 text-xs mt-2 line-clamp-1">
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
                <DetailModal
                    transaksi={selected}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    )
}