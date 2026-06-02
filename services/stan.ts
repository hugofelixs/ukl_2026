import axios from "axios"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import { Stan } from "@/types/stan"

type ResponseData<T> = {
  status: boolean
  message: string
  data?: T
}

export const GetMyProfile = async (): Promise<ResponseData<Stan>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.get(`${BASE_API_URL}/api/stan/admin/profile`, {
      headers: { authorization: `Bearer ${token}` },
    })
    return { status: true, message: "Berhasil", data: response.data }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return { status: false, message: "Gagal memuat profil" }
  }
}

export const UpdateMyProfile = async (data: {
  nama_stan?: string
  nama_pemilik?: string
  telp?: string
}): Promise<ResponseData<Stan>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.put(`${BASE_API_URL}/api/stan/admin/profile`, data, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    return { status: true, message: "Profil berhasil diperbarui", data: response.data }
  } catch (error) {
    console.error("Error update profile:", error)
    return { status: false, message: "Gagal memperbarui profil" }
  }
}