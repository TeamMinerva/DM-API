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
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8"> 
              <DashboardMapCard/>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}