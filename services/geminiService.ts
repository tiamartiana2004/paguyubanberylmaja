// services/geminiService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Warga, Keluarga, Iuran } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
  } catch (error) {
    console.error("Failed to initialize GoogleGenerativeAI:", error);
  }
} else {
  console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
}

export const generatePopulationSummary = async (wargaList: Warga[], keluargaList: Keluarga[], iuranList: Iuran[]): Promise<string> => {
  if (!genAI) {
    return "Fitur AI tidak aktif karena kunci API tidak dikonfigurasi atau tidak valid.";
  }
  
  const model = 'gemini-1.5-flash'; // Menggunakan model terbaru yang efisien
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
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
      return `Terjadi kesalahan saat memanggil API: ${error.message}`;
    }
    return "Terjadi kesalahan yang tidak diketahui saat membuat ringkasan AI.";
  }
};