// components/PengurusForm.tsx (FILE BARU)

import React, { useState } from 'react';

interface PengurusFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
  loading: boolean;
}

const PengurusForm: React.FC<PengurusFormProps> = ({ onSave, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nama_lengkap: '',
    role: 'pengurus'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.password.length < 6) {
      alert("Password minimal harus 6 karakter.");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Lengkap</label>
        <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email (untuk Login)</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} className="mt-1 block w-full rounded-md dark:bg-gray-700"/>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peran</label>
        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full rounded-md dark:bg-gray-700">
          <option value="pengurus">Pengurus</option>
          <option value="ketua">Ketua</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">Batal</button>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:bg-blue-400">{loading ? 'Menyimpan...' : 'Simpan'}</button>
      </div>
    </form>
  );
};

export default PengurusForm;