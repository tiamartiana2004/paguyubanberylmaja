// components/Dashboard.tsx

import React, { useState, useMemo } from 'react';
import { Warga, Keluarga, Iuran } from '../types';
import { generatePopulationSummary } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import MarkdownRenderer from './MarkdownRenderer';

interface DashboardProps {
  wargaList: Warga[];
  keluargaList: Keluarga[];
  iuranList: Iuran[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: string }> = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);

const calculateAge = (birthDateString: string): number => {
    // FIX: Add guards for invalid or missing birthDateString to prevent NaN results from arithmetic operations.
    if (!birthDateString) {
        return 0;
    }
    const birthDate = new Date(birthDateString);
    if (isNaN(birthDate.getTime())) {
        return 0;
    }
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const BarChart: React.FC<{ title: string; data: { label: string; value: number; color: string }[] }> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
            <div className="space-y-3">
                {data.length > 0 ? data.map(item => (
                    <div key={item.label} className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-28 truncate">{item.label}</span>
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                            <div
                                className={`${item.color} h-6 rounded-full flex items-center justify-start pl-2`}
                                style={{ width: `${(item.value / maxValue) * 100}%` }}
                            >
                               <span className="text-white text-sm font-bold">{item.value}</span>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-sm text-gray-500 dark:text-gray-400">Tidak ada data untuk ditampilkan.</p>}
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ wargaList, keluargaList, iuranList }) => {
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const activeWarga = useMemo(() => wargaList.filter(w => w.statusHidup), [wargaList]);
  
  const { ageChartData, occupationChartData, iuranChartData, totalIuranCountThisMonth, newFamilies, newWargaCount } = useMemo(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const newFamilies = keluargaList.filter(k => new Date(k.created_at) >= threeDaysAgo);
    const newWargaCount = activeWarga.filter(w => new Date(w.created_at) >= threeDaysAgo).length;

    // Age group data
    const ageGroups = {
        'Anak (0-17)': activeWarga.filter(w => calculateAge(w.tanggalLahir) <= 17).length,
        'Dewasa (18-60)': activeWarga.filter(w => { const age = calculateAge(w.tanggalLahir); return age >= 18 && age <= 60; }).length,
        'Lansia (>60)': activeWarga.filter(w => calculateAge(w.tanggalLahir) > 60).length,
    };
    const ageChartData = Object.entries(ageGroups).map(([label, value], i) => ({ label, value, color: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500'][i] }));

    // Occupation data
    const occupations = activeWarga.reduce<Record<string, number>>((acc, warga) => {
        const job = warga.pekerjaan || 'Lainnya';
        acc[job] = (acc[job] || 0) + 1;
        return acc;
    }, {});
    
    // Fix: Use array destructuring in the sort callback to ensure correct type inference for numeric values.
    const occupationChartData = Object.entries(occupations).sort(([, countA], [, countB]) => countB - countA).slice(0, 5)
      .map(([label, value], i) => ({ label, value, color: ['bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500'][i] }));

    // Iuran data for current month
    const currentPeriod = new Date().toISOString().slice(0, 7);
    const currentIuran = iuranList.filter(i => i.periode === currentPeriod);
    const iuranStatus = {
        'Lunas': currentIuran.filter(i => i.statusBayar).length,
        'Belum Lunas': currentIuran.filter(i => !i.statusBayar).length,
    };
    const iuranChartData = Object.entries(iuranStatus).map(([label, value], i) => ({ label, value, color: ['bg-green-500', 'bg-red-500'][i] }));
    
    return { ageChartData, occupationChartData, iuranChartData, totalIuranCountThisMonth: currentIuran.length, newFamilies, newWargaCount };
  }, [activeWarga, iuranList, keluargaList]);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setAiSummary('');
    const summary = await generatePopulationSummary(wargaList, keluargaList, iuranList);
    setAiSummary(summary);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Paguyuban</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Ringkasan data kependudukan dan iuran Cluster Beryl.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Warga Aktif" value={activeWarga.length} icon="👥" />
        <StatCard title="Total Kartu Keluarga" value={keluargaList.length} icon="🏠" />
        <StatCard title="Warga Baru (3 Hari)" value={newWargaCount} icon="👋" />
        <StatCard title="Total Iuran Bulan Ini" value={totalIuranCountThisMonth} icon="💰" />
      </div>

      {newFamilies.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Selamat Datang Warga Baru!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {newFamilies.map(family => (
                      <div key={family.id} className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg border border-green-200 dark:border-green-800 transition-transform hover:scale-105">
                          <p className="font-semibold text-green-800 dark:text-green-200">Keluarga {family.kepalaKeluarga}</p>
                          <p className="text-sm text-green-700 dark:text-green-300">{`Blok ${family.blok} No. ${family.nomorRumah}`}</p>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BarChart title="Kelompok Usia" data={ageChartData} />
          <BarChart title="Status Iuran Bulan Ini" data={iuranChartData} />
          <BarChart title="Top 5 Pekerjaan" data={occupationChartData} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan AI</h2>
            <button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
                {isGenerating ? <LoadingSpinner /> : '✨'}
                <span>{isGenerating ? 'Membuat...' : 'Buat Laporan'}</span>
            </button>
        </div>
        
        {isGenerating && (
            <div className="text-center py-8"><p className="text-gray-600 dark:text-gray-300">AI sedang menganalisis data untuk membuat laporan...</p></div>
        )}

        {aiSummary && (
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <MarkdownRenderer content={aiSummary} />
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;