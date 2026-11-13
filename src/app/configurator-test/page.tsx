'use client';

import { useState, useRef } from 'react';

const BAG_TYPES = [
  { id: 'bez', name: 'Bez Çanta', icon: '🛍️' },
  { id: 'kanvas', name: 'Kanvas Çanta', icon: '💼' },
  { id: 'gabardin', name: 'Gabardin Çanta', icon: '🎒' },
];

const COLORS = [
  { id: '#f5f2eb', name: 'Krem (Ham Bez)' },
  { id: '#1a1a1a', name: 'Siyah' },
  { id: '#1e3a8a', name: 'Lacivert' },
  { id: '#b91c1c', name: 'Kırmızı' },
  { id: '#15803d', name: 'Yeşil' },
];

const SIZES = [
  { id: '35x40', name: '35x40 cm (Standart)' },
  { id: '40x45', name: '40x45 cm (Büyük)' },
  { id: '30x35', name: '30x35 cm (Küçük)' },
];

const HANDLES = [
  { id: 'kisa', name: 'Kısa El Tutamaklı (35 cm)' },
  { id: 'orta', name: 'Omuz Askılı Standart (70 cm)' },
];

const BELLOWS = [
  { id: 'yok', name: 'Körüksüz (Düz Kesim)' },
  { id: '10cm', name: '10 cm Taban Körüklü' },
  { id: '8cm', name: '8 cm Yan ve Taban Körüklü' },
];

const GRAMMAGES = [
  { id: '140', name: '140 gr/m² (Standart İnce)' },
  { id: '220', name: '220 gr/m² (Orta Kalın)' },
  { id: '320', name: '320 gr/m² (Kalın Kanvas)' },
];

const QUANTITIES = [500, 1000, 2000, 5000, 10000];

