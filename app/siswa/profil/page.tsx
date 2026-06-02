import { GetMyProfile } from "@/services/siswa"
import ProfilClient from "./ProfilClient"

export default async function ProfilPage() {
  const result = await GetMyProfile()
  return <ProfilClient initialSiswa={result.data ?? null} />
}