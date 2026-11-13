import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Resend } from 'resend';

// Renk kodlarını Türkçe isimlere dönüştüren harita
const COLOR_MAP: Record<string, string> = {
  '#f5f2eb': 'Ham Renk (Krem)',
  '#ffffff': 'Beyaz',
  '#1a1a1a': 'Siyah',
  '#000000': 'Siyah',
  '#1e3a8a': 'Lacivert',
  '#dc2626': 'Kırmızı',
  '#166534': 'Yeşil',
  '#eab308': 'Sarı',
  '#6b21a8': 'Mor',
  '#9a3412': 'Taba / Kahve',
  // Konfigüratörünüzde yer alan diğer renk kodlarını buraya ekleyebilirsiniz.
};

// Hex kodunu okunabilir isme çeviren yardımcı fonksiyon
const getColorName = (colorCode: string) => {
  if (!colorCode) return 'Belirtilmedi';
  const cleanCode = colorCode.toLowerCase().trim();
  return COLOR_MAP[cleanCode] || colorCode; // Haritada yoksa mevcut kodu basar
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { config, customerInfo } = await request.json();

    // Hex kodunu "Ham Renk (Krem)" gibi okunabilir metne çeviriyoruz
    const displayColor = getColorName(config.color);

    let uploadedLogoUrl = null;

    if (config.logoUrl && config.logoUrl.startsWith('data:image')) {
      const base64Data = config.logoUrl.split(';base64,').pop();
      const buffer = Buffer.from(base64Data, 'base64');
      
      const mimeType = config.logoUrl.split(';')[0].split(':')[1];
      const extension = mimeType.split('/')[1] || 'png';
      const fileName = `logos/${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${extension}`;

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: fileName,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      uploadedLogoUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
    }

    // Supabase 'proposals' tablosuna kaydetme
    const { data, error } = await supabase
      .from('proposals')
      .insert([
        {
          full_name: customerInfo.fullName,
          phone: customerInfo.phone,
          email: customerInfo.email,
          note: customerInfo.note,
          bag_type: config.bagType,
          color: displayColor, // ARTİK HEX KODU YERİNE RENK İSMİ YAZIYOR
          size: config.size,
          handle: config.handle,
          bellow: config.bellow,
          grammage: config.grammage,
          quantity: config.quantity,
          logo_url: uploadedLogoUrl,
          logo_width: config.logoWidth,
          logo_top: config.logoTop,
          logo_left: config.logoLeft,
          status: 'pending',
        },
      ])
      .select();

    if (error) throw error;

    // Resend ile Bildirim E-Postası Gönderme
    try {
      await resend.emails.send({
        from: 'Ucuz Bez Canta Teklif <onboarding@resend.dev>',
        to: ['ucuzbezcanta@gmail.com'],
        subject: `🔔 Yeni Konfigüratör Teklif Talebi - ${customerInfo.fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 8px;">🛍️ Yeni Fiyat Teklifi Talebi</h2>
            
            <h3 style="color: #1e293b; margin-top: 20px;">👤 Müşteri Bilgileri</h3>
            <p><strong>Ad Soyad:</strong> ${customerInfo.fullName}</p>
            <p><strong>Telefon:</strong> <a href="tel:${customerInfo.phone}">${customerInfo.phone}</a></p>
            <p><strong>E-Posta:</strong> <a href="mailto:${customerInfo.email}">${customerInfo.email}</a></p>
            <p><strong>Müşteri Notu:</strong> ${customerInfo.note || 'Not düşülmemiş.'}</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

            <h3 style="color: #1e293b;">🎒 Çanta Özellikleri</h3>
            <ul style="line-height: 1.6;">
              <li><strong>Çanta Tipi:</strong> ${config.bagType}</li>
              <li><strong>Kumaş Rengi:</strong> ${displayColor}</li>
              <li><strong>Boyut:</strong> ${config.size} cm</li>
              <li><strong>Sap Tipi:</strong> ${config.handle}</li>
              <li><strong>Körük:</strong> ${config.bellow}</li>
              <li><strong>Gramaj:</strong> ${config.grammage} gr/m²</li>
              <li><strong>Sipariş Adedi:</strong> <strong style="color: #2563eb;">${config.quantity} Adet</strong></li>
            </ul>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

            <h3 style="color: #1e293b;">🎨 Yüklenen Logo ve Hizalama</h3>
            ${
              uploadedLogoUrl
                ? `<p><strong>Müşteri Logosu:</strong> <a href="${uploadedLogoUrl}" target="_blank" style="background-color: #2563eb; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; display: inline-block;">Görseli / Logoyu İndir / İncele</a></p>
                   <ul style="line-height: 1.6; color: #64748b;">
                     <li>Logo Genişlik Oranı: %${config.logoWidth}</li>
                     <li>Dikey Konum (Top): %${config.logoTop}</li>
                     <li>Yatay Konum (Left): %${config.logoLeft}</li>
                   </ul>`
                : `<p style="color: #94a3b8;">Müşteri logo yüklemedi.</p>`
            }
          </div>
        `,
      });
    } catch (emailErr) {
      console.error('Bildirim e-postası gönderilemedi:', emailErr);
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Teklif kaydedilirken hata oluştu:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}