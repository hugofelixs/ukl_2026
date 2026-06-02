import { GetMenu } from "@/services/menu"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import MenuClient from "./MenuClient"

export default async function MenuPage() {
  try {
    const token = await getServerCookie("token")

    // Fetch profil stan dulu untuk dapat id_stan
    const profilRes = await fetch(`${BASE_API_URL}/api/stan/admin/profile`, {
      headers: { authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const profil = await profilRes.json()
    const idStan = profil?.id ?? profil?.data?.id

    // Fetch menu filter by id_stan
    const result = await GetMenu(idStan)
    const menus = Array.isArray(result.data) ? result.data : []

    return <MenuClient initialMenus={menus} />
  } catch {
    return <MenuClient initialMenus={[]} />
  }
}