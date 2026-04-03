import { useState } from "react";
import logo from "../assets/dm-logo.png";
import { LayoutGrid } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <aside className="flex h-screen">
      
      <div className="w-28 bg-[#202AD0] rounded-r-[2rem] flex flex-col items-center pt-48 gap-8 z-10">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white pt-10">
          <LayoutGrid size={32} />
        </button>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "w-48 opacity-100" : "w-0 opacity-0"}`}>
        <div className="w-16 h-16 bg-[#2350DE] absolute z-0 top-0 left-16"/>
        <div className="w-16 h-16 bg-[#2350DE] absolute z-0 bottom-0 left-16"/>
        <div className="w-48 h-full bg-[#2350DE] rounded-tr-[2.5rem] rounded-br-[2.5rem] flex flex-col pt-12 text-white">
          <img src={logo} alt="logo da DM" className="w-20 mb-9 self-center" />
          <nav className="flex flex-col gap-9 text-base pt-16">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? "relative bg-[#FBFCF8] text-[#7B7E86] rounded-l-[20px] w-full ml-8 pl-4 py-2 active-nav"
                  : "hover:opacity-80 px-12"
              }>
              Dashboard
            </NavLink>
            <NavLink
              to="/Mercado"
              end
              className={({ isActive }) =>
                isActive
                  ? "relative bg-[#FBFCF8] text-[#7B7E86] rounded-l-[20px] w-full ml-8 pl-4 py-2 active-nav"
                  : "hover:opacity-80 px-12"
              }>
              Mercado
            </NavLink>
            <NavLink
              to="/Risco"
              end
              className={({ isActive }) =>
                isActive
                  ? "relative bg-[#FBFCF8] text-[#7B7E86] rounded-l-[20px] w-full ml-8 pl-4 py-2 active-nav"
                  : "hover:opacity-80 px-12"
              }>
              Risco
            </NavLink>
            <NavLink
              to="/Expansao"
              end
              className={({ isActive }) =>
                isActive
                  ? "relative bg-[#FBFCF8] text-[#7B7E86] rounded-l-[20px] w-full ml-8 pl-4 py-2 active-nav"
                  : "hover:opacity-80 px-12"
              }>
              Expansão
            </NavLink>
          </nav>
        </div>
      </div>
    </aside>
  );
}