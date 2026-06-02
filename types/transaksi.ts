export type StatusPesanan = 'belum_dikonfirm' | 'dimasak' | 'diantar' | 'sampai'
export type StatusPembayaran = 'belum_bayar' | 'lunas'
export type MetodePembayaran = 'tunai' | 'saldo'

export interface DetailTransaksi {
  id: number
  id_menu: number
  qty: number
  harga_beli: number
  menu?: {
    nama_makanan: string
    foto?: string
    jenis?: string
  }
}

export interface Transaksi {
  id: number
  tanggal: string
  status: StatusPesanan
  status_pembayaran: StatusPembayaran
  metode_pembayaran: MetodePembayaran
  id_stan: number
  id_siswa: number
  stan?: {
    nama_stan: string
  }
  siswa?: {
    nama_siswa: string
    telp?: string
  }
  detail_transaksi?: DetailTransaksi[]
  total?: number
}

export interface RekapBulanan {
  bulan: number
  nama_bulan: string
  total_transaksi: number
  total_pemasukan: number
}

export interface RekapResponse {
  tahun: number
  rekap: RekapBulanan[]
}