// components/PengurusList.tsx (LENGKAP & UTUH)

import React, { useState, useEffect } from 'react';
import { User } from '../types';
import * as api from '../services/api';
import Modal from './Modal';
import PengurusForm from './PengurusForm';
import LoadingSpinner from './LoadingSpinner';

const PengurusList: React.FC = () => {
  const [pengurusList, setPengurusList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchPengurus = async () => {
    setIsLoading(true);
    try {
      const data = await api.getUsers();
      setPengurusList(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengurus();
  }, []);

  const handleSave = async (data: any) => {
    setFormLoading(true);
    setError(null);
    try {
      await api.createUser(data);
      setIsModalOpen(false);
      await fetchPengurus(); // Refresh list
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setFormLoading(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Data Pengurus</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700"
        >
          Tambah Pengurus
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nama Lengkap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Email (Username)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Peran</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {pengurusList.map(pengurus => (
              <tr key={pengurus.id}>
                <td className="px-6 py-4 whitespace-nowrap">{pengurus.namaLengkap}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pengurus.username}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{pengurus.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {pengurus.role !== 'ketua' && (
                    <>
                      <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button className="text-red-600 hover:text-red-900 ml-4">Hapus</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal title="Tambah Pengurus Baru" onClose={() => setIsModalOpen(false)}>
          <PengurusForm
            onSave={handleSave}
            onCancel={() => setIsModalOpen(false)}
            loading={formLoading}
          />
        </Modal>
      )}
    </div>
  );
};

export default PengurusList;