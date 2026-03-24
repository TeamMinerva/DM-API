import BrazilMap from "../components/maps/BrazilMap"
import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#e9e9e9]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <div>
              < BrazilMap/>
          </div>
        </main>
      </div>
    </div>
  )
}