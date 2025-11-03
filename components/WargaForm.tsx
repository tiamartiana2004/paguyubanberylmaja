// components/WargaForm.tsx

import React, { useState, useEffect } from 'react';
import { Warga, Keluarga } from '../types';

interface WargaFormProps {
  wargaToEdit?: Warga | null;
  keluargaList: Keluarga[];
  onSave: (warga: Omit<Warga, 'id' | 'created_at' | 'updated_at'> | Warga) => void;
  onCancel: () => void;
}

const WargaForm: React.FC<WargaFormProps> = ({ wargaToEdit, keluargaList, onSave, onCancel }) => {
  // FIX: Added missing mandatory fields 'tanggalLahir' and 'pekerjaan' to fix the type error.
  const initialFormState: Omit<Warga, 'id' | 'created_at' | 'updated_at'> = {
    keluargaId: 0,
    nik: '',
    namaLengkap: '',
    jenisKelamin: 'L',
    tanggalLahir: '',
    pekerjaan: '',
    statusHidup: true,
    statusDalamKeluarga: '',
    tempatLahir: '',
    agama: '',
    pendidikan: '',
    statusPerkawinan: '',
    kewarganegaraan: '',
    email: '',
    telepon: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (wargaToEdit) {
      setFormData({
        ...initialFormState, // Start with a clean slate to avoid carrying over optional fields
        ...wargaToEdit,
        tanggalLahir: wargaToEdit.tanggalLahir ? wargaToEdit.tanggalLahir.slice(0, 10) : ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [wargaToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'keluargaId' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.keluargaId === 0 && keluargaList.length > 0) { // Check for keluargaList to allow registration form
        alert("Pilih Kartu Keluarga terlebih dahulu.");
        return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
                <input type="text" name="namaLengkap" value={formData.namaLengkap} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">NIK</label>
                <input type="text" name="nik" value={formData.nik} onChange={handleChange} required maxLength={16} minLength={16} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            {keluargaList.length > 0 && ( // Only show KK selection if it's not the registration page
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kartu Keluarga</label>
                  <select name="keluargaId" value={formData.keluargaId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                      <option value={0} disabled>Pilih KK</option>
                      {keluargaList.map(kk => (
                          <option key={kk.id} value={kk.id}>{kk.nomorKK} - {kk.kepalaKeluarga}</option>
                      ))}
                  </select>
              </div>
            )}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jenis Kelamin</label>
                <select name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tanggal Lahir</label>
                <input type="date" name="tanggalLahir" value={formData.tanggalLahir ? formData.tanggalLahir.slice(0, 10) : ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pekerjaan</label>
                <input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status dalam Keluarga</label>
                <input type="text" name="statusDalamKeluarga" value={formData.statusDalamKeluarga || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"/>
            </div>
        </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Batal</button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Simpan</button>
      </div>
    </form>
  );
};

export default WargaForm;