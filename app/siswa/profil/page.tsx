import { GetMyProfile } from "@/services/siswa"
import { getServerCookie } from "@/lib/server.cookie"
import ProfilClient from "./ProfilClient"
import { redirect } from "next/navigation"

export default async function ProfilPage() {
  const token = await getServerCookie("token")

  if (!token) redirect("/login")

  const result = await GetMyProfile()
  return <ProfilClient initialSiswa={result.data ?? null} />
}