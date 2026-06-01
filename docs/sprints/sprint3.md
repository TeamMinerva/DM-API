# Sprint - 3 🎯

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
<a href="https://www.youtube.com/watch?v=8kruHTAhN28" target="_blank">
  <img src="https://img.youtube.com/vi/8kruHTAhN28/maxresdefault.jpg" width="600">
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
        <td>Baixa</td>
        <td>Como analista da DM Card, quero visualizar um score composto por estado que combine os indicadores de concessão, inadimplência e endividamento, para ter uma visão estratégica do potencial de expansão sustentável de crédito.</td>
        <td>13</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Baixa</td>
        <td>Como analista da DM Card, quero um mapa de calor do Brasil onde cada estado é colorido de acordo com o score de potencial de crédito sustentável, para identificar visualmente quais regiões concentram mais oportunidade.</td>
        <td>13</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Média</td>
        <td>Como analista da DM Card, quero entender quais dados do Banco Central são utilizados e como o índice de potencial é calculado, para validar a metodologia e ter confiança nas análises da plataforma.</td>
        <td>5</td>
    </tr>
</table>

## 🏆 MVP da Sprint
**3️⃣ Sprint 3 – Dashboard e Visualização dos Resultados**

A última sprint foi dedicada à construção da interface de visualização dos dados analisados.

Principais atividades:

- Desenvolvimento do dashboard
- Criação de gráficos para análise dos dados
- Implementação de ranking de regiões
- Integração entre processamento de dados e visualização

Resultado da sprint:

> O sistema apresenta um dashboard funcional que permite visualizar e comparar regiões com base em indicadores de crédito sustentável.

## 📌 DoR e DoD da Sprint

### User Story 1: Score composto por estado

#### ✅ Definition of Ready (DoR)

- Fórmula do score composto definida (pesos de concessão, inadimplência e endividamento)
- Estados e indicadores disponíveis no banco de dados
- Regra de normalização dos indicadores definida (ex: min-max ou z-score)
- Tipo de visualização definido (tabela ou gráfico de barras rankeado)
- Endpoint definido

#### ✅ Definition of Done (DoD)

- Cálculo correto do score composto por estado
- Pesos dos indicadores aplicados conforme metodologia definida
- Visualização funcionando e ordenada por score
- Dados validados contra os indicadores individuais
- Sem erros + código no Git

---

### User Story 2: Mapa de calor do Brasil por score de crédito

#### ✅ Definition of Ready (DoR)

- Score composto calculado e disponível como dependência
- GeoJSON dos estados brasileiros disponível
- Escala de cores e faixas de potencial definidas
- Biblioteca de mapa selecionada (ex: react-leaflet + IBGE GeoJSON)
- Endpoint definido

#### ✅ Definition of Done (DoD)

- Mapa renderizando todos os 27 estados corretamente
- Coloração reflete o score de potencial de crédito sustentável
- Tooltip com nome do estado e valor do score ao passar o cursor
- Escala de legenda visível e coerente com os dados
- Dados validados e sincronizados com o score da US7
- Sem erros + código no Git

---

### User Story 3: Transparência metodológica (fontes e cálculo do índice)

#### ✅ Definition of Ready (DoR)

- Fórmula do índice de potencial descrita e aprovada pelo time
- Formato da seção definido (modal, página dedicada ou painel lateral)

#### ✅ Definition of Done (DoD)

- Seção explicativa acessível a partir do dashboard
- Fontes dos dados listadas com descrição clara (ex: SCR Data — Banco Central)
- Fórmula do índice apresentada de forma legível (texto + equação ou tabela de pesos)
- Conteúdo revisado e aprovado pelo time
- Sem erros + código no Git