import { fetchCategories, Category } from "../../lib/supabaseClient";
import Header from "./Header";

export default async function HeaderDataFetcher() {
  // Veri çekme işlemi sunucuda gerçekleşir (Hızlı ve SEO dostu)
  const categories: Category[] | null = await fetchCategories();

  // Eğer kategori yoksa boş bir dizi göndeririz
  const finalCategories: Category[] = categories || [];

  // Header, Client Component olduğu için burada prop olarak gönderilir
  return <Header serverCategories={finalCategories} />;
}
