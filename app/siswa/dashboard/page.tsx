import { GetMenu } from "@/services/menu"
import { getServerCookie } from "@/lib/server.cookie"
import { GetMyProfile } from "@/services/siswa"
import DashboardSiswaClient from "./DashboardSiswaClient"

export default async function DashboardSiswaPage() {
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