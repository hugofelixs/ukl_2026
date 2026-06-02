import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import HistoriClient from "./HistoriClient"
import { Transaksi } from "@/types/transaksi"

export default async function HistoriPage() {
  try {
    const now = new Date()
    const bulan = now.getMonth() + 1
    const tahun = now.getFullYear()
    const token = await getServerCookie("token")
    const res = await fetch(
      `${BASE_API_URL}/api/transaksi/history?bulan=${bulan}&tahun=${tahun}`,
      {
        headers: { authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    )
    const json = await res.json()
    const transaksis: Transaksi[] = Array.isArray(json) ? json : json.data ?? []
    return <HistoriClient initialTransaksis={transaksis} initialBulan={bulan} initialTahun={tahun} />
  } catch {
    return <HistoriClient initialTransaksis={[]} initialBulan={new Date().getMonth() + 1} initialTahun={new Date().getFullYear()} />
  }
}