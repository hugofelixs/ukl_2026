import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

export async function GET() {
  try {
    const token = await getServerCookie("token")
    const res = await fetch(`${BASE_API_URL}/api/diskon`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal memuat diskon" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getServerCookie("token")
    const body = await req.json()
    const res = await fetch(`${BASE_API_URL}/api/diskon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal menambahkan diskon" }, { status: 500 })
  }
}