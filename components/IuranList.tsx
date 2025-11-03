import React, { useState, useMemo, useContext } from 'react';
import { Iuran, Keluarga } from '../types';
import IuranForm from './IuranForm';
import Modal from './Modal';
import { AuthContext } from '../contexts/AuthContext';

interface IuranListProps {
  iuranList: Iuran[];
  keluargaList: Keluarga[];
  onCreate: (iuran: Omit<Iuran, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (iuran: Iuran) => void;
  onDelete: (id: number) => void;
}

const IuranList: React.FC<IuranListProps> = ({ iuranList, keluargaList, onCreate, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIuran, setEditingIuran] = useState<Iuran | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriode, setFilterPeriode] = useState<string>(new Date().toISOString().slice(0, 7));
  const { user } = useContext(AuthContext);

  const keluargaMap = useMemo(() => 
    new Map(keluargaList.map(k => [k.id, k])), 
  [keluargaList]);

  const filteredIuran = useMemo(() => {
    return iuranList.filter(iuran => {
      const keluarga = keluargaMap.get(iuran.keluargaId);
      const searchTermMatch = keluarga ? 
        keluarga.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()) || 
        keluarga.nomorKK.includes(searchTerm) : false;
      
      const periodeMatch = filterPeriode ? iuran.periode === filterPeriode : true;
      
      return searchTermMatch && periodeMatch;
    });
  }, [iuranList, searchTerm, filterPeriode, keluargaMap]);
  
  const handleOpenModal = (iuran: Iuran | null = null) => {
    setEditingIuran(iuran);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIuran(null);
  };

  const handleSave = (iuranData: Omit<Iuran, 'id' | 'createdAt' | 'updatedAt'> | Iuran) => {
    if ('id' in iuranData) {
      onUpdate(iuranData);
    } else {
      onCreate(iuranData);
    }
    handleCloseModal();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manajemen Data Iuran</h1>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <input
            type="month"
            value={filterPeriode}
            onChange={e => setFilterPeriode(e.target.value)}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
          />
          <input
            type="text"
            placeholder="Cari KK..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="p-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
          />
          {user && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Tambah Iuran
            </button>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Keluarga (No. KK)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jenis Iuran</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jumlah</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredIuran.map(iuran => {
                const keluarga = keluargaMap.get(iuran.keluargaId);
                return (
                  <tr key={iuran.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{keluarga ? `${keluarga.kepalaKeluarga} (${keluarga.nomorKK})` : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{iuran.jenisIuran}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(iuran.jumlah)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${iuran.statusBayar ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {iuran.statusBayar ? 'Lunas' : 'Belum Lunas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {user && (
                         <button onClick={() => handleOpenModal(iuran)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200">Edit</button>
                      )}
                      {user?.role === 'ketua' && (
                        <button onClick={() => onDelete(iuran.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 ml-4">Hapus</button>
                      )}
                    </td>
                  </tr>
                )
            })}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <Modal title={editingIuran ? 'Edit Iuran' : 'Tambah Iuran'} onClose={handleCloseModal}>
          <IuranForm
            iuranToEdit={editingIuran}
            keluargaList={keluargaList}
            onSave={handleSave}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default IuranList;