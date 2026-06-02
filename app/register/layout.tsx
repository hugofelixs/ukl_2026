export const metadata = {
  title: "Register | Kantin",
  description: "Halaman register untuk panel admin kantin sekolah",
}

type PropsLayout = {
  children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
  return (
    <div>
        {children}
    </div>
  )
}

export default RootLayout
