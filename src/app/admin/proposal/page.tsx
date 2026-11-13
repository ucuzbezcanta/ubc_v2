'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Proposal {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email: string;
  note: string;
  bag_type: string;
  color: string;
  size: string;
  handle: string;
  bellow: string;
  grammage: string;
  quantity: number;
  logo_url: string | null;
  status: string;
}

export default function AdminProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProposals(data);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gelen Teklif Talepleri</h1>
        <button
          onClick={fetchProposals}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Yenile
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Yükleniyor...</p>
      ) : proposals.length === 0 ? (
        <p className="text-gray-500">Henüz teklif talebi bulunmuyor.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b text-sm font-semibold text-gray-600">
                <th className="p-4">Tarih</th>
                <th className="p-4">Müşteri</th>
                <th className="p-4">İletişim</th>
                <th className="p-4">Çanta & Adet</th>
                <th className="p-4">Logo</th>
                <th className="p-4">Not</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {proposals.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap text-gray-500">
                    {new Date(item.created_at).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="p-4 font-medium text-gray-900">{item.full_name}</td>
                  <td className="p-4">
                    <div>{item.phone}</div>
                    <div className="text-xs text-gray-500">{item.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-blue-600">{item.quantity} Adet</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span>{item.bag_type} | {item.size} cm |</span>
                        <span className="font-medium text-gray-700">{item.color}</span>
                    </div>
                    </td>
                  <td className="p-4">
                    {item.logo_url ? (
                      <a
                        href={item.logo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block"
                      >
                        <img
                          src={item.logo_url}
                          alt="Logo"
                          className="w-12 h-12 object-contain border rounded p-1 bg-gray-50 hover:opacity-80"
                        />
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Yok</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-gray-600 max-w-xs truncate">
                    {item.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}