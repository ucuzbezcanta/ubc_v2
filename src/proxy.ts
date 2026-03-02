import { type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // /admin ile başlayan tüm yolları bu kontrol mekanizmasına dahil et
    '/admin/:path*',
    '/login',
  ],
}