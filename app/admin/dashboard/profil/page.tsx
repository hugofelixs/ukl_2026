import { GetMyProfile } from "@/services/stan"
import ProfilClient from "./ProfilClient"

export default async function ProfilPage() {
  const result = await GetMyProfile()
  const profil = result.status && result.data ? result.data : null
  return <ProfilClient initialProfil={profil} />
}