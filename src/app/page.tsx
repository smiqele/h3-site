'use client';
import Link from 'next/link';

const pages = [
  { title: 'h3map', path: '/h3map' },
  { title: 'ascii', path: '/ascii' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex justify-center bg-gray-100 p-8">
      <div className="max-w-[1200px] w-full">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Страницы</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Link
              key={page.path}
              href={page.path}
              className="block bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 text-center border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-700">{page.title}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
