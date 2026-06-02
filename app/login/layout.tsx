export const metadata = {
  title: "Login | Kantin",
  description: "Halaman login untuk panel admin kantin sekolah",
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
