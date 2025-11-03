import React, { useMemo, useState } from 'react';
import { Iuran, Keluarga } from '../types';

interface PublicIuranProps {
  iuranList: Iuran[];
  keluargaList: Keluarga[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string }> = ({ title, value, icon, color }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);


const PublicIuran: React.FC<PublicIuranProps> = ({ iuranList, keluargaList }) => {
  const [selectedPeriode, setSelectedPeriode] = useState(new Date().toISOString().slice(0, 7));

  const { totalCollected, totalUnpaid, unpaidFamilies } = useMemo(() => {
    const iuranForPeriod = iuranList.filter(i => i.periode === selectedPeriode);
    const paidIuran = iuranForPeriod.filter(i => i.statusBayar);
    const totalCollected = paidIuran.reduce((sum, i) => sum + i.jumlah, 0);

    const allFamilyIds = new Set(keluargaList.map(k => k.id));
    const paidFamilyIds = new Set(paidIuran.map(i => i.keluargaId));

    const unpaidFamilyIds = new Set([...allFamilyIds].filter(id => !paidFamilyIds.has(id)));
    
    const unpaidFamilies = keluargaList.filter(k => unpaidFamilyIds.has(k.id));
    
    // Assuming a standard fee per family for the total unpaid calculation
    // This is a simplification. A real scenario might be more complex.
    const averageFee = 150000; // Example average fee
    const totalUnpaid = unpaidFamilies.length * averageFee;

    return { totalCollected, totalUnpaid, unpaidFamilies };
  }, [iuranList, keluargaList, selectedPeriode]);

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transparansi Iuran Warga</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Ringkasan status pembayaran iuran bulanan warga Cluster Beryl.</p>
        </div>
        
        <div className="flex justify-center">
            <div className="flex flex-col items-center">
                <label htmlFor="periode-filter" className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Pilih Periode Iuran:</label>
                <input
                    id="periode-filter"
                    type="month"
                    value={selectedPeriode}
                    onChange={e => setSelectedPeriode(e.target.value)}
                    className="p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard 
                title="Total Iuran Terkumpul" 
                value={new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(totalCollected)} 
                icon="✅"
                color="border-green-500"
            />
             <StatCard 
                title="Jumlah Keluarga Belum Lunas" 
                value={unpaidFamilies.length} 
                icon="❌"
                color="border-red-500"
            />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Daftar Keluarga Belum Lunas (Periode {selectedPeriode})</h2>
            {unpaidFamilies.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {unpaidFamilies.map(keluarga => (
                        <li key={keluarga.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{keluarga.kepalaKeluarga}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{`Blok ${keluarga.blok} No. ${keluarga.nomorRumah}`}</p>
                            </div>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">Belum Lunas</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">Luar biasa! Semua iuran untuk periode ini sudah lunas.</p>
            )}
        </div>
    </div>
  );
};

export default PublicIuran;
