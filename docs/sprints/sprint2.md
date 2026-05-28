# Sprint - 2️⃣ 🎯

<p align="center">
  |    
    <a href="#-demonstração-do-sistema"> Demonstração do Sistema </a> |
    <a href="#-backlog-da-sprint"> Backlog da Sprint </a> |
    <a href="#-mvp-da-sprint"> MVP da Sprint </a> |
    <a href="#-dor-e-dod-da-sprint"> DoR e DoD da Sprint </a> |
</p>

## 💻 Demonstração do Sistema
Clique para assistir ao vídeo:

<p align="center">
<a href="https://www.youtube.com/watch?v=dUt9HyrTV-Y" target="_blank">
  <img src="https://img.youtube.com/vi/dUt9HyrTV-Y/maxresdefault.jpg" width="600">
</a>
</p>

## 📝 Backlog da Sprint
<table>
    <tr>
        <th>Rank</th>
        <th>Prioridade</th>
        <th>User Story</th>
        <th>Estimativa</th>
    </tr>
    <tr>
        <td>1</td>
        <td>Média</td>
        <td>Como analista da DM Card, quero ver um gráfico de linha com a evolução dos indicadores ao longo do tempo para o estado selecionado, para entender tendências de crescimento da carteira naquela região.</td>
        <td>8</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Média</td>
        <td>Como analista da DM Card, quero comparar a taxa de inadimplência de múltiplas regiões em gráfico de barras e heatmap, para tomar decisões sobre onde expandir operações de crédito com baixo risco.</td>
        <td>8</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Média</td>
        <td>Como analista da DM Card, quero visualizar o ranking dos estados por volume de carteira ativa, para identificar as regiões com maior concentração de crédito e comparar sua evolução.</td>
        <td>13</td>
    </tr>
</table>

## 🏆 MVP da Sprint
**2️⃣ Sprint 2 – Processamento e Análise de Dados**

Nesta etapa foi desenvolvida a lógica responsável pelo processamento e análise das informações.

Principais atividades:

Implementação da análise dos dados
Cálculo de indicadores de crédito
Agrupamento das informações por região e porte de cliente
Geração de métricas para identificar potencial de expansão de crédito sustentável

> Resultado da sprint: O sistema passa a gerar indicadores que permitem analisar o comportamento do crédito nas diferentes regiões.


## 📌 DoR e DoD da Sprint

### User Story 1: Evolução por estado (linha)

#### ✅ Definition of Ready (DoR)

- Indicador e período definidos
- Dados disponíveis (estado, mês, valor)
- Filtro por estado definido
- Tipo de gráfico (linha) definido
- Endpoint definido

#### ✅ Definition of Done (DoD)

- Query correta por estado e mês
- Gráfico de linha funcionando
- Filtro de estado atualiza dados
- Eixos corretos (tempo x valor)
- Dados validados

---

### User Story 2: Inadimplência por região (barras + heatmap)

#### ✅ Definition of Ready (DoR)

- Fórmula de inadimplência definida
- Regiões mapeadas
- Dados disponíveis
- Visualizações definidas
- Seleção múltipla definida
- Endpoint definido

#### ✅ Definition of Done (DoD)

- Cálculo correto da inadimplência
- Gráfico de barras + heatmap funcionando
- Seleção de regiões funcionando
- Dados atualizam corretamente
- Visual claro e validado
- Sem erros + código no Git

---

### User Story 3: Ranking de estados (carteira ativa)

#### ✅ Definition of Ready (DoR)

- Definição de carteira ativa
- Regra de ordenação definida
- Dados disponíveis
- Tipo de ranking definido
- Endpoint definido

#### ✅ Definition of Done (DoD)

- Cálculo correto por estado
- Ranking ordenado (maior → menor)
- Visualização funcionando
- Dados validados
- Sem inconsistências
- Sem erros + código no Git