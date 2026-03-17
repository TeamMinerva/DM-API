import { useState } from "react"
import logo  from "../assets/logo.png"
import { LayoutGrid, SlidersHorizontal } from "lucide-react"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="flex h-screen">
      <div className="w-28 bg-[#202AD0] rounded-r-[0.5rem] flex flex-col items-center pt-40 gap-8">
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

        <div className="w-40 bg-[#2350DE] color rounded-r-[2rem] flex flex-col pt-20 px-8 text-white ">

          <img src = {logo} alt="logo da DM" className="w-12 mb-12 self-center" />

          <nav className="flex flex-col gap-9 text-base pt-5" >
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