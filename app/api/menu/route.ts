import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

// GET semua menu
export async function GET() {
  try {
    const token = await getServerCookie("token")
    const res = await fetch(`${BASE_API_URL}/api/menu`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal memuat menu" }, { status: 500 })
  }
}

// POST tambah menu
export async function POST(req: NextRequest) {
  try {
    const token = await getServerCookie("token")
    const formData = await req.formData()
    const res = await fetch(`${BASE_API_URL}/api/menu`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal menambahkan menu" }, { status: 500 })
  }
}
