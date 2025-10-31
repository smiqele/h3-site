'use client';

import { productsData } from '../../data/products';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function productPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main className="p-10 min-h-screen">
      <h1 className="text-xl mb-4 font-semibold">product Card</h1>

      <section className="max-w-[900px] mx-auto">
        <div className="flex flex-col gap-5 p-6 mb-20">
          <h2 className="headline-xl-text text-center">драйв простых решений</h2>
          <h3 className="body-mono-xl text-pretty text-center">
            Облако должно быть простым, но не примитивным. Попробуй его
          </h3>
        </div>

        {/* Стопка карточек */}
        <div ref={containerRef} className="relative w-full h-[1000px]">
          {[...productsData].reverse().map((product, index) => {
            const offset = index * 80; // сдвиг вверх
            const zIndex = productsData.length - index;

            return (
              <motion.div
                key={product.title}
                style={{
                  bottom: `${offset}px`,
                  zIndex,
                }}
                className="absolute left-1/2 -translate-x-1/2 w-[1024px] h-[480px] rounded-sm border border-gray-200 bg-white transition-all duration-300 p-8"
              >
                <p className="body-mono-lg font-semibold block mb-5">
                  <span className="bg-white px-2 box-decoration-clone">{product.title}</span>
                </p>

                <p className="body-xl mb-4">
                  <span className="bg-white px-2 box-decoration-clone">{product.description}</span>
                </p>

                <div className="flex flex-col grow justify-end">
                  <ul className="flex flex-col gap-1">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className="w-[12px] h-[18px] mt-[3px] bg-white flex justify-center items-center">
                          <span className="w-1 h-1 ms-1 bg-black"></span>
                        </div>

                        <p className="body-md">
                          <span className="bg-white px-2 box-decoration-clone">{feature}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
