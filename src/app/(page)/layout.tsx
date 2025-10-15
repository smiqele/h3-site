'use client';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

export default function PagesLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <main className="">
      <div className="bg-gray-100 p-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
        >
          ← Назад
        </button>
      </div>
      <div className="">{children}</div>
    </main>
  );
}
