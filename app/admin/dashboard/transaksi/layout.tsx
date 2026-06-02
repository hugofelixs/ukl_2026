import AdminSidebar from "@/components/AdminSidebar"

export const metadata = {
  title: "Transaksi | Kantin Admin",
  description: "Panel admin kantin sekolah",
}

type PropsLayout = {
  children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
  return (
    <div>
      <AdminSidebar>
        {children}
      </AdminSidebar>
    </div>
  )
}

export default RootLayout