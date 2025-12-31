export const R2_DOMAIN = "https://pub-ce263849f4154be483a563fb232c1dd0.r2.dev";


export function getImageUrl(path: string | null | undefined): string {
    if (!path) return "/images/placeholder.jpg";
   let cleanPath = path.toString()
        .replace(/[\[\]"]/g, '') // [, ], ve " karakterlerini sil
        .trim();

    // 2. Adım: Eğer temizlenmiş veri zaten http ile başlıyorsa direkt döndür
    if (cleanPath.startsWith("http")) {
        return cleanPath;
    }

    // 3. Adım: Başındaki / işaretini temizle ve R2 domaini ile birleştir
    cleanPath = cleanPath.startsWith("/") ? cleanPath.slice(1) : cleanPath;
    return `${R2_DOMAIN}/${cleanPath}`;
}
