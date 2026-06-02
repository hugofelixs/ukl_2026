import axios from "axios"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import { Diskon } from "@/types/diskon"

type ResponseData<T> = {
  status: boolean
  message: string
  data?: T
}

export const GetDiskon = async (): Promise<ResponseData<Diskon[]>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.get(`${BASE_API_URL}/api/diskon`, {
      headers: { authorization: `Bearer ${token}` },
    })
    return { status: true, message: "Berhasil", data: response.data }
  } catch (error) {
    console.error("Error fetching diskon:", error)
    return { status: false, message: "Gagal memuat diskon" }
  }
}

export const TambahDiskon = async (data: {
  nama_diskon: string
  persentase_diskon: number
  tanggal_awal: string
  tanggal_akhir: string
  id_menu?: number[]
}): Promise<ResponseData<Diskon>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.post(`${BASE_API_URL}/api/diskon`, data, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    return { status: true, message: "Diskon berhasil ditambahkan", data: response.data }
  } catch (error) {
    console.error("Error tambah diskon:", error)
    return { status: false, message: "Gagal menambahkan diskon" }
  }
}

export const EditDiskon = async (
  id: number,
  data: {
    nama_diskon?: string
    persentase_diskon?: number
    tanggal_awal?: string
    tanggal_akhir?: string
    id_menu?: number[]
  }
): Promise<ResponseData<Diskon>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.put(`${BASE_API_URL}/api/diskon/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
    return { status: true, message: "Diskon berhasil diperbarui", data: response.data }
  } catch (error) {
    console.error("Error edit diskon:", error)
    return { status: false, message: "Gagal memperbarui diskon" }
  }
}

export const HapusDiskon = async (id: number): Promise<ResponseData<null>> => {
  try {
    const token = await getServerCookie("token")
    await axios.delete(`${BASE_API_URL}/api/diskon/${id}`, {
      headers: { authorization: `Bearer ${token}` },
    })
    return { status: true, message: "Diskon berhasil dihapus" }
  } catch (error) {
    console.error("Error hapus diskon:", error)
    return { status: false, message: "Gagal menghapus diskon" }
  }
}