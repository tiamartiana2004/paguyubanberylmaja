
import React, { useState, useEffect } from 'react';
import { Keluarga } from '../types';

interface KeluargaFormProps {
  keluargaToEdit?: Keluarga | null;
  onSave: (keluarga: Omit<Keluarga, 'id' | 'createdAt' | 'updatedAt'> | Keluarga) => void;
  onCancel: () => void;
}

const KeluargaForm: React.FC<KeluargaFormProps> = ({ keluargaToEdit, onSave, onCancel }) => {
  const initialFormState: Omit<Keluarga, 'id' | 'createdAt' | 'updatedAt'> = {
    nomorKK: '',
    kepalaKeluarga: '',
    alamat: '',
    blok: '',
    nomorRumah: '',
    rt: '',
    rw: '',
    statusHunian: 'Pemilik',
    telepon: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (keluargaToEdit) {
      setFormData(keluargaToEdit);
    } else {
      setFormData(initialFormState);
    }
  }, [keluargaToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor KK</label>
          <input type="text" name="nomorKK" value={formData.nomorKK} onChange={handleChange} required maxLength={16} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kepala Keluarga</label>
          <input type="text" name="kepalaKeluarga" value={formData.kepalaKeluarga} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alamat</label>
          <input type="text" name="alamat" value={formData.alamat} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Blok</label>
          <input type="text" name="blok" value={formData.blok} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nomor Rumah</label>
          <input type="text" name="nomorRumah" value={formData.nomorRumah} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RT</label>
          <input type="text" name="rt" value={formData.rt} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">RW</label>
          <input type="text" name="rw" value={formData.rw} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Hunian</label>
          <select name="statusHunian" value={formData.statusHunian} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600">
            <option>Pemilik</option>
            <option>Kontrak</option>
            <option>Sewa</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Telepon (WhatsApp)</label>
          <input type="tel" name="telepon" value={formData.telepon || ''} onChange={handleChange} placeholder="08123456789" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:border-gray-600"/>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Batal</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Simpan</button>
      </div>
    </form>
  );
};

export default KeluargaForm;