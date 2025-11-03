import React, { ReactNode, useContext } from 'react';
import { View, User } from '../types';
import { AuthContext } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, setView }) => {
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { view: View.WARGA, label: 'Data Warga', icon: '👥' },
    { view: View.KELUARGA, label: 'Data Keluarga', icon: '🏠' },
    { view: View.IURAN, label: 'Data Iuran', icon: '💰' },
  ];

  const getButtonClass = (view: View) => {
    const baseClass = "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    if (currentView === view) {
      return `${baseClass} bg-blue-500 text-white shadow-sm`;
    }
    return `${baseClass} text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
              {navItems.map(item => (
                <button key={item.view} onClick={() => setView(item.view)} className={getButtonClass(item.view)}>
                  <span>{item.icon}</span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              ))}
            </div>
            {user && (
                <div className="text-right text-sm">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Selamat datang, {user.namaLengkap}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">Peran: {user.role}</p>
                </div>
            )}
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;