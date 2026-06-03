import { GetMyProfile } from "@/services/stan"
import { getServerCookie } from "@/lib/server.cookie"
import { redirect } from "next/navigation"
import ProfilClient from "./ProfilClient"

export default async function ProfilPage() {
  const token = await getServerCookie("token")
  if (!token) redirect("/login")

  const result = await GetMyProfile()
  const profil = result.status && result.data ? result.data : null
  return <ProfilClient initialProfil={profil} />
}