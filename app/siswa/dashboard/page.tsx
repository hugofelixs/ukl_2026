import { GetMenu } from "@/services/menu"
import { GetMyProfile } from "@/services/siswa"
import { getServerCookie } from "@/lib/server.cookie"
import DashboardSiswaClient from "./DashboardSiswaClient"
import { redirect } from "next/navigation"

export default async function DashboardSiswaPage() {
  const token = await getServerCookie("token")

  // Kalau belum login, redirect ke login
  if (!token) redirect("/login")

  const [menuResult, profileResult] = await Promise.allSettled([
    GetMenu(),
    GetMyProfile(),
  ])

  const menus = menuResult.status === "fulfilled" && Array.isArray(menuResult.value.data)
    ? menuResult.value.data
    : []

  const siswa = profileResult.status === "fulfilled"
    ? profileResult.value.data ?? null
    : null

  return <DashboardSiswaClient initialMenus={menus} siswa={siswa} />
}