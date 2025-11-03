import React, { useState } from 'react';
import { Keluarga, Warga } from '../types';
import KeluargaForm from './KeluargaForm';
import WargaForm from './WargaForm';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

type WargaFormData = Omit<Warga, 'id' | 'keluargaId' | 'createdAt' | 'updatedAt'>;

interface RegistrationProps {
  onCreateKeluarga: (keluarga: Omit<Keluarga, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Keluarga | null>;
  onCreateWarga: (warga: Omit<Warga, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onRegistrationSuccess: () => void;
}

const Registration: React.FC<RegistrationProps> = ({ onCreateKeluarga, onCreateWarga, onRegistrationSuccess }) => {
  const [keluargaData, setKeluargaData] = useState<Omit<Keluarga, 'id' | 'createdAt' | 'updatedAt'> | null>(null);
  const [wargaList, setWargaList] = useState<WargaFormData[]>([]);
  const [isWargaModalOpen, setWargaModalOpen] = useState(false);
  const [editingWargaIndex, setEditingWargaIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleKeluargaSave = (data: Omit<Keluarga, 'id' | 'createdAt' | 'updatedAt'>) => {
    setKeluargaData(data);
  };

  const handleWargaSave = (warga: WargaFormData) => {
    if (editingWargaIndex !== null) {
      setWargaList(wargaList.map((w, index) => index === editingWargaIndex ? warga : w));
    } else {
      setWargaList([...wargaList, warga]);
    }
    closeWargaModal();
  };
  
  const openWargaModal = (index: number | null = null) => {
    setEditingWargaIndex(index);
    setWargaModalOpen(true);
  };

  const closeWargaModal = () => {
    setEditingWargaIndex(null);
    setWargaModalOpen(false);
  };
  
  const removeWarga = (indexToRemove: number) => {
    setWargaList(wargaList.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!keluargaData) {
      setError("Data keluarga belum lengkap. Mohon simpan data keluarga terlebih dahulu.");
      return;
    }
    if (wargaList.length === 0) {
      setError("Minimal harus ada satu anggota keluarga yang didaftarkan.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newKeluarga = await onCreateKeluarga(keluargaData);
      if (!newKeluarga || !newKeluarga.id) {
        throw new Error("Gagal membuat data keluarga di server.");
      }

      const wargaCreationPromises = wargaList.map(warga => 
        onCreateWarga({ ...warga, keluargaId: newKeluarga.id })
      );
      
      await Promise.all(wargaCreationPromises);
      
      onRegistrationSuccess();
      setSuccess(true);

    } catch (err) {
      const errorMessage = (err as Error).message || 'Terjadi kesalahan saat pendaftaran.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pendaftaran Berhasil!</h2>
            <p className="text-gray-600 dark:text-gray-300">Terima kasih, data keluarga Anda telah berhasil dikirimkan.</p>
             <button onClick={() => { setSuccess(false); setKeluargaData(null); setWargaList([]); }} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Daftarkan Keluarga Lain
            </button>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pendaftaran Mandiri Warga</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Silakan isi data keluarga dan anggota keluarga Anda secara lengkap.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Langkah 1: Data Kartu Keluarga</h2>
        </div>
        <div className="p-6">
            <KeluargaForm onSave={handleKeluargaSave} onCancel={() => {}} keluargaToEdit={keluargaData as Keluarga}/>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
         <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Langkah 2: Data Anggota Keluarga</h2>
            <button onClick={() => openWargaModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm">
                + Tambah Anggota
            </button>
        </div>
        <div className="p-6">
            {wargaList.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Belum ada anggota keluarga yang ditambahkan.</p>
            ) : (
                <ul className="space-y-3">
                    {wargaList.map((warga, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{warga.namaLengkap}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{warga.nik} - {warga.statusDalamKeluarga}</p>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => openWargaModal(index)} className="text-sm text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                                <button onClick={() => removeWarga(index)} className="text-sm text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Hapus</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded text-center">
            {error}
        </div>
      )}

      <div className="flex justify-center">
        <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center space-x-2 transition-transform transform hover:scale-105"
        >
            {isSubmitting && <LoadingSpinner />}
            <span>Kirim Data Pendaftaran</span>
        </button>
      </div>

      {isWargaModalOpen && (
        <Modal title={editingWargaIndex !== null ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'} onClose={closeWargaModal}>
          <WargaForm
            wargaToEdit={editingWargaIndex !== null ? wargaList[editingWargaIndex] as Warga : null}
            keluargaList={[]} // Not needed for registration flow
            onSave={(w) => handleWargaSave(w as WargaFormData)}
            onCancel={closeWargaModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default Registration;