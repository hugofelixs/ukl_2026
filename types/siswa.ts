export interface Siswa {
  id: number
  nama_siswa: string
  alamat?: string
  telp?: string
  foto?: string
  saldo?: number
  user?: {
    username: string
    role?: string
  }
  // ... properti lain jika ada
}