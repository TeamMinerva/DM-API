export default function Topbar() {
  return (
    <header className="flex justify-end gap-3 p-6">
      <button className="px-4 py-1 rounded-full border border-[#202AD0] text-[#202AD0] text-sm hover:bg-[#202AD0] hover:text-white transition">
      Fonte BCB
     </button>

      <button className="px-4 py-1 rounded-full bg-[#202AD0] text-white text-sm">
        Acumulado 2024
      </button>
    </header>
  )
}