import { GetDiskon } from "@/services/diskon"
import { GetMenu } from "@/services/menu"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import { redirect } from "next/navigation"
import DiskonClient from "./DiskonClient"

export default async function DiskonPage() {
  const token = await getServerCookie("token")
  if (!token) redirect("/login")

  const profilRes = await fetch(`${BASE_API_URL}/api/stan/admin/profile`, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
  })
  const profil = await profilRes.json()
  const idStan = profil?.id ?? profil?.data?.id

  const menuRes = await GetMenu(idStan)
  const menus = Array.isArray(menuRes.data) ? menuRes.data : []
  const menuIds = menus.map((m) => m.id)

  const diskonRes = await GetDiskon()
  const semuaDiskon = Array.isArray(diskonRes.data) ? diskonRes.data : []
  const diskons = semuaDiskon.filter((d) =>
    d.menu_diskon?.some((md) => menuIds.includes(md.id_menu))
  )

  return <DiskonClient initialDiskons={diskons} menus={menus} />
}