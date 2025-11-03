import React, { useState, useMemo, useContext } from 'react';
import { Keluarga } from '../types';
import KeluargaForm from './KeluargaForm';
import Modal from './Modal';
import { AuthContext } from '../contexts/AuthContext';

interface KeluargaListProps {
  keluargaList: Keluarga[];
  onUpdate: (keluarga: Keluarga) => void;
  onDelete: (id: number) => void;
}

const KeluargaList: React.FC<KeluargaListProps> = ({ keluargaList, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKeluarga, setEditingKeluarga] = useState<Keluarga | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  const filteredKeluarga = useMemo(() => {
    return keluargaList.filter(keluarga =>
      keluarga.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
      keluarga.nomorKK.includes(searchTerm)
    );
  }, [keluargaList, searchTerm]);

  const handleOpenModal = (keluarga: Keluarga | null = null) => {
    setEditingKeluarga(keluarga);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKeluarga(null);
  };

  const handleSave = (keluargaData: Omit<Keluarga, 'id' | 'createdAt' | 'updatedAt'> | Keluarga) => {
    if ('id' in keluargaData) {
      onUpdate(keluargaData);
    } 
    handleCloseModal();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Data Keluarga</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Cari Kepala Keluarga atau No. KK..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">No. KK</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kepala Keluarga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Alamat</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">RT/RW</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredKeluarga.map(keluarga => (
              <tr key={keluarga.id}>
                <td className="px-6 py-4 whitespace-nowrap">{keluarga.nomorKK}</td>
                <td className="px-6 py-4 whitespace-nowrap">{keluarga.kepalaKeluarga}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${keluarga.alamat} Blok ${keluarga.blok} No. ${keluarga.nomorRumah}`}</td>
                <td className="px-6 py-4 whitespace-nowrap">{`${keluarga.rt}/${keluarga.rw}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user?.role === 'ketua' && (
                    <>
                    <button onClick={() => handleOpenModal(keluarga)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                    <button onClick={() => onDelete(keluarga.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 ml-4">Hapus</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal title={editingKeluarga ? 'Edit Data Keluarga' : 'Tambah Data Keluarga'} onClose={handleCloseModal}>
          <KeluargaForm
            keluargaToEdit={editingKeluarga}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default KeluargaList;