import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import RankingEstadosCard from "../components/RankingEstadosCard";
import { useRankingEstados } from "../hooks/useRankingEstados";

export default function Mercado() {
  const { data, loading, error } = useRankingEstados();

  return (
    <div className="flex min-h-screen bg-[#FBFCF8]">
      <Sidebar />

      <div className="flex-1">
        <Topbar />

        <main className="p-8">

          <section className="mb-8">
            <h1 className="text-4xl text-[#1E1E1E]">
              Mercado de Crédito
            </h1>

            <p className="mt-4 text-[18px] text-[#7B7E86] font-medium">
              Crescimento e concentração da carteira ativa por estado
            </p>
          </section>

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {loading ? (
            <div>Carregando...</div>
          ) : (
            <RankingEstadosCard estados={data} />
          )}

        </main>
      </div>
    </div>
  );
}