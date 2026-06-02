import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

type Params = { params: Promise<{ id: string }> }

export async function PUT(req: NextRequest, context: Params) {
  try {
    const { id } = await context.params
    const token = await getServerCookie("token")
    const formData = await req.formData()
    const res = await fetch(`${BASE_API_URL}/api/menu/${id}`, {
      method: "PUT",
      headers: { authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal memperbarui menu" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: Params) {
  try {
    const { id } = await context.params
    const token = await getServerCookie("token")
    const res = await fetch(`${BASE_API_URL}/api/menu/${id}`, {
      method: "DELETE",
      headers: { authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: "Gagal menghapus menu" }, { status: 500 })
  }
}