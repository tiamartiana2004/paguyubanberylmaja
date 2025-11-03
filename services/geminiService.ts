// services/geminiService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Warga, Keluarga, Iuran } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
} else {
  console.warn("VITE_GEMINI_API_KEY tidak ditemukan di environment variables. Fitur AI akan dinonaktifkan.");
}

export const generatePopulationSummary = async (wargaList: Warga[], keluargaList: Keluarga[], iuranList: Iuran[]): Promise<string> => {
  if (!genAI) {
    return Promise.resolve("Fitur AI tidak aktif. Mohon konfigurasikan VITE_GEMINI_API_KEY di pengaturan deployment Anda.");
  }
  
  // FIX: Menggunakan nama model yang lebih stabil 'gemini-1.5-flash'
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const currentPeriod = new Date().toISOString().slice(0, 7);

  const prompt = `
    Anda adalah seorang analis data profesional yang bertugas membuat laporan untuk komite "Paguyuban Cluster Beryl".
    Berdasarkan data JSON mentah berikut, buatlah sebuah laporan eksekutif yang ringkas, profesional, dan mudah dibaca dalam format Markdown.

    Data Warga:
    ${JSON.stringify(wargaList.filter(w => w.statusHidup), null, 2)}

    Data Keluarga:
    ${JSON.stringify(keluargaList, null, 2)}
    
    Data Iuran (Periode ${currentPeriod}):
    ${JSON.stringify(iuranList.filter(i => i.periode === currentPeriod), null, 2)}

    Struktur laporan harus mengikuti format berikut:
    
    ## Laporan Eksekutif Paguyuban Cluster Beryl

    ### Ringkasan Umum
    *   **Total Warga Aktif**: [Jumlah]
    *   **Total Kepala Keluarga**: [Jumlah]
    *   **Rata-rata Anggota per Keluarga**: [Angka]

    ### Analisis Demografi
    *   **Komposisi Jenis Kelamin**: [Jumlah] Laki-laki ([Persentase]%) dan [Jumlah] Perempuan ([Persentase]%).
    *   **Status Kepemilikan Hunian**: [Jumlah] Pemilik, [Jumlah] Sewa, dan [Jumlah] Kontrak.
    
    ### Status Keuangan - Iuran Bulan Ini
    *   **Total Iuran Lunas**: [Jumlah] transaksi.
    *   **Total Iuran Belum Lunas**: [Jumlah] transaksi.

    ### Kesimpulan
    Berikan satu atau dua kalimat kesimpulan yang tajam mengenai kondisi demografi dan keuangan saat ini.

    Pastikan untuk menggunakan heading (##, ###), bold (**teks**), dan bullet points (* Poin) untuk keterbacaan maksimal.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error("Error saat memanggil Gemini API:", error);
    let errorMessage = "Terjadi kesalahan saat membuat ringkasan AI. Silakan coba lagi.";
    if (error.message) {
      if (error.message.includes('API key not valid')) {
        errorMessage = "Error dari AI: Kunci API tidak valid. Periksa kembali VITE_GEMINI_API_KEY Anda.";
      } else if (error.message.includes('billing')) {
         errorMessage = "Error dari AI: Masalah penagihan (billing) pada akun Google Cloud Anda. Pastikan billing sudah aktif.";
      } else if (error.message.includes('404')) {
         errorMessage = `Error dari AI: Model tidak ditemukan. Coba periksa nama model di kode.`;
      }
      else {
         errorMessage = `Error dari AI: ${error.message}`;
      }
    }
    return errorMessage;
  }
};