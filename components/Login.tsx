// components/Login.tsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const Login: React.FC = () => {
  const [email, setEmail] = useState(''); // Diubah dari username menjadi email
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Sekarang memanggil fungsi login dengan email dan password
      await login(email, password);
      // Komponen App akan menangani pengalihan (redirection) setelah login berhasil
    } catch (err) {
      const errorMessage = (err as Error).message;
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Email atau password salah. Silakan coba lagi.');
      } else {
        setError(errorMessage || 'Terjadi kesalahan saat login.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Login Area Pengurus</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email" // Tipe input diubah menjadi email
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {loading ? <LoadingSpinner /> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;