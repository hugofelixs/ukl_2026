import axios from "axios"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import { Menu } from "@/types/menu"

type ResponseData = {
  status: boolean
  message: string
  data?: Menu | Menu[]
}

export const GetMenu = async (id_stan?: number): Promise<ResponseData> => {
  try {
    const token = await getServerCookie("token")
    const url = id_stan
      ? `${BASE_API_URL}/api/menu?id_stan=${id_stan}`
      : `${BASE_API_URL}/api/menu`
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    return {
      status: true,
      message: "Menu berhasil dimuat",
      data: response.data,
    }
  } catch (error) {
    console.error("Error fetching menu:", error)
    return { status: false, message: "Gagal memuat menu" }
  }
}

export const TambahMenu = async (formData: FormData): Promise<ResponseData> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.post(`${BASE_API_URL}/api/menu`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    return {
      status: true,
      message: "Menu berhasil ditambahkan",
      data: response.data,
    }
  } catch (error) {
    console.error("Error tambah menu:", error)
    return { status: false, message: "Gagal menambahkan menu" }
  }
}

export const EditMenu = async (id: number, formData: FormData): Promise<ResponseData> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.put(`${BASE_API_URL}/api/menu/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
    return {
      status: true,
      message: "Menu berhasil diperbarui",
      data: response.data,
    }
  } catch (error) {
    console.error("Error edit menu:", error)
    return { status: false, message: "Gagal memperbarui menu" }
  }
}

export const HapusMenu = async (id: number): Promise<ResponseData> => {
  try {
    const token = await getServerCookie("token")
    await axios.delete(`${BASE_API_URL}/api/menu/${id}`, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    return { status: true, message: "Menu berhasil dihapus" }
  } catch (error) {
    console.error("Error hapus menu:", error)
    return { status: false, message: "Gagal menghapus menu" }
  }
}