'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function handleCategory(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('category_id') as string;
  const name = formData.get('category_name') as string;
  const slug = formData.get('category_slug') as string; // Formdan gelen slug'ı al

  try {
    if (id && id.trim() !== "") {
      // GÜNCELLEME
      const { error } = await supabase
        .from('categories')
        .update({ name, slug })
        .eq('id', id);
      if (error) throw error;
    } else {
      // YENİ EKLEME
      const { error } = await supabase
        .from('categories')
        .insert([{ name, slug }]);
      if (error) throw error;
    }
    
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (err) {
    console.error("Supabase Hatası:", err);
    return { success: false, error: err };
  }
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) console.error("Silme Hatası:", error);
  revalidatePath('/admin/categories');
}