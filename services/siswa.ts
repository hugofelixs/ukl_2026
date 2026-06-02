import axios from "axios"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import { Siswa } from "@/types/siswa"

type ResponseData<T> = {
  status: boolean
  message: string
  data?: T
}

export const GetMyProfile = async (): Promise<ResponseData<Siswa>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.get(`${BASE_API_URL}/api/siswa/profile`, {
      headers: { authorization: `Bearer ${token}` },
    })
    return {
      status: true,
      message: "Profil berhasil dimuat",
      data: response.data,
    }
  } catch (error) {
    console.error("Error get profile:", error)
    return { status: false, message: "Gagal memuat profil" }
  }
}

export const UpdateMyProfile = async (formData: FormData): Promise<ResponseData<Siswa>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.put(`${BASE_API_URL}/api/siswa/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    return {
      status: true,
      message: "Profil berhasil diperbarui",
      data: response.data,
    }
  } catch (error) {
    console.error("Error update profile:", error)
    return { status: false, message: "Gagal memperbarui profil" }
  }
}