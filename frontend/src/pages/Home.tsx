import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import DashboardMapCard from "../features/dashboard/DashboardMapCard"

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#e9e9e9]">
      <Sidebar />
  


      <div className="flex-1">
        <Topbar />

        <main className="p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3">
              <DashboardMapCard />
            </div>

            <div className="w-full lg:w-1/3">
              {/* Outro card */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}