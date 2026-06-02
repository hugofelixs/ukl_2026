import axios from "axios"
import { getServerCookie } from "@/lib/server.cookie"
import { BASE_API_URL } from "@/global"
import { Transaksi, RekapResponse, StatusPesanan } from "@/types/transaksi"

type ResponseData<T> = {
  status: boolean
  message: string
  data?: T
}

// Admin — lihat semua pesanan masuk ke stan
export const GetAllTransaksiAdmin = async (
  bulan?: number,
  tahun?: number
): Promise<ResponseData<Transaksi[]>> => {
  try {
    const token = await getServerCookie("token")
    const params = new URLSearchParams()
    if (bulan) params.append("bulan", String(bulan))
    if (tahun) params.append("tahun", String(tahun))
    const response = await axios.get(
      `${BASE_API_URL}/api/transaksi/admin/all?${params}`,
      { headers: { authorization: `Bearer ${token}` } }
    )
    return { status: true, message: "Berhasil", data: response.data }
  } catch (error) {
    console.error("Error get transaksi admin:", error)
    return { status: false, message: "Gagal memuat transaksi" }
  }
}

// Admin — rekap pemasukan bulanan
export const GetRekapBulanan = async (
  tahun?: number
): Promise<ResponseData<RekapResponse>> => {
  try {
    const token = await getServerCookie("token")
    const params = tahun ? `?tahun=${tahun}` : ""
    const response = await axios.get(
      `${BASE_API_URL}/api/transaksi/admin/rekap${params}`,
      { headers: { authorization: `Bearer ${token}` } }
    )
    return { status: true, message: "Berhasil", data: response.data }
  } catch (error) {
    console.error("Error get rekap:", error)
    return { status: false, message: "Gagal memuat rekap" }
  }
}

// Admin — update status pesanan
export const UpdateStatusTransaksi = async (
  id: number,
  status: StatusPesanan
): Promise<ResponseData<Transaksi>> => {
  try {
    const token = await getServerCookie("token")
    const response = await axios.patch(
      `${BASE_API_URL}/api/transaksi/${id}/status`,
      { status },
      { headers: { authorization: `Bearer ${token}` } }
    )
    return { status: true, message: "Status berhasil diupdate", data: response.data }
  } catch (error) {
    console.error("Error update status:", error)
    return { status: false, message: "Gagal update status" }
  }
}