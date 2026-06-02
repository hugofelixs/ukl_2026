import SiswaNavbar from "@/components/SiswaNavbar"

export const metadata = {
  title: "TrayUp! — Kantin Sekolah",
  description: "Pesan makanan di kantin sekolah",
}

type PropsLayout = {
  children: React.ReactNode
}

const SiswaLayout = ({ children }: PropsLayout) => {
  return (
    <div className="min-h-screen bg-[#dcf4a2]">
      <SiswaNavbar />
      <main>{children}</main>
    </div>
  )
}

export default SiswaLayout