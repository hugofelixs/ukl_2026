import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params
    const token = await getServerCookie("token")
    const body = await req.json()
    const res = await fetch(`${BASE_API_URL}/api/diskon/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    let data = {}
    try {
      data = await res.json()
    } catch {}
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal memperbarui diskon" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: Params) {
  try {
    const { id } = await context.params
    const token = await getServerCookie("token")
    const res = await fetch(`${BASE_API_URL}/api/diskon/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    let data = {}
    try {
      data = await res.json()
    } catch {}
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Gagal menghapus diskon" }, { status: 500 })
  }
} 