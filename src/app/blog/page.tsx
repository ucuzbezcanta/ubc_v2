// src/app/blog/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { fetchBlogPostsSummary, BlogPostSummary } from '../../../lib/supabaseClient'; // Yolu kontrol edin
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | Ucuz Bez Çanta',
  description: 'Bez çanta trendleri, promosyon fikirleri ve sektör haberleri blog yazılarımız.',
};

// Next.js önbelleğini ayarla
export const revalidate = 3600; // 1 saatte bir veriyi yeniden çek

export default async function BlogPage() {
  const posts = await fetchBlogPostsSummary();

  return (
    <main className="container mx-auto px-4 pt-24 min-h-screen max-w-6xl">
      
      <div className="text-center py-10 border-b border-gray-200 mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900">Ucuz Bez Çanta Blog</h1>
        <p className="mt-3 text-lg text-gray-600">En güncel promosyon ve çanta trendlerini keşfedin.</p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Şu anda yayınlanmış bir blog yazısı bulunmamaktadır.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  );
}

// Blog Kartı Bileşeni
interface PostCardProps {
    post: BlogPostSummary;
}

function PostCard({ post }: PostCardProps) {
    const publishedDate = new Date(post.published_at).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Link 
            href={`/blog/${post.slug}`} 
            className="block bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
        >
            {/* Görsel */}
            <div className="relative h-48 w-full">
                <Image 
                    src={post.cover_image_url || '/placeholder-blog.jpg'} // Placeholder kullanın
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
            
            {/* İçerik */}
            <div className="p-6">
                <p className="text-xs text-indigo-600 font-semibold mb-2">{publishedDate}</p>
                
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {post.title}
                </h2>
                
                <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                    {post.description}
                </p>
                
                <div className="mt-4 flex items-center text-indigo-600 text-sm font-semibold">
                    Devamını Oku <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}