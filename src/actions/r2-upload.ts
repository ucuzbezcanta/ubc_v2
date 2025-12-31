'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

//R2bağlantı ayarları
const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

/**
 * Görseli R2'ye yükler ve public URL'sini döner.
 * @param file Yüklenecek dosya
 * @param folder Kova içindeki klasör adı (örn: 'products', 'slides')
 */

export async function uploadToR2(file: File, folder: string) {
  try {
    // Dosyayı sunucu tarafında işlenebilir formata çeviriyoruz
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosya adını temizleyelim ve benzersiz yapmak için zaman damgası ekleyelim
    // Örn: products/171563200-canta-gorseli.jpg
    const safeFileName = file.name.replace(/\s+/g, "-").toLowerCase();
    const fileName = `${folder}/${Date.now()}-${safeFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type, // Tarayıcıda doğru görüntülenmesi için tipini belirtiyoruz
    });

    // R2'ye gönderiyoruz
    await r2Client.send(command);

    // Başarılıysa görsele erişebileceğimiz tam linki dönüyoruz
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw new Error("Görsel R2'ye yüklenirken bir hata oluştu.");
  }
}