import AsciiAnimation from '../../components/AsciiAnimation';

export default function AsciiPage() {
  return (
    <main className="p-10 min-h-screen bg-[#0b0b0b] text-gray-200">
      <h1 className="text-xl mb-4 font-semibold">ASCII Animation Demo</h1>
      <AsciiAnimation effect="loadEffect" trigger="hover" speed={0.4} width={380} height={480} />
    </main>
  );
}
