export type Product = {
  title: string;
  description: string;
  features: string[];
  gif: string;
};

export const productsData: Product[] = [
  {
    title: 'compute',
    description:
      'Гибкие виртуальные машины на базе Intel Xeon 5-го поколения и DDR5. От небольшого сервиса до высоконагруженного кластера',
    features: [
      'От 2 до 1024 ГБ RAM',
      'До 8 GPU (по требованию)',
      'Только сетевые диски с гибким IOPS',
    ],
    gif: '/bug.gif',
  },
  {
    title: 'virtual Private Cloud',
    description:
      'Изолированные виртуальные сети с гибкой маршрутизацией, высокой пропускной способностью и прямой связанностью зон',
    features: ['Подсети и маршрутизаторы', 'SNAT/DNAT', 'До 400G на каждый хост'],
    gif: '/bug.gif',
  },
  {
    title: 'object storage',
    description:
      'Универсальное решение для хранения данных любого объёма: от бэкапов и логов до мультимедиа и аналитических архивов',
    features: ['S3 API', '1 Тбит/с пропускной способности', 'Множественная репликация'],
    gif: '/bug.gif',
  },
  {
    title: 'managed databases',
    description:
      'Управляемые базы данных с готовыми кластерами, резервным копированием и возможностью тонкой настройки',
    features: ['6 движков', 'Кластерный режим', 'Автобэкапы'],
    gif: '/bug.gif',
  },
];
