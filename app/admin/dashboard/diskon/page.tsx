import { GetDiskon } from "@/services/diskon"
import { GetMenu } from "@/services/menu"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import DiskonClient from "./DiskonClient"

export default async function DiskonPage() {
  const token = await getServerCookie("token")

  // Fetch profil stan untuk dapat id_stan
  const profilRes = await fetch(`${BASE_API_URL}/api/stan/admin/profile`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  const profil = await profilRes.json()
  const idStan = profil?.id ?? profil?.data?.id

  // Fetch menu milik stan ini
  const menuRes = await GetMenu(idStan)
  const menus = Array.isArray(menuRes.data) ? menuRes.data : []

  // Ambil id menu milik stan ini
  const menuIds = menus.map((m) => m.id)

  // Fetch semua diskon lalu filter yang punya menu milik stan ini
  const diskonRes = await GetDiskon()
  const semuaDiskon = Array.isArray(diskonRes.data) ? diskonRes.data : []
  const diskons = semuaDiskon.filter((d) =>
    d.menu_diskon?.some((md) => menuIds.includes(md.id_menu))
  )

  return <DiskonClient initialDiskons={diskons} menus={menus} />
}