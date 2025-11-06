'use client';

import { productsData } from '../../data/products';
import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { motion } from 'framer-motion';

const SPACING = 80;

export default function ProductPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [fixedCards, setFixedCards] = useState<boolean[]>(Array(productsData.length).fill(false));

  // Исходные стили через absolute
  const initialStyles = productsData.map((_, index) => {
    const offset = index * SPACING;
    const zIndex = productsData.length + index;
    return { position: 'absolute', top: `${offset}px`, zIndex };
  });

  useEffect(() => {
    const triggerOffset = 500; // старт триггеров

    const handleScroll = () => {
      if (!containerRef.current) return;

      // Абсолютное смещение контейнера относительно начала страницы
      const scroll = window.scrollY;
      const containerTop = containerRef.current.offsetTop;

      const startScroll = containerTop - triggerOffset; // момент, когда начинаем фиксацию

      setFixedCards((prev) => {
        const newFixed = [...prev];

        if (scroll < startScroll) {
          // ещё не дошли до trigger500 — всё в абсолют
          return newFixed.map(() => false);
        }

        // сколько пикселей проскроллено от trigger500
        const delta = scroll - startScroll;

        productsData.forEach((_, index) => {
          if (index === 0) {
            // первая фиксируется при delta >= 460
            newFixed[index] = delta >= index * SPACING + 460;
          } else {
            // остальные фиксируются при delta >= 100
            newFixed[index] = delta >= 100;
          }
        });

        return newFixed;
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="p-10 min-h-screen mt-[300px]">
      <section className="max-w-[1000px] mx-auto">
        <div className="flex flex-col gap-5 p-6 mb-20">
          <h2 className="headline-xl-text text-center">драйв простых решений</h2>
          <h3 className="body-mono-xl text-pretty text-center">
            Облако должно быть простым, но не примитивным. Попробуй его на вкус.
          </h3>
        </div>

        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: `${productsData.length * SPACING + 600}px` }}
        >
          {productsData.map((product, index) => {
            const style = fixedCards[index]
              ? {
                  position: 'fixed',
                  top: index === 0 ? 40 : 400 + index * SPACING,
                  zIndex: productsData.length + index,
                }
              : { ...initialStyles[index] };

            return (
              <motion.div key={index} className="w-[1000px] h-[480px]" style={style}>
                <ProductCard product={product} />
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
