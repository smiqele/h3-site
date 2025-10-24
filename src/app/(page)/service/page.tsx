'use client';

import { useState } from 'react';
import AsciiAnimation from '../../components/AsciiAnimation';

type Service = {
  title: string;
  description: string;
  features: string[];
};

const servicesData: Service[] = [
  {
    title: 'Compute',
    description:
      'Гибкие виртуальные машины на базе Intel Xeon 5-го поколения и DDR5. От небольшого сервиса до высоконагруженного кластера',
    features: [
      'От 2 до 1024 ГБ RAM',
      'До 8 GPU (по требованию)',
      'Только сетевые диски с гибким IOPS',
    ],
  },
  {
    title: 'Virtual Private Cloud (VPC)',
    description:
      'Изолированные виртуальные сети с гибкой маршрутизацией, высокой пропускной способностью и прямой связанностью зон',
    features: [
      'Подсети и виртуальные маршрутизаторы',
      'SNAT/DNAT, policy-based маршруты',
      'До 400G на каждый хост',
    ],
  },
  {
    title: 'Object Storage',
    description:
      'Универсальное решение для хранения данных любого объёма: от бэкапов и логов до мультимедиа и аналитических архивов',
    features: [
      'Полная совместимость с S3 API',
      'До 1 Тбит/с суммарной пропускной способности',
      'Множественная репликация',
    ],
  },
  {
    title: 'Managed Databases',
    description:
      'Управляемые базы данных с готовыми кластерами, резервным копированием и возможностью тонкой настройки',
    features: [
      'Поддержка 6 движков: Postgres, MariaDB, Redis, ClickHouse, MongoDB, OpenSearch',
      'Режимы: одиночный или кластерный',
      'Автоматические бэкапы и восстановление',
    ],
  },
];

export default function ServicePage() {
  return (
    <main className="p-10 min-h-screen">
      <h1 className="text-xl mb-4 font-semibold">Service Card</h1>

      <section className="max-w-[900px] mx-auto">
        <div className="flex flex-col gap-10 p-6">
          <h2 className="headline-xl-text text-center">почему h3llo.cloud?</h2>
          <h3 className="body-mono-xl text-pretty text-center">
            Виртуальные машины, сети, базы данных и управляемые сервисы для бизнеса любого масштаба.
            Прозрачные цены, SLA и поддержка инженеров 24/7. Без лишнего.
          </h3>
          <h3 className="body-mono-xl2 text-pretty text-center max-w-[680px]">
            Виртуальные машины, сети, базы данных и управляемые сервисы для бизнеса любого масштаба.
            Прозрачные цены, SLA и поддержка инженеров 24/7. Без лишнего.
          </h3>
        </div>

        <div className="flex gap-8 overflow-hidden flex-nowrap">
          {servicesData.map((service) => {
            const [hovered, setHovered] = useState(false);

            return (
              <div
                key={service.title}
                className="relative min-w-96 h-[480px] rounded-md border border-gray-200 p-6 transition overflow-hidden"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <div className="relative h-full flex flex-col z-10">
                  <p className="body-mono-lg block mb-2">
                    <span className="bg-white px-2 box-decoration-clone">{service.title}</span>
                  </p>

                  <p className="body-xl mb-4">
                    <span className="bg-white px-2 box-decoration-clone">
                      {service.description}
                    </span>
                  </p>

                  <div className="flex flex-col grow justify-end">
                    <ul className="flex flex-col gap-1">
                      {service.features.map((feature, i) => (
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

                {/* Анимация всегда рендерится */}
                <div className="absolute top-0 left-0 w-full h-full z-0">
                  <AsciiAnimation
                    effect="loadEffect"
                    width={400}
                    height={480}
                    block={24}
                    speed={0.5}
                    back="#ffff"
                    active={hovered} // управление эффектом внутри компонента
                    style={{ borderRadius: '8px' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
