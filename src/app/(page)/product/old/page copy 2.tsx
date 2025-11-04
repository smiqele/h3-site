'use client';

import { productsData } from '../../data/products';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function ProductPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  return (
    <main className="p-10 min-h-screen mt-[800px]">
      <section className="max-w-[900px] mx-auto">
        <div className="flex flex-col gap-5 p-6 mb-20">
          <h2 className="headline-xl-text text-center">драйв простых решений</h2>
          <h3 className="body-mono-xl text-pretty text-center">
            Облако должно быть простым, но не примитивным. Попробуй его
          </h3>
        </div>

        {/* Стопка карточек */}
        <div ref={containerRef} className="relative w-full h-[1000px] mt-[200px]">
          {productsData.map((product, index) => {
            // теперь первая в массиве (верхняя в UI) двигается первой
            const offset = index * 80;
            const zIndex = productsData.length + index;

            // диапазон движения: первая двигается с 0 до 400, вторая — 400–800 и т.д.
            const start = index * 400;
            const end = start + 400;

            const rawY = useTransform(scrollY, [start, start + 400], [0, -400]);
            const y = useSpring(rawY, { stiffness: 2000, damping: 0 });

            return (
              <motion.div
                key={product.title}
                style={{
                  top: `${offset}px`,
                  zIndex,
                  y,
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

                <img
                  src={product.gif}
                  alt={product.title}
                  className="absolute right-0 top-5 w-[300px] h-[300px] object-contain pointer-events-none"
                />
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