export default function ConfiguratorTest() {
  const [config, setConfig] = useState({
    step: 1,
    bagType: 'bez',
    color: '#f5f2eb',
    size: '35x40',
    handle: 'orta',
    bellow: 'yok',
    grammage: '140',
    quantity: 1000,
    logoUrl: null as string | null,
    logoWidth: 80, 
    logoTop: 56,   
    logoLeft: 50,  
  });

  // İletişim Bilgileri State'i
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: '',
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewAreaRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig((prev) => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setConfig((prev) => ({ 
      ...prev, 
      logoUrl: null,
      logoTop: 56,
      logoLeft: 50 
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Sürükle Bırak Mantığı
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !previewAreaRef.current) return;

    const rect = previewAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const boundedX = Math.max(28, Math.min(72, x));
    const boundedY = Math.max(42, Math.min(85, y));

    setConfig((prev) => ({
      ...prev,
      logoLeft: Math.round(boundedX),
      logoTop: Math.round(boundedY),
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Form Gönderimi (R2 & Supabase entegrasyonu için tetiklenecek fonksiyon)
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // API Route veya Server Action buraya bağlanacak
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          customerInfo,
        }),
      });

      if (!response.ok) throw new Error('Teklif kaydedilemedi.');

      setSubmitStatus('success');
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 md:pt-36 pb-16 min-h-screen bg-slate-50 p-8 font-sans text-slate-800">
      {/* Başlık */}
      <div className="max-w-5xl mx-auto mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold mb-2 text-slate-900">ucuzbezcanta.com - TEKLİF OLUŞTURMA SAYFASI</h1>
        <p className="text-slate-500 text-sm mb-6">TEKLİF İSTE</p>
        
        {/* İlerleme Çubuğu */}
        <div className="flex items-center gap-4 text-sm font-medium">
          <div className={`px-3 py-1.5 rounded-full ${config.step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>1. Model & Renk</div>
          <div className="h-px bg-slate-200 flex-1"></div>
          <div className={`px-3 py-1.5 rounded-full ${config.step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>2. Fiziksel Özellikler</div>
          <div className="h-px bg-slate-200 flex-1"></div>
          <div className={`px-3 py-1.5 rounded-full ${config.step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>3. Tasarım & Logo</div>
          <div className="h-px bg-slate-200 flex-1"></div>
          <div className={`px-3 py-1.5 rounded-full ${config.step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>4. Özet & Teklif</div>
        </div>
      </div>

      {/* Ana Gövde */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SOL ALAN: SEÇENEKLER / FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[500px] flex flex-col justify-between">
          <div>
            {/* 1. ADIM: MODEL VE RENK */}
            {config.step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold mb-3 text-slate-900">1. Çanta Modelini Seçin</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {BAG_TYPES.map((bag) => (
                      <button
                        key={bag.id}
                        onClick={() => setConfig({ ...config, bagType: bag.id })}
                        className={`p-3 rounded-xl border-2 text-left flex items-center gap-4 transition-all ${
                          config.bagType === bag.id
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xl">{bag.icon}</span>
                        <span className="font-medium text-sm">{bag.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold mb-3 text-slate-900">2. Renk Seçin</h3>
                  <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setConfig({ ...config, color: color.id })}
                        title={color.name}
                        className={`w-10 h-10 rounded-full border-2 transition-all relative ${
                          config.color === color.id 
                            ? 'border-blue-600 scale-110 shadow-md' 
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.id }}
                      >
                        {config.color === color.id && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600 bg-white/20 rounded-full">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. ADIM: FİZİKSEL ÖZELLİKLER */}
            {config.step === 2 && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Çantanın Fiziksel Yapısını Belirleyin</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Boyut</label>
                  <select 
                    value={config.size}
                    onChange={(e) => setConfig({ ...config, size: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none"
                  >
                    {SIZES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Sap Tipi</label>
                  <select 
                    value={config.handle}
                    onChange={(e) => setConfig({ ...config, handle: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none"
                  >
                    {HANDLES.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Körük Seçeneği</label>
                  <select 
                    value={config.bellow}
                    onChange={(e) => setConfig({ ...config, bellow: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none"
                  >
                    {BELLOWS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kumaş Gramajı (Kalınlık)</label>
                  <select 
                    value={config.grammage}
                    onChange={(e) => setConfig({ ...config, grammage: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none"
                  >
                    {GRAMMAGES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Sipariş Adedi</label>
                  <select 
                    value={config.quantity}
                    onChange={(e) => setConfig({ ...config, quantity: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-blue-900 focus:outline-none"
                  >
                    {QUANTITIES.map(q => <option key={q} value={q}>{q.toLocaleString('tr-TR')} Adet</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* 3. ADIM: LOGO YÜKLEME */}
            {config.step === 3 && (
              <div className="space-y-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">Logonuzu veya Tasarımınızı Ekleyin</h3>
                
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center transition-all hover:border-blue-400">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden" 
                  />
                  
                  {!config.logoUrl ? (
                    <div className="space-y-3">
                      <span className="text-4xl">📤</span>
                      <div>
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Logo Yüklemek İçin Tıklayın
                        </button>
                        <p className="text-xs text-slate-400 mt-1">PNG veya JPG (Önerilen: Arka plansız PNG)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 w-full">
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <img src={config.logoUrl} alt="Logo Önizleme" className="w-10 h-10 object-contain rounded bg-slate-50 border" />
                          <span className="text-xs font-medium text-slate-600">Logo Başarıyla Yüklendi</span>
                        </div>
                        <button 
                          onClick={removeLogo}
                          className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1"
                        >
                          Sil
                        </button>
                      </div>

                      <div className="bg-blue-50 text-blue-700 p-3 rounded-xl text-left border border-blue-100/50">
                        <p className="text-xs font-medium flex items-center gap-2">
                          <span>💡</span>
                          <span>Sağ taraftaki çanta üzerinde logoyu tutup sürükleyerek dilediğiniz gibi konumlandırabilirsiniz!</span>
                        </p>
                      </div>

                      <div className="space-y-1.5 text-left bg-white p-4 rounded-xl border border-slate-100">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                          <span>Logo Boyutu</span>
                          <span className="text-blue-600">%{config.logoWidth}</span>
                        </label>
                        <input 
                          type="range" 
                          min="30" 
                          max="130" 
                          value={config.logoWidth}
                          onChange={(e) => setConfig({ ...config, logoWidth: Number(e.target.value) })}
                          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. ADIM: ÖZET & TEKLİF FORMU */}
            {config.step === 4 && (
              <div className="space-y-5">
                <h3 className="text-base font-semibold text-slate-900">Fiyat Teklifi Alın</h3>
                <p className="text-xs text-slate-500">Aşağıdaki bilgileri doldurarak çanta tasarımınızla birlikte fiyat teklifi talebini anında oluşturun.</p>

                {submitStatus === 'success' ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3">
                    <span className="text-4xl block">🎉</span>
                    <h4 className="font-bold text-base">Talebiniz Başarıyla Alındı!</h4>
                    <p className="text-xs text-emerald-600">Tasarımınız ve seçimleriniz kaydedildi. Müşteri temsilcimiz en kısa sürede sizinle iletişime geçecektir.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProposal} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Ad Soyad *</label>
                      <input 
                        type="text" 
                        required
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                        placeholder="Adınız Soyadınız"
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Telefon *</label>
                        <input 
                          type="tel" 
                          required
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          placeholder="05xx xxx xx xx"
                          className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">E-Posta *</label>
                        <input 
                          type="email" 
                          required
                          value={customerInfo.email}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                          placeholder="ornek@mail.com"
                          className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Özel İstek / Not</label>
                      <textarea 
                        rows={2}
                        value={customerInfo.note}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                        placeholder="Baskı yönü, özel paketleme istekleri vb..."
                        className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 bg-slate-50/50 resize-none"
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <p className="text-xs text-red-500 font-medium">❌ Bir hata oluştu, lütfen bilgilerinizi kontrol edip tekrar deneyin.</p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/10 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Teklif Kaydediliyor...</span>
                        </>
                      ) : (
                        <span>Teklifi Gönder</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Butonlar (Son adımda form butonları geçerli olduğundan gizlenir) */}
          {submitStatus !== 'success' && (
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
              <button
                disabled={config.step === 1 || isSubmitting}
                onClick={() => setConfig({ ...config, step: config.step - 1 })}
                className="px-5 py-2 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Geri
              </button>
              {config.step < 4 && (
                <button
                  onClick={() => setConfig({ ...config, step: config.step + 1 })}
                  className="px-5 py-2 rounded-xl bg-blue-600 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  İleri
                </button>
              )}
            </div>
          )}
        </div>

        {/* SAĞ ALAN: CANLI VE SÜRÜKLENEBİLİR LOGOLU MOCKUP */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-between min-h-[500px]">
          
          {/* Çanta ve Logo Konteyner */}
          <div 
            ref={previewAreaRef}
            className="w-full max-w-[240px] aspect-[3/4] relative flex flex-col items-center justify-center p-4 select-none touch-none"
          >
            {config.logoUrl && (
              <div 
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`absolute z-10 select-none cursor-grab active:cursor-grabbing transition-transform ${
                  isDragging ? 'scale-105' : ''
                }`}
                style={{
                  top: `${config.logoTop}%`,
                  left: `${config.logoLeft}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${config.logoWidth * 0.75}px`,
                  touchAction: 'none',
                }}
              >
                <div className={`absolute inset-0 border-2 border-dashed rounded-md transition-opacity ${
                  config.step === 3 ? (isDragging ? 'border-blue-500 opacity-100' : 'border-slate-300 opacity-40 hover:opacity-100') : 'opacity-0'
                }`} />
                
                <img 
                  src={config.logoUrl} 
                  alt="Uygulanan Logo" 
                  className="w-full h-auto object-contain max-h-[110px] pointer-events-none" 
                />
              </div>
            )}

            {/* SVG Çanta */}
            <svg 
              viewBox="0 0 400 500" 
              className="w-full h-auto drop-shadow-xl transition-all duration-300 pointer-events-none"
              style={{ filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.08))' }}
            >
              <path 
                d="M 140 170 C 140 30, 260 30, 260 170" 
                fill="none" 
                stroke={config.color === '#f5f2eb' ? '#dcd7cc' : config.color} 
                strokeWidth={config.handle === 'kisa' ? '12' : '24'}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
              <path 
                d="M 140 170 C 140 30, 260 30, 260 170" 
                fill="none" 
                stroke="rgba(0,0,0,0.05)" 
                strokeWidth={config.handle === 'kisa' ? '12' : '24'}
                strokeLinecap="round"
              />
              <path 
                d="M 90 170 L 310 170 C 325 170, 325 180, 320 200 L 295 460 C 290 480, 280 480, 260 480 L 140 480 C 120 480, 110 480, 105 460 L 80 200 C 75 180, 75 170, 90 170 Z" 
                fill={config.color} 
                className="transition-all duration-300"
              />
              <path 
                d="M 90 170 L 310 170 C 325 170, 325 180, 320 200 L 295 460 C 290 480, 280 480, 260 480 L 140 480 C 120 480, 110 480, 105 460 L 80 200 C 75 180, 75 170, 90 170 Z" 
                fill="url(#canvas-shadow)" 
              />
              <defs>
                <linearGradient id="canvas-shadow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                  <stop offset="50%" stopColor="rgba(0,0,0,0)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Sağ Panel Altındaki Seçim Özeti Kartı */}
          <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Seçim Detayları</span>
            <div className="grid grid-cols-2 gap-y-1.5 text-slate-600">
              <p>Model: <strong className="text-slate-900">{BAG_TYPES.find(b => b.id === config.bagType)?.name}</strong></p>
              <p>Ölçü: <strong className="text-slate-900">{config.size} cm</strong></p>
              <p>Sap: <strong className="text-slate-900">{HANDLES.find(h => h.id === config.handle)?.name}</strong></p>
              <p>Körük: <strong className="text-slate-900">{BELLOWS.find(b => b.id === config.bellow)?.name}</strong></p>
              <p>Gramaj: <strong className="text-slate-900">{config.grammage} gr/m²</strong></p>
              <p>Adet: <strong className="text-slate-900">{config.quantity.toLocaleString('tr-TR')}</strong></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}