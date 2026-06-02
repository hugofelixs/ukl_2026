import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

export async function GET(req: NextRequest) {
  try {
    const token = await getServerCookie("token")
    const { searchParams } = new URL(req.url)
    const params = new URLSearchParams()
    if (searchParams.get("bulan")) params.append("bulan", searchParams.get("bulan")!)
    if (searchParams.get("tahun")) params.append("tahun", searchParams.get("tahun")!)
    const res = await fetch(`${BASE_API_URL}/api/transaksi/admin/all?${params}`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal memuat transaksi" }, { status: 500 })
  }
}