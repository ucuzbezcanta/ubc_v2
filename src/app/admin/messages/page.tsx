import { createClient } from '@/utils/supabase/server';

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">📩 Gelen Mesajlar</h1>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
            <tr>
              <th className="p-4 font-semibold">Tarih</th>
              <th className="p-4 font-semibold">Ad Soyad</th>
              <th className="p-4 font-semibold">E-posta</th>
              <th className="p-4 font-semibold">Mesaj</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-black">
            {messages?.map((msg) => (
              <tr key={msg.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-4 text-xs text-gray-400">
                  {new Date(msg.created_at).toLocaleDateString('tr-TR')}
                </td>
                <td className="p-4 font-medium">{msg.name}</td>
                <td className="p-4 text-gray-600">{msg.email}</td>
                <td className="p-4">
                  <div className="max-w-xs text-sm text-gray-700 break-words">
                    {msg.message}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!messages || messages.length === 0) && (
          <div className="p-10 text-center text-gray-400">Henüz mesaj gelmemiş.</div>
        )}
      </div>
    </div>
  );
}