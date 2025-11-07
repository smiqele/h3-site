'use client';

import { productsData } from '../../data/products';
import { useEffect, useRef, useState } from 'react';
import { ProductCard } from '../../components/ProductCard';
import { motion } from 'framer-motion';


const CARD_HEIGHT = 400;
const CARD_SPACING = 80;
const triggerOffset = 500;

export default function ProductPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fix, setFix] = useState(0);
  const [delta, setDelta] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scroll = window.scrollY;
      const containerTop = containerRef.current.offsetTop;
      const startScroll = containerTop - triggerOffset;
      const newDelta = scroll - startScroll;

      if (newDelta <= 0) {
        setFix(0);
        setDelta(0);
        return;
      }

      const newFix = Math.min(Math.floor(newDelta / CARD_HEIGHT), productsData.length - 1);

      setFix(newFix);
      setDelta(newDelta);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="p-10 min-h-screen mt-[300px]">
      <div className="fixed w-full p-2 bg-gray-100 left-0 bottom-0 z-99 flex items-center justify-end">
        <div className='w-[120px]'>fix: {fix}</div> 
        <div className='w-[120px]'>delta: {delta}</div> 
        <div className='w-[120px]'>scroll: {scrollY}</div>
      </div>
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
          style={{ height: `${productsData.length * 400}px` }}
        >
          {productsData.map((product, index) => {
            let style: React.CSSProperties;

            // вычислим положение карточки относительно окна (в пикселях от верха viewport)
            const scroll = typeof window !== 'undefined' ? window.scrollY : 0;
            const containerTop = containerRef.current ? containerRef.current.offsetTop : 0;
            const cardPageTop = containerTop + index * CARD_HEIGHT; // абсолютная позиция карточки на странице
            const viewportTop = cardPageTop - scroll; // положение карточки относительно верха окна

            if (delta <= 0) {
              // до начала триггера — все absolute (используем spacing как у тебя было)
              style = { position: 'absolute', top: index * CARD_SPACING, zIndex: index };
            } else if (index < fix) {
              // предыдущие карточки:
              // только если карточка дошла до верха + 40, фиксируем её с top:40
              if (viewportTop <= 40) {
                style = { position: 'fixed', top: 40, zIndex: index };
              } else {
                // ещё не дошла до 40px — остаётся на своей абсолютной позиции
                style = { position: 'absolute', top: index * CARD_HEIGHT, zIndex: index };
              }
            } else if (index === fix) {
              // активная карточка остаётся absolute
              style = { position: 'absolute', top: index * CARD_HEIGHT, zIndex: index };
            } else if (index > fix) {
              // последующие карточки — фиксируем ниже (как раньше)
              style = { position: 'fixed', top: CARD_HEIGHT + (index + 1) * CARD_SPACING, zIndex: index };
            } else {
              // запасной случай
              style = { position: 'absolute', top: index * CARD_HEIGHT, zIndex: index };
            }


            return (
              <motion.div key={index} className="w-[1000px] h-[400px]" style={style}>
                <ProductCard product={product} />
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
