import React, { useMemo, useState } from 'react';
import { Keluarga, Warga } from '../types';

interface PublicWargaListProps {
  wargaList: Warga[];
  keluargaList: Keluarga[];
}

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.383 1.905 6.166l-1.138 4.155 4.274-1.119zM9.266 8.39c-.195-.315-.318-.39-.426-.396-.108-.005-.224-.005-.34-.005-.116 0-.308.045-.47.227-.16.182-.58.566-.58 1.385 0 .82.594 1.603.677 1.725.084.122 1.177 1.916 2.871 2.665.393.173.704.275.923.35.283.095.547.076.728-.058.21-.152.883-.913 1.008-1.095.123-.182.123-.315.084-.396-.039-.081-.116-.122-.232-.204s-.703-.347-.81-.388c-.106-.041-.182-.063-.258.063-.075.126-.277.348-.339.426-.062.078-.123.088-.232.031s-.45-.166-1.002-.619c-.419-.341-.692-.76-.787-.883-.095-.122-.01-.195.074-.275.074-.071.166-.182.25-.258.084-.076.111-.126.166-.208.055-.081.028-.152-.01-.204z"/>
    </svg>
);

const formatPhoneNumberForWhatsApp = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};


const PublicWargaList: React.FC<PublicWargaListProps> = ({ wargaList, keluargaList }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const familiesWithMembers = useMemo(() => {
    const wargaByKeluargaId = new Map<number, Warga[]>();
    wargaList.forEach(w => {
      if (w.statusHidup) {
        const list = wargaByKeluargaId.get(w.keluargaId) || [];
        list.push(w);
        wargaByKeluargaId.set(w.keluargaId, list);
      }
    });

    return keluargaList
      .map(keluarga => ({
        ...keluarga,
        anggota: wargaByKeluargaId.get(keluarga.id) || [],
      }))
      .filter(keluarga => 
        keluarga.kepalaKeluarga.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keluarga.blok.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keluarga.nomorRumah.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [wargaList, keluargaList, searchTerm]);

  return (
    <div className="space-y-6">
       <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Data Warga Cluster Beryl</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Daftar keluarga yang terdaftar di sistem paguyuban.</p>
      </div>
      
       <div className="flex justify-center">
            <input
                type="text"
                placeholder="Cari nama kepala keluarga atau blok..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="p-2 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 w-full max-w-lg"
            />
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {familiesWithMembers.map(keluarga => (
          <div key={keluarga.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{keluarga.kepalaKeluarga}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{`Blok ${keluarga.blok} No. ${keluarga.nomorRumah}`}</p>
                </div>
                {keluarga.telepon && (
                    <a
                        href={`https://wa.me/${formatPhoneNumberForWhatsApp(keluarga.telepon)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-green-100 dark:hover:bg-gray-700"
                        aria-label={`Chat with ${keluarga.kepalaKeluarga} on WhatsApp`}
                        title="Chat via WhatsApp"
                    >
                        <WhatsAppIcon />
                    </a>
                )}
            </div>
             <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                Bergabung sejak: {formatDate(keluarga.createdAt)}
            </p>
            <div className="flex-grow">
              <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Anggota Keluarga:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {keluarga.anggota.map(warga => (
                  <li key={warga.id}>
                    {warga.namaLengkap}
                    <span className="text-xs text-gray-500"> ({warga.statusDalamKeluarga})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicWargaList;