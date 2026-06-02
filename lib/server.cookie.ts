import { cookies } from "next/headers"

export const getServerCookie = async (name: string): Promise<string | undefined> => {
  const cookieStore = await cookies()
  return cookieStore.get(name)?.value
}

export const setServerCookie = async (name: string, value: string) => {
  const cookieStore = await cookies()
  cookieStore.set(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: "/",
  })
}

export const deleteServerCookie = async (name: string) => {
  const cookieStore = await cookies()
  cookieStore.delete(name)
}
