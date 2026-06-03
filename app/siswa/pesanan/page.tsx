import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import PesananClient from "./PesananClient"
import { Transaksi } from "@/types/transaksi"
import { redirect } from "next/navigation"

export default async function PesananPage() {
  const token = await getServerCookie("token")

  if (!token) redirect("/login")

  try {
    const res = await fetch(`${BASE_API_URL}/api/transaksi/history`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const json = await res.json()
    const transaksis: Transaksi[] = Array.isArray(json) ? json : json.data ?? []
    const aktif = transaksis.filter((t) => t.status !== "sampai")
    return <PesananClient initialPesanan={aktif} />
  } catch {
    return <PesananClient initialPesanan={[]} />
  }
}