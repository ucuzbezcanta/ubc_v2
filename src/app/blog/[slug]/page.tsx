// src/app/blog/[slug]/page.tsx

import { Metadata } from "next";
import {
  fetchBlogPostsSummary,
  fetchBlogPostBySlug,
} from "../../../../lib/supabaseClient";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await fetchBlogPostsSummary();
  if (!posts) return [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params; // ✅ Promise çözümü
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Yazı Bulunamadı | Ucuz Bez Çanta",
      description: "Aradığınız blog yazısı mevcut değil.",
    };
  }

  return {
    title: `${post.title} | Ucuz Bez Çanta Blog`,
    description:
      post.description ||
      post.content?.slice(0, 150) ||
      "Ucuz Bez Çanta Blog - En yeni içerikler.",
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.cover_image_url || "/placeholder-blog-detail.jpg"],
    },
  };
}

// Sayfa Bileşeni
export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params; // ✅ Promise çözümü
  const post = await fetchBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = new Date(post.published_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlContent = post.content;

  return (
    <main className="container mx-auto px-4 pt-24 pb-12 min-h-screen max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500">
        <Link href="/blog" className="hover:text-indigo-600 transition">
          &larr; Tüm Yazılar
        </Link>
      </div>

      <article className="space-y-8">
        {/* Başlık */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center text-sm text-gray-500 space-x-3">
          <span>Yayın Tarihi: {publishedDate}</span>
          <span>|</span>
          <span>Yazar: Ucuz Bez Çanta Ekibi</span>
        </div>

        {/* Kapak Görseli */}
        <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={post.cover_image_url || "/placeholder-blog-detail.jpg"}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* İçerik */}
        <div
          className="prose prose-lg max-w-none prose-indigo pt-8 border-t border-gray-200"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </main>
  );
}
