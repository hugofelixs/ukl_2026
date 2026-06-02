export interface Diskon {
  id: number
  nama_diskon: string
  persentase_diskon: number
  tanggal_awal: string
  tanggal_akhir: string
  menu_diskon?: {
    id: number
    id_menu: number
    menu?: {
      id: number
      nama_makanan: string
    }
  }[]
}