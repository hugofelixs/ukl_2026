import AdminSidebar from "@/components/AdminSidebar"

export const metadata = {
  title: "Kelola Diskon | Admin Stan TrayUp!",
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