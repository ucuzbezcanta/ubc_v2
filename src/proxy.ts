import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

// 'default' anahtar kelimesini ekledik ve fonksiyon ismini 'proxy' yaptık
export default async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login',
  ],
};