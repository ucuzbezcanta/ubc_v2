'use client';

import { useState, useRef, useEffect } from 'react';
import { deleteCategory, handleCategory } from './actions';

export default function CategoryManager({ categories }: { categories: any[] }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // İsim değiştikçe slug oluştur (Sadece yeni eklemede veya manuel değişmemişse)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    
    // Basit bir slug dönüştürücü
    const generatedSlug = val.toLowerCase().trim()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    
    setSlug(generatedSlug);
  };

  const startEdit = (cat: any) => {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setName('');
    setSlug('');
    formRef.current?.reset();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-black">
      <div className="bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-4">
        <h2 className="font-bold mb-4">{editId ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}</h2>
        <form 
          ref={formRef}
          action={async (formData) => {
            const res = await handleCategory(formData);
            if(res.success) resetForm();
            else alert("İşlem başarısız oldu. Terminali kontrol edin.");
          }} 
          className="space-y-4"
        >
          <input type="hidden" name="category_id" value={editId || ''} /> 
          
          <div>
            <label className="text-xs font-bold text-gray-400">KATEGORİ ADI</label>
            <input 
              name="category_name" 
              value={name}
              onChange={handleNameChange}
              placeholder="Örn: Gabardin Çantalar" 
              className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400">URL (SLUG)</label>
            <input 
              name="category_slug" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="test-kategori" 
              className="w-full p-3 border bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
              required 
            />
            <p className="text-[10px] text-gray-400 mt-1">Otomatik oluşturulur, manuel değiştirebilirsiniz.</p>
          </div>
          
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            {editId ? 'Güncelle' : 'Kaydet'}
          </button>
          
          {editId && (
            <button type="button" onClick={resetForm} className="w-full text-xs text-red-500 hover:underline">
              Vazgeç
            </button>
          )}
        </form>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b text-gray-500 text-[10px] uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4">Kategori Bilgisi</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-gray-800">{cat.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono italic">slug: {cat.slug}</div>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => startEdit(cat)} className="text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg text-xs font-bold">Düzenle</button>
                  <button onClick={() => deleteCategory(cat.id)} className="text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold">Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}