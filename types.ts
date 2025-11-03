// types.ts

export interface Keluarga {
  id: number;
  nomorKK: string;
  kepalaKeluarga: string;
  alamat: string;
  blok: string;
  nomorRumah: string;
  rt: string;
  rw: string;
  statusHunian: string;
  telepon?: string;
  created_at: string;
  updated_at: string;
}

export interface Warga {
  id: number;
  keluargaId: number;
  nik: string;
  namaLengkap: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir?: string;
  tanggalLahir: string; // Made mandatory for age calculation
  agama?: string;
  pendidikan?: string;
  pekerjaan: string; // Made mandatory for dashboard stats
  statusPerkawinan?: string;
  statusDalamKeluarga?: string;
  kewarganegaraan?: string;
  email?: string;
  telepon?: string;
  statusHidup: boolean;
  created_at: string;
  updated_at: string;
}

export interface Iuran {
  id: number;
  keluargaId: number;
  jenisIuran: string;
  periode: string; // Format: YYYY-MM
  jumlah: number;
  statusBayar: boolean;
  tanggalBayar?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  username: string;
  namaLengkap: string;
  role: 'ketua' | 'pengurus';
}

export enum View {
  // Public views
  PUBLIC_DASHBOARD = 'PUBLIC_DASHBOARD',
  REGISTER = 'REGISTER',
  PUBLIC_WARGA = 'PUBLIC_WARGA',
  PUBLIC_IURAN = 'PUBLIC_IURAN',

  // Auth view
  LOGIN = 'LOGIN',

  // Admin views
  WARGA = 'WARGA',
  KELUARGA = 'KELUARGA',
  IURAN = 'IURAN',
}