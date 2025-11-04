'use client';

import { productsData } from '../../data/products';
import { motion, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '../../components/ProductCard';

export default function ProductPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [fixedA, setFixedA] = useState<boolean[]>(
    Array(productsData.length).fill(false)
  );
  const [fixedB, setFixedB] = useState<boolean[]>(
    Array(productsData.length).fill(false)
  );

  const initialOffsets = productsData.map((_, index) => index * 400);
  const initialStyles = productsData.map((_, index) => {
    const zIndex = productsData.length + index;
    return { transform: `translateY(-${initialOffsets[index]}px)`, zIndex };
  });

  useEffect(() => {
    const unsubscribe = scrollY.on('change', (y) => {
      if (!containerRef.current) return;
      const newFixedA = [...fixedA];
      const newFixedB = [...fixedB];
      const cards = Array.from(containerRef.current.children);

      const containerTop =
        containerRef.current!.getBoundingClientRect().top + window.scrollY;

      cards.forEach((child, index) => {
        const card = child.querySelector('div') as HTMLElement;
        if (!card) return;

        const triggerA = containerTop + index * 80 - 40;
        const triggerB = containerTop + index * 80 - 400;

        // ---- FIX B ---- (замораживаем все последующие карточки)
        if (y >= triggerB && !newFixedB[index]) {
          newFixedB[index] = true;
          card.classList.add('fixB');
          console.log(`🟣 FIXB #${index + 1}`);

          // фиксируем все следующие
          for (let i = index + 1; i < cards.length; i++) {
            const nextCard = cards[i].querySelector('div') as HTMLElement;
            if (!nextCard) continue;
            const top = i * 80 + 400;
            nextCard.style.position = 'fixed';
            nextCard.style.top = `${top}px`;
            nextCard.style.zIndex = `${productsData.length + i}`;
            nextCard.style.width = '800px';
            nextCard.style.transform = 'translateY(0px)';
          }
        } else if (y < triggerB && newFixedB[index]) {
          newFixedB[index] = false;
          card.classList.remove('fixB');
          console.log(`🟠 unFIXB #${index + 1}`);

          // снимаем фикс со всех последующих
          for (let i = index + 1; i < cards.length; i++) {
            const nextCard = cards[i].querySelector('div') as HTMLElement;
            if (!nextCard) continue;
            Object.assign(nextCard.style, initialStyles[i]);
            nextCard.style.position = '';
            nextCard.style.top = '';
            nextCard.style.width = '800px';
          }
        }

        // ---- FIX A ---- (возвращаем следующую карточку)
        if (y >= triggerA && !newFixedA[index]) {
          newFixedA[index] = true;
          card.classList.add('fixA');
          console.log(`📌 FIXA #${index + 1}`);

          const nextIndex = index + 1;
          if (nextIndex < cards.length) {
            const nextCard = cards[nextIndex].querySelector('div') as HTMLElement;
            if (nextCard) {
              Object.assign(nextCard.style, initialStyles[nextIndex]);
              nextCard.style.position = '';
              nextCard.style.top = '';
              nextCard.style.transform = 'translateY(-40px)';
            }
          }
        } else if (y < triggerA && newFixedA[index]) {
          newFixedA[index] = false;
          card.classList.remove('fixA');
          console.log(`↩ unFIXA #${index + 1}`);
        }
      });

      setFixedA(newFixedA);
      setFixedB(newFixedB);
    });

    return () => unsubscribe();
  }, [scrollY, fixedA, fixedB]);

  return (
    <main className="p-10 min-h-screen mt-[300px]">
      <section className="max-w-[900px] mx-auto">
        <div className="flex flex-col gap-5 p-6 mb-20">
          <h2 className="headline-xl-text text-center">драйв простых решений</h2>
          <h3 className="body-mono-xl text-pretty text-center">
            Облако должно быть простым, но не примитивным. Попробуй его
          </h3>
        </div>

        <div ref={containerRef} className="relative w-full">
          {productsData.map((product, index) => {
            const style = fixedA[index]
              ? { position: 'fixed', top: 40, zIndex: 0, width: '800px' }
              : { ...initialStyles[index] };

            return (
              <motion.div key={index} className="w-[800px] h-[480px]">
                <div style={style} className="w-[800px] h-[480px]">
                  <ProductCard product={product} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}