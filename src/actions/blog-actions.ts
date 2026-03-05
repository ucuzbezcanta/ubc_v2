"use server";

import { createClient } from "@/utils/supabase/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
});

export async function createBlogAction(formData: FormData) {
  const supabase = await createClient();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const coverImageFile = formData.get("cover_image") as File;

  console.log("Gelen Veriler:", { title, slug });

  let cover_image_url = "";

  // Görsel varsa R2'ye yükle
  if (coverImageFile && coverImageFile.size > 0) {
    console.log("Görsel R2'ye gönderiliyor...");
    const buffer = Buffer.from(await coverImageFile.arrayBuffer());
    const fileName = `blog/${Date.now()}-${coverImageFile.name}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: coverImageFile.type,
    }));
    
    // Kendi custom domainini buraya ekle
    cover_image_url = `https://pub-ce263849f4154be483a563fb232c1dd0.r2.dev/${fileName}`;
    console.log("Görsel başarıyla yüklendi.");
  }

  console.log("Supabase'e kayıt yapılıyor...");

  // Supabase'e kaydet
const { error } = await supabase
    .from('blog_posts')
    .insert([
      { 
        title, 
        slug, // Eğer burası undefined veya "" ise hata verir
        description, 
        content, 
        cover_image_url, 
        published_at: new Date().toISOString() 
      }
    ]);

  if (error) {
    console.error("Supabase Hatası:", error.message); // BURAYA EKLE
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteBlogAction(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateBlogAction(formData: FormData) {
  const supabase = await createClient();
  
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const content = formData.get("content") as string;
  const coverImageFile = formData.get("cover_image") as File;
  let cover_image_url = formData.get("current_image_url") as string;

  // Eğer yeni bir görsel seçildiyse R2'ye yükle
  if (coverImageFile && coverImageFile.size > 0) {
    const buffer = Buffer.from(await coverImageFile.arrayBuffer());
    const fileName = `blog/${Date.now()}-${coverImageFile.name}`;

    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: coverImageFile.type,
    }));
    
    cover_image_url = `https://pub-ce263849f4154be483a563fb232c1dd0.r2.dev/${fileName}`; 
  }

  const { error } = await supabase
    .from('blog_posts')
    .update({ title, slug, description, content, cover_image_url })
    .eq('id', parseInt(id));

  if (error) return { success: false, error: error.message };
  return { success: true };
}