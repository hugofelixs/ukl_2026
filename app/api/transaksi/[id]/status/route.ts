import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getServerCookie("token")
    const body = await req.json()
    const res = await fetch(`${BASE_API_URL}/api/transaksi/${params.id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal update status" }, { status: 500 })
  }
}