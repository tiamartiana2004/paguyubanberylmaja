
import React, { useState, useEffect } from 'react';
import { Iuran, Keluarga } from '../types';

interface IuranFormProps {
  iuranToEdit?: Iuran | null;
  keluargaList: Keluarga[];
  onSave: (iuran: Omit<Iuran, 'id' | 'createdAt' | 'updatedAt'> | Iuran) => void;
  onCancel: () => void;
}

const IuranForm: React.FC<IuranFormProps> = ({ iuranToEdit, keluargaList, onSave, onCancel }) => {
  const initialFormState: Omit<Iuran, 'id' | 'createdAt' | 'updatedAt'> = {
    keluargaId: 0,
    jenisIuran: 'Keamanan',
    periode: new Date().toISOString().slice(0, 7),
    jumlah: 0,
    statusBayar: false,
    tanggalBayar: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (iuranToEdit) {
      setFormData({
        ...iuranToEdit,
        tanggalBayar: iuranToEdit.tanggalBayar ? iuranToEdit.tanggalBayar.slice(0, 10) : ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [iuranToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ 
            ...prev, 
            statusBayar: checked,
            tanggalBayar: checked ? new Date().toISOString().slice(0, 10) : ''
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: name === 'keluargaId' || name === 'jumlah' ? Number(value) : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.keluargaId === 0) {
        alert("Pilih Kartu Keluarga terlebih dahulu.");
        return;
    }
    
    const dataToSave = {
        ...formData,
        tanggalBayar: formData.statusBayar && formData.tanggalBayar ? new Date(formData.tanggalBayar).toISOString() : undefined
    };

    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keluarga</label>
                <select name="keluargaId" value={formData.keluargaId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value={0}>Pilih KK</option>
                    {keluargaList.map(kk => (
                        <option key={kk.id} value={kk.id}>{kk.nomorKK} - {kk.kepalaKeluarga}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Iuran</label>
                <select name="jenisIuran" value={formData.jenisIuran} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                    <option>Keamanan</option>
                    <option>Kebersihan</option>
                    <option>Sosial</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Periode</label>
                <input type="month" name="periode" value={formData.periode} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah (Rp)</label>
                <input type="number" name="jumlah" value={formData.jumlah} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div className="md:col-span-2 flex items-center space-x-4">
                 <div className="flex items-center h-5">
                    <input id="statusBayar" name="statusBayar" type="checkbox" checked={formData.statusBayar} onChange={handleChange} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                 </div>
                 <div className="text-sm">
                    <label htmlFor="statusBayar" className="font-medium text-gray-700 dark:text-gray-300">Sudah Dibayar</label>
                 </div>
                 {formData.statusBayar && (
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Bayar</label>
                        <input type="date" name="tanggalBayar" value={formData.tanggalBayar} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
                    </div>
                 )}
            </div>
        </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Batal</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Simpan</button>
      </div>
    </form>
  );
};

export default IuranForm;
