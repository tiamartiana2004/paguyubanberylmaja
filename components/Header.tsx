import React, { useState, useContext } from 'react';
import { View } from '../types';
import { AuthContext } from '../contexts/AuthContext';

interface HeaderProps {
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { view: View.PUBLIC_DASHBOARD, label: 'Dashboard', icon: '📊' },
    { view: View.REGISTER, label: 'Pendaftaran', icon: '📝' },
    { view: View.PUBLIC_WARGA, label: 'Data Warga', icon: '👨‍👩‍👧‍👦' },
    { view: View.PUBLIC_IURAN, label: 'Transparansi Iuran', icon: '💰' },
  ];

  const handleAdminAreaClick = () => {
    if (user) {
      setView(View.WARGA);
    } else {
      setView(View.LOGIN);
    }
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold cursor-pointer" onClick={() => setView(View.PUBLIC_DASHBOARD)}>Paguyuban Cluster Beryl</span>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            {publicNavItems.map(item => (
              <button key={item.view} onClick={() => setView(item.view)} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {item.label}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="border-l border-gray-600 h-8 mx-2"></div>
            {user ? (
              <>
                <button onClick={handleAdminAreaClick} className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Area Pengurus
                </button>
                 <button onClick={logout} className="text-gray-300 hover:bg-red-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={handleAdminAreaClick} className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                Login Pengurus
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {publicNavItems.map(item => (
                <button key={item.view} onClick={() => { setView(item.view); setIsMobileMenuOpen(false); }} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-700 my-2"></div>
              {user ? (
                <>
                  <button onClick={() => { handleAdminAreaClick(); setIsMobileMenuOpen(false); }} className="bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                    Area Pengurus
                  </button>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-gray-300 hover:bg-red-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={() => { handleAdminAreaClick(); setIsMobileMenuOpen(false); }} className="bg-green-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-green-700">
                  Login Pengurus
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;