'use client';

import { deleteProduct } from "@/actions/product-actions";
import { useRouter } from "next/navigation";

export default function ProductDeleteButton({ id, isMobile }: { id: string; isMobile?: boolean }) {
  const router = useRouter();

    const handleDelete = async () => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      const result = await deleteProduct(id);
      if (result.success) {
        router.refresh();
      } else {
        alert('Silme işlemi başarısız oldu.');
      }
    }
  };


    // Mobil için farklı, masaüstü için farklı stil
  const mobileStyle = "p-1 text-red-600 text-xs font-bold border border-red-100 rounded bg-red-50 text-center";
  const desktopStyle = "text-red-600 hover:text-red-900 font-medium text-sm";

    return (
    <button 
      onClick={handleDelete}
      className={isMobile ? mobileStyle : desktopStyle}
    >
      Sil
    </button>
  );
}