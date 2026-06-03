import { GetMenu } from "@/services/menu"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import { redirect } from "next/navigation"
import MenuClient from "./MenuClient"

export default async function MenuPage() {
  const token = await getServerCookie("token")
  if (!token) redirect("/login")

  try {
    const profilRes = await fetch(`${BASE_API_URL}/api/stan/admin/profile`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const profil = await profilRes.json()
    const idStan = profil?.id ?? profil?.data?.id

    const result = await GetMenu(idStan)
    const menus = Array.isArray(result.data) ? result.data : []
    return <MenuClient initialMenus={menus} />
  } catch {
    return <MenuClient initialMenus={[]} />
  }
}