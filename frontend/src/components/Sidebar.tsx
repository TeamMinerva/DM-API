import { useState } from "react"
import logo  from "../assets/dm-logo.png"
import { LayoutGrid, SlidersHorizontal } from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="flex h-screen">
      <div className="w-28 bg-[#202AD0] rounded-r-[0.5rem] flex flex-col items-center pt-48 gap-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
         
          className="text-white pt-10"
        >
          <LayoutGrid size={32} />
        </button>

        <button className="text-white">
          <SlidersHorizontal size={32} />
        </button>
      </div>

      {isOpen && (

        <div className="w-48 bg-[#2350DE] color rounded-tr-[2.5rem] rounded-br-[2.5rem] flex flex-col pt-12  px-12  text-white shadow-2xl ">

          <img src = {logo} alt="logo da DM" className="w-20 mb-9 self-center" />

          <nav className="flex flex-col gap-9 text-base pt-16">
            <a href="#" className="hover:opacity-80">Dashboard</a>
            <a href="#" className="hover:opacity-80">Mercado</a>
            <a href="#" className="hover:opacity-80">Risco</a>
            <a href="#" className="hover:opacity-80">Expansão</a>
          </nav>
        </div>
      )}
    </aside>
  )
}