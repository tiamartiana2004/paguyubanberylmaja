// components/PengurusList.tsx

import React from 'react';
import { User } from '../types';

// Di aplikasi nyata, props ini akan berisi fungsi untuk CRUD (Create, Read, Update, Delete)
interface PengurusListProps {
  // Untuk saat ini, kita akan tampilkan data statis saja
}

// Data mock untuk simulasi
const mockPengurus: User[] = [
    { id: 1, username: 'ketua', namaLengkap: 'Ketua Paguyuban', role: 'ketua' },
    { id: 2, username: 'pengurus', namaLengkap: 'Pengurus Harian', role: 'pengurus' },
    { id: 3, username: 'bendahara', namaLengkap: 'Bendahara RW', role: 'pengurus' },
];

const PengurusList: React.FC<PengurusListProps> = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Data Pengurus</h1>
        <button
          onClick={() => alert('Fitur Tambah Pengurus akan diimplementasikan dengan Supabase Auth.')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Tambah Pengurus
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Peran</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {mockPengurus.map(pengurus => (
              <tr key={pengurus.id}>
                <td className="px-6 py-4 whitespace-nowrap">{pengurus.namaLengkap}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pengurus.username}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{pengurus.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {pengurus.role !== 'ketua' && (
                    <>
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 ml-4">Hapus</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PengurusList;