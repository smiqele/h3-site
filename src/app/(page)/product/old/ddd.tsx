{/* Стопка карточек */}
        <div ref={containerRef} className="relative w-full h-[500px]">
          {productsData.map((product, index) => {
            const offset = index * 40; // сдвиг вверх на 40px для каждой следующей
            const zIndex = productsData.length - index;

            return (
              <motion.div
                key={product.title}
                style={{
                  bottom: `${offset}px`,
                  zIndex,
                }}
                className="absolute left-1/2 -translate-x-1/2 w-[400px] h-[120px] rounded-md border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="relative h-full flex flex-col justify-center px-6 z-10">
                  <p className="body-mono-lg font-semibold block text-center">
                    <span className="bg-white px-2 box-decoration-clone">{product.title}</span>
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>







<div className="flex flex-col">
          {productsData.map((product) => {
            return (
              <div
                key={product.title}
                className="opacity-0 relative min-w-96 h-[480px] rounded-md border border-gray-200 p-6 transition"
              >
                <div className="relative h-full w-[400px] pb-10 flex flex-col z-10">
                  <p className="body-mono-lg font-semibold block mb-2">
                    <span className="bg-white px-2 box-decoration-clone">{product.title}</span>
                  </p>

                  <p className="body-xl mb-4">
                    <span className="bg-white px-2 box-decoration-clone">
                      {product.description}
                    </span>
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
                </div>
              </div>
            );
          })}
        </div>