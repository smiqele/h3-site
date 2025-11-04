'use client';

import type { Product } from '../data/products';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="relative w-full h-full p-8 rounded-sm border border-gray-200 bg-white">
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
    </div>
  );
}