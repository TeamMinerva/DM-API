export default function Topbar() {
  const ano = new Date().getFullYear() - 1
  return (
    <header className="flex justify-end gap-3 p-6">
      <button className="px-4 py-1 rounded-full border border-[#2350DE] text-[#2350DE] text-base hover:bg-[#2350DE] hover:text-white transition">
      Fonte BCB
     </button>

      <button className="px-4 py-1 rounded-full bg-[#2350DE] text-white text-base">
        Acumulado {ano}
      </button>
    </header>
  )
}