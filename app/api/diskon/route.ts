import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

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

    let data = {}
    try {
      data = await res.json()
    } catch {
      // jika response tidak berisi JSON, abaikan
    }

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal menambahkan diskon" }, { status: 500 })
  }
}