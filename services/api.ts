// services/api.ts
import { supabase } from './supabaseClient';
import { Warga, Keluarga, Iuran, User } from '../types';

// Helper untuk menangani error dari Supabase
const handleSupabaseError = ({ error, customMessage }: { error: any, customMessage: string }) => {
  if (error) {
    console.error(customMessage, error);
    throw new Error(`${customMessage} (Error: ${error.message})`);
  }
};

// --- Data Mapping Helpers ---
// Supabase menggunakan snake_case, aplikasi menggunakan camelCase.
// Kita perlu konversi agar komponen tidak perlu diubah.

const toKeluargaApp = (db: any): Keluarga => ({
  id: db.id,
  nomorKK: db.nomor_kk,
  kepalaKeluarga: db.kepala_keluarga,
  alamat: db.alamat,
  blok: db.blok,
  nomorRumah: db.nomor_rumah,
  rt: db.rt,
  rw: db.rw,
  statusHunian: db.status_hunian,
  telepon: db.telepon,
  created_at: db.created_at,
  updated_at: db.updated_at,
});

const toKeluargaDb = (app: any) => ({
  nomor_kk: app.nomorKK,
  kepala_keluarga: app.kepalaKeluarga,
  alamat: app.alamat,
  blok: app.blok,
  nomor_rumah: app.nomorRumah,
  rt: app.rt,
  rw: app.rw,
  status_hunian: app.statusHunian,
  telepon: app.telepon,
  updated_at: new Date().toISOString(), // Selalu update timestamp
});

const toWargaApp = (db: any): Warga => ({
  id: db.id,
  keluargaId: db.keluarga_id,
  nik: db.nik,
  namaLengkap: db.nama_lengkap,
  jenisKelamin: db.jenis_kelamin,
  tempatLahir: db.tempat_lahir,
  tanggalLahir: db.tanggal_lahir,
  agama: db.agama,
  pendidikan: db.pendidikan,
  pekerjaan: db.pekerjaan,
  statusPerkawinan: db.status_perkawinan,
  statusDalamKeluarga: db.status_dalam_keluarga,
  kewarganegaraan: db.kewarganegaraan,
  email: db.email,
  telepon: db.telepon,
  statusHidup: db.status_hidup,
  created_at: db.created_at,
  updated_at: db.updated_at,
});

const toWargaDb = (app: any) => ({
  keluarga_id: app.keluargaId,
  nik: app.nik,
  nama_lengkap: app.namaLengkap,
  jenis_kelamin: app.jenisKelamin,
  tempat_lahir: app.tempatLahir,
  tanggal_lahir: app.tanggalLahir,
  agama: app.agama,
  pendidikan: app.pendidikan,
  pekerjaan: app.pekerjaan,
  status_perkawinan: app.statusPerkawinan,
  status_dalam_keluarga: app.statusDalamKeluarga,
  kewarganegaraan: app.kewarganegaraan,
  email: app.email,
  telepon: app.telepon,
  status_hidup: app.statusHidup,
  updated_at: new Date().toISOString(),
});

const toIuranApp = (db: any): Iuran => ({
    id: db.id,
    keluargaId: db.keluarga_id,
    jenisIuran: db.jenis_iuran,
    periode: db.periode,
    jumlah: db.jumlah,
    statusBayar: db.status_bayar,
    tanggalBayar: db.tanggal_bayar,
    created_at: db.created_at,
    updated_at: db.updated_at,
});

const toIuranDb = (app: any) => ({
    keluarga_id: app.keluargaId,
    jenis_iuran: app.jenisIuran,
    periode: app.periode,
    jumlah: app.jumlah,
    status_bayar: app.statusBayar,
    tanggal_bayar: app.tanggalBayar,
    updated_at: new Date().toISOString(),
});

// --- Auth API (Tetap Mock, tapi disarankan pindah ke Supabase Auth) ---
const usersData: User[] = [
    { id: 1, username: 'ketua', namaLengkap: 'Ketua Paguyuban', role: 'ketua' },
    { id: 2, username: 'pengurus', namaLengkap: 'Pengurus Harian', role: 'pengurus' },
];
const userPasswords = { 'ketua': 'ketua123', 'pengurus': 'pengurus123' };

export const login = (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = usersData.find(u => u.username === username);
            if (user && userPasswords[username as keyof typeof userPasswords] === password) {
                resolve(user);
            } else {
                reject(new Error("Username atau password salah."));
            }
        }, 500);
    });
};

// --- Warga API ---
export const getWarga = async (): Promise<Warga[]> => {
    const { data, error } = await supabase.from('warga').select('*');
    handleSupabaseError({ error, customMessage: 'Gagal mengambil data warga.' });
    return data ? data.map(toWargaApp) : [];
};

export const createWarga = async (warga: Omit<Warga, 'id' | 'created_at' | 'updated_at'>): Promise<Warga> => {
    const { data, error } = await supabase.from('warga').insert(toWargaDb(warga)).select().single();
    handleSupabaseError({ error, customMessage: 'Gagal membuat data warga.' });
    return toWargaApp(data);
};

export const updateWarga = async (id: number, updates: Partial<Warga>): Promise<Warga> => {
    const { data, error } = await supabase.from('warga').update(toWargaDb(updates)).eq('id', id).select().single();
    handleSupabaseError({ error, customMessage: 'Gagal memperbarui data warga.' });
    return toWargaApp(data);
};

export const deleteWarga = async (id: number): Promise<{ id: number }> => {
    // Soft delete: set status_hidup to false
    const { error } = await supabase.from('warga').update({ status_hidup: false, updated_at: new Date().toISOString() }).eq('id', id);
    handleSupabaseError({ error, customMessage: 'Gagal menghapus data warga.' });
    return { id };
};

// --- Keluarga API ---
export const getKeluarga = async (): Promise<Keluarga[]> => {
    const { data, error } = await supabase.from('keluarga').select('*');
    handleSupabaseError({ error, customMessage: 'Gagal mengambil data keluarga.' });
    return data ? data.map(toKeluargaApp) : [];
};

export const createKeluarga = async (keluarga: Omit<Keluarga, 'id' | 'created_at' | 'updated_at'>): Promise<Keluarga> => {
    const { data, error } = await supabase.from('keluarga').insert(toKeluargaDb(keluarga)).select().single();
    handleSupabaseError({ error, customMessage: 'Gagal membuat data keluarga.' });
    return toKeluargaApp(data);
};

export const updateKeluarga = async (id: number, updates: Partial<Keluarga>): Promise<Keluarga> => {
    const { data, error } = await supabase.from('keluarga').update(toKeluargaDb(updates)).eq('id', id).select().single();
    handleSupabaseError({ error, customMessage: 'Gagal memperbarui data keluarga.' });
    return toKeluargaApp(data);
};

export const deleteKeluarga = async (id: number): Promise<{ id: number }> => {
    // Menggunakan RPC yang sudah dibuat di SQL
    const { error } = await supabase.rpc('delete_keluarga_safe', { keluarga_id_to_delete: id });
    handleSupabaseError({ error, customMessage: 'Gagal menghapus keluarga.' });
    return { id };
};

// --- Iuran API ---
export const getIuran = async (): Promise<Iuran[]> => {
    const { data, error } = await supabase.from('iuran').select('*');
    handleSupabaseError({ error, customMessage: 'Gagal mengambil data iuran.' });
    return data ? data.map(toIuranApp) : [];
};

export const createIuran = async (iuran: Omit<Iuran, 'id' | 'created_at' | 'updated_at'>): Promise<Iuran> => {
    const { data, error } = await supabase.from('iuran').insert(toIuranDb(iuran)).select().single();
    handleSupabaseError({ error, customMessage: 'Gagal membuat data iuran.' });
    return toIuranApp(data);
};

export const updateIuran = async (id: number, updates: Partial<Iuran>): Promise<Iuran> => {
    const { data, error } = await supabase.from('iuran').update(toIuranDb(updates)).eq('id', id).select().single();
    handleSupabaseError({ error, customMessage: 'Gagal memperbarui data iuran.' });
    return toIuranApp(data);
};

export const deleteIuran = async (id: number): Promise<{ id: number }> => {
    const { error } = await supabase.from('iuran').delete().eq('id', id);
    handleSupabaseError({ error, customMessage: 'Gagal menghapus data iuran.' });
    return { id };
};