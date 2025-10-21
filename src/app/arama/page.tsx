// src/app/arama/page.tsx

import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export const metadata: Metadata = {
  title: "Arama | UcuzBezCanta",
  description: "UcuzBezCanta arama sayfası. Toptan bez çanta ve promosyon ürünlerini keşfedin.",
  alternates: {
    canonical: "/arama",
  },
  openGraph: {
    title: "Arama | UcuzBezCanta",
    description: "UcuzBezCanta arama sayfasında ürünleri keşfedin.",
    url: "/arama",
    type: "website",
  },
};

export default function Page() {
  // ✅ useSearchParams() kullanan Client Component'i Suspense içine alın
  return (
    <Suspense 
        fallback={
            <div className="container mx-auto px-4 py-8 max-w-6xl pt-24 min-h-screen">
                <div className="text-center py-16 text-gray-500">
                    Arama alanı yükleniyor...
                </div>
            </div>
        }
    >
        <SearchPageClient />
    </Suspense>
  );
}
