// App.tsx

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Warga, Keluarga, Iuran, View } from './types';
import * as api from './services/api';
import Header from './components/Header';
import AdminLayout from './components/AdminLayout';
import Dashboard from './components/Dashboard';
import WargaList from './components/WargaList';
import KeluargaList from './components/KeluargaList';
import IuranList from './components/IuranList';
import Registration from './components/Registration';
import LoadingSpinner from './components/LoadingSpinner';
import Login from './components/Login';
import { AuthContext } from './contexts/AuthContext';
import PublicWargaList from './components/PublicWargaList';
import PublicIuran from './components/PublicIuran';
import PengurusList from './components/PengurusList';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.PUBLIC_DASHBOARD);
  const [wargaList, setWargaList] = useState<Warga[]>([]);
  const [keluargaList, setKeluargaList] = useState<Keluarga[]>([]);
  const [iuranList, setIuranList] = useState<Iuran[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useContext(AuthContext);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Mengambil semua data utama aplikasi secara paralel
      const [wargaData, keluargaData, iuranData] = await Promise.all([
        api.getWarga(),
        api.getKeluarga(),
        api.getIuran(),
      ]);
      setWargaList(wargaData);
      setKeluargaList(keluargaData);
      setIuranList(iuranData);
    } catch (err) {
      setError('Gagal mengambil data dari server. Coba muat ulang halaman.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Ambil data saat komponen pertama kali dimuat
    fetchData();
  }, [fetchData]);

  // Effect untuk menangani navigasi berdasarkan status otentikasi
  useEffect(() => {
    if (!authLoading) {
      const adminViews: View[] = [View.WARGA, View.KELUARGA, View.IURAN, View.PENGURUS];
      
      // Jika user sudah login tapi masih di halaman login, redirect ke halaman admin
      if (user && view === View.LOGIN) {
        setView(View.WARGA);
      } 
      // Jika user belum login tapi mencoba akses halaman admin, redirect ke login
      else if (!user && adminViews.includes(view)) {
        setView(View.LOGIN);
      } 
      // Jika user bukan 'ketua' tapi mencoba akses halaman manajemen pengurus, redirect
      else if (user?.role !== 'ketua' && view === View.PENGURUS) {
        alert('Anda tidak memiliki akses ke halaman ini.');
        setView(View.WARGA);
      }
    }
  }, [user, view, authLoading]);


  const handleCreateWarga = async (warga: Omit<Warga, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await api.createWarga(warga);
      // Data akan di-refresh setelah form ditutup di WargaList
    } catch (err) {
      throw new Error('Gagal membuat data warga.');
    }
  };

  const handleUpdateWarga = async (warga: Warga) => {
    setIsLoading(true);
    try {
      await api.updateWarga(warga.id, warga);
      await fetchData();
    } catch (err) {
      setError('Gagal memperbarui data warga.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWarga = async (id: number) => {
    setIsLoading(true);
    try {
      await api.deleteWarga(id);
      await fetchData();
    } catch (err) {
      setError('Gagal menghapus data warga.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateKeluarga = async (keluarga: Omit<Keluarga, 'id' | 'created_at' | 'updated_at'>): Promise<Keluarga | null> => {
    try {
      const newKeluarga = await api.createKeluarga(keluarga);
      return newKeluarga;
    } catch (err) {
      throw new Error('Gagal membuat data keluarga.');
    }
  };

  const handleUpdateKeluarga = async (keluarga: Keluarga) => {
    setIsLoading(true);
    try {
      await api.updateKeluarga(keluarga.id, keluarga);
      await fetchData();
    } catch (err) {
      setError('Gagal memperbarui data keluarga.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKeluarga = async (id: number) => {
    setIsLoading(true);
    try {
      await api.deleteKeluarga(id);
      await fetchData();
    } catch (err) {
        const errorMessage = (err as Error).message || 'Gagal menghapus data keluarga.';
        setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateIuran = async (iuran: Omit<Iuran, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      await api.createIuran(iuran);
      await fetchData();
    } catch (err) {
      setError('Gagal membuat data iuran.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateIuran = async (iuran: Iuran) => {
    setIsLoading(true);
    try {
      await api.updateIuran(iuran.id, iuran);
      await fetchData();
    } catch (err) {
      setError('Gagal memperbarui data iuran.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteIuran = async (id: number) => {
    setIsLoading(true);
    try {
      await api.deleteIuran(id);
      await fetchData();
    } catch (err) {
      setError('Gagal menghapus data iuran.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    const adminViews: View[] = [View.WARGA, View.KELUARGA, View.IURAN, View.PENGURUS];
    
    // Tampilkan loading spinner jika data utama atau status otentikasi sedang dimuat
    if (isLoading || authLoading) { 
      return (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      );
    }

    // Tampilkan pesan error jika ada
    if (error) {
      return (
        <div className="text-center p-4 bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button onClick={() => { setError(null); fetchData(); }} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </button>
        </div>
      );
    }
    
    // Render Halaman Publik
    if (view === View.PUBLIC_DASHBOARD) {
        return <Dashboard wargaList={wargaList} keluargaList={keluargaList} iuranList={iuranList}/>;
    }
    if (view === View.REGISTER) {
      return <Registration onCreateKeluarga={handleCreateKeluarga} onCreateWarga={handleCreateWarga} onRegistrationSuccess={fetchData} />;
    }
    if (view === View.PUBLIC_WARGA) {
        return <PublicWargaList wargaList={wargaList} keluargaList={keluargaList} />;
    }
     if (view === View.PUBLIC_IURAN) {
        return <PublicIuran iuranList={iuranList} keluargaList={keluargaList} />;
    }
    
    // Render Halaman Login
    if(view === View.LOGIN) {
        return <Login />;
    }
    
    // Render Halaman Admin jika user sudah login
    if(user && adminViews.includes(view)) {
        return (
            <AdminLayout currentView={view} setView={setView}>
                <div className="relative">
                    {
                        {
                            [View.WARGA]: <WargaList wargaList={wargaList} keluargaList={keluargaList} onUpdate={handleUpdateWarga} onDelete={handleDeleteWarga} onDataChange={fetchData} />,
                            [View.KELUARGA]: <KeluargaList keluargaList={keluargaList} onUpdate={handleUpdateKeluarga} onDelete={handleDeleteKeluarga}/>,
                            [View.IURAN]: <IuranList iuranList={iuranList} keluargaList={keluargaList} onUpdate={handleUpdateIuran} onDelete={handleDeleteIuran} onDataChange={fetchData}/>,
                            [View.PENGURUS]: <PengurusList />, // PengurusList kini me-manage datanya sendiri
                        }[view]
                    }
                </div>
            </AdminLayout>
        )
    }

    // Fallback jika tidak ada view yang cocok
    return <div className="text-center py-10">Silakan pilih menu di atas untuk memulai.</div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header setView={setView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;