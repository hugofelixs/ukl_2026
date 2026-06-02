export type JenisMenu = 'makanan' | 'minuman'

export interface Menu {
  id: number
  nama_makanan: string
  harga: number
  jenis: JenisMenu
  deskripsi?: string
  foto?: string
  id_stan: number
  stan?: {
    nama_stan: string
  }
  menu_diskon?: MenuDiskon[]
}

export interface MenuDiskon {
  id: number
  id_menu: number
  id_diskon: number
  diskon: {
    id: number
    nama_diskon: string
    persentase_diskon: number
    tanggal_awal: string
    tanggal_akhir: string
  }
}