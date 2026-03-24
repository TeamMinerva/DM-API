import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

export default function Expansao() {
  return (
    <div className="flex min-h-screen bg-[#e9e9e9]">
        <Sidebar />
        <h1>Expansão: Página em construção.</h1>

      <div className="flex-1">
        <Topbar />

        <main className="px-8 pb-8">
            <div className="h-[500px] rounded-2xl bg-transparent" />


        </main>
      </div>
    </div>
  )
}