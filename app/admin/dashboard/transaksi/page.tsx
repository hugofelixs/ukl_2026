import { GetAllTransaksiAdmin } from "@/services/transaksi"
import { getServerCookie } from "@/lib/server.cookie"
import { redirect } from "next/navigation"
import TransaksiClient from "./TransaksiClient"

export default async function TransaksiPage() {
  const token = await getServerCookie("token")
  if (!token) redirect("/login")

  const now = new Date()
  const result = await GetAllTransaksiAdmin(now.getMonth() + 1, now.getFullYear())
  const transaksis = Array.isArray(result.data) ? result.data : []
  return <TransaksiClient initialTransaksis={transaksis} />
}