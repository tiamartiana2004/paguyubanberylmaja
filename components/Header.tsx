// components/Header.tsx

import React, { useContext, useState } from 'react';
import { View } from '../types';
import { AuthContext } from '../contexts/AuthContext';

interface HeaderProps {
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const publicNavItems = [
    { view: View.PUBLIC_DASHBOARD, label: 'Dashboard' },
    { view: View.REGISTER, label: 'Pendaftaran' },
    { view: View.PUBLIC_WARGA, label: 'Data Warga' },
    { view: View.PUBLIC_IURAN, label: 'Transparansi Iuran' },
  ];

  const handleAdminAreaClick = () => {
    if (user) {
      setView(View.WARGA);
    } else {
      setView(View.LOGIN);
    }
    setIsMenuOpen(false);
  };

  const handleNavClick = (view: View) => {
    setView(view);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-white text-lg sm:text-xl font-bold cursor-pointer" onClick={() => handleNavClick(View.PUBLIC_DASHBOARD)}>
              Paguyuban Beryl
            </span>
          </div>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {publicNavItems.map(item => (
              <button key={item.view} onClick={() => handleNavClick(item.view)} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                {item.label}
              </button>
            ))}
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

          {/* Tombol Menu Mobile */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {publicNavItems.map(item => (
              <button key={item.view} onClick={() => handleNavClick(item.view)} className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-700 pt-4 mt-2 space-y-2">
              {user ? (
                <>
                  <button onClick={handleAdminAreaClick} className="bg-blue-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700">
                    Area Pengurus
                  </button>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-gray-300 hover:bg-red-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <button onClick={handleAdminAreaClick} className="bg-green-600 text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-green-700">
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