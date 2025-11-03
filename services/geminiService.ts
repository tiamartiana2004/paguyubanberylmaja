// services/geminiService.ts

import { GoogleGenAI } from "@google/genai";
import { Warga, Keluarga, Iuran } from '../types';

// Menggunakan import.meta.env sesuai standar Vite untuk mengakses environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. AI features will be disabled.");
}

// Inisialisasi klien GenAI hanya jika API_KEY ada
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const generatePopulationSummary = async (wargaList: Warga[], keluargaList: Keluarga[], iuranList: Iuran[]): Promise<string> => {
  if (!ai) {
    return Promise.resolve("Fitur AI tidak aktif. Mohon konfigurasikan VITE_GEMINI_API_KEY di file .env.local Anda.");
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
    const response = await ai.models.generateContent({
      model: model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Terjadi kesalahan saat membuat ringkasan AI. Silakan coba lagi.";
  }
};