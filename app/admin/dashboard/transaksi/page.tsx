import { GetAllTransaksiAdmin } from "@/services/transaksi"
import TransaksiClient from "./TransaksiClient"

export default async function TransaksiPage() {
  const now = new Date()
  const result = await GetAllTransaksiAdmin(now.getMonth() + 1, now.getFullYear())
  const transaksis = Array.isArray(result.data) ? result.data : []
  return <TransaksiClient initialTransaksis={transaksis} />
}