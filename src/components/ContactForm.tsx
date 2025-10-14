'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
// Yolu kontrol edin: saveContactMessage fonksiyonunun import edildiği yol.
import { saveContactMessage } from '../../lib/supabaseClient'; 

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    // 'subject' alanı kaldırıldı
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    
    try {
        // saveContactMessage çağrısından 'formData.subject' kaldırıldı.
        const result = await saveContactMessage(
            formData.name,
            formData.email,
            formData.message // Artık sadece 3 parametre gönderiliyor
        );

        if (result.success) {
            setStatus('success');
            // Form temizlenirken 'subject' alanı kaldırıldı
            setFormData({ name: '', email: '', message: '' }); 
        } else {
            // Hata mesajını daha anlaşılır hale getirelim
            throw new Error(result.error || 'Mesaj gönderilirken bilinmeyen bir Supabase hatası oluştu.');
        }

    } catch (error) {
        console.error('Form Gönderme Hatası:', error);
        setStatus('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 border border-gray-200 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Online Talep Formu</h2>
      
      {/* BAŞARI/HATA MESAJLARI */}
      {status === 'success' && (
        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
          <span className="font-medium">Başarılı!</span> Mesajınız bize ulaştı, teşekkür ederiz.
        </div>
      )}
      {status === 'error' && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          <span className="font-medium">Hata!</span> Mesajınız gönderilemedi. Lütfen teknik desteğe başvurun veya tekrar deneyin.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* İsim */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isSubmitting}
          />
        </div>

        {/* E-posta */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isSubmitting}
          />
        </div>

        {/* Konu Alanı Kaldırıldı */}

        {/* Mesaj */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız *</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white shadow-sm transition-colors duration-200 
            ${isSubmitting 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
          }
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gönderiliyor...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Mesajı Gönder</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
