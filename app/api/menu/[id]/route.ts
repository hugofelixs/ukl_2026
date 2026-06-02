import { NextRequest, NextResponse } from "next/server"
import { BASE_API_URL } from "@/global"
import { getServerCookie } from "@/lib/server.cookie"

// PUT edit menu
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ← ubah jadi Promise
) {
  try {
    const { id } = await params                     // ← await params
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

// DELETE hapus menu
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }   // ← ubah jadi Promise
) {
  try {
    const { id } = await params                     // ← await params
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