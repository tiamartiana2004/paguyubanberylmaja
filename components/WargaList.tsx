import React, { useState, useMemo, useContext } from 'react';
import { Warga, Keluarga } from '../types';
import WargaForm from './WargaForm';
import Modal from './Modal';
import { AuthContext } from '../contexts/AuthContext';

interface WargaListProps {
  wargaList: Warga[];
  keluargaList: Keluarga[];
  onCreate: (warga: Omit<Warga, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (warga: Warga) => void;
  onDelete: (id: number) => void;
}

const WargaList: React.FC<WargaListProps> = ({ wargaList, keluargaList, onCreate, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarga, setEditingWarga] = useState<Warga | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  const filteredWarga = useMemo(() => {
    return wargaList.filter(warga =>
      warga.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warga.nik.includes(searchTerm)
    );
  }, [wargaList, searchTerm]);

  const handleOpenModal = (warga: Warga | null = null) => {
    setEditingWarga(warga);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWarga(null);
  };

  const handleSave = (wargaData: Omit<Warga, 'id' | 'createdAt' | 'updatedAt'> | Warga) => {
    if ('id' in wargaData) {
      onUpdate(wargaData);
    } else {
      onCreate(wargaData);
    }
    handleCloseModal();
  };
  
  const getKeluargaInfo = (keluargaId: number) => {
    const keluarga = keluargaList.find(k => k.id === keluargaId);
    return keluarga ? `${keluarga.nomorKK} - ${keluarga.kepalaKeluarga}` : 'N/A';
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Data Warga</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
            <input
                type="text"
                placeholder="Cari nama atau NIK..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
            {user?.role === 'ketua' && (
              <button
                  onClick={() => handleOpenModal()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                  Tambah Warga
              </button>
            )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Lengkap</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">NIK</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Keluarga</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredWarga.map(warga => (
              <tr key={warga.id}>
                <td className="px-6 py-4 whitespace-nowrap">{warga.namaLengkap}</td>
                <td className="px-6 py-4 whitespace-nowrap">{warga.nik}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getKeluargaInfo(warga.keluargaId)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${warga.statusHidup ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {warga.statusHidup ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {user?.role === 'ketua' && (
                    <>
                      <button onClick={() => handleOpenModal(warga)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                      <button onClick={() => onDelete(warga.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 ml-4">Hapus</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal title={editingWarga ? 'Edit Warga' : 'Tambah Warga'} onClose={handleCloseModal}>
          <WargaForm
            wargaToEdit={editingWarga}
            keluargaList={keluargaList}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default WargaList;