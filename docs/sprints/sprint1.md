# Sprint - 1️⃣ 🎯

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
<a href="https://www.youtube.com/watch?v=OOo5zK6X4Dg" target="_blank">
  <img src="https://img.youtube.com/vi/OOo5zK6X4Dg/maxresdefault.jpg" width="600">
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
        <td>Alta</td>
        <td>Como analista da DM Card, quero acessar o dashboard pelo navegador, para consultar os dados de crédito a qualquer momento.</td>
        <td>5</td>
    </tr>
    <tr>
        <td>2</td>
        <td>Alta</td>
        <td>Como analista da DM Card, quero visualizar o painel inicial com os dados nacionais de concessão de crédito, para ter uma visão geral antes de aprofundar a análise regional.</td>
        <td>8</td>
    </tr>
    <tr>
        <td>3</td>
        <td>Alta</td>
        <td>Como analista da DM Card, quero acessar o dashboard em qualquer dispositivo e tamanho de tela sem perda de funcionalidade, para consultar os dados onde estiver.</td>
        <td>5</td>
    </tr>
</table>

## 🏆 MVP da Sprint
**1️⃣ Sprint I: Estrutura do Projeto e Ingestão de Dados**

Nesta sprint foi realizada a criação da estrutura inicial do projeto e a implementação da leitura dos dados.
Principais atividades:
- Configuração do ambiente de desenvolvimento
- Estruturação do repositório e organização das pastas
- Implementação da leitura de arquivos CSV
- Tratamento inicial dos dados

> Resultado da sprint: O sistema consegue importar e preparar os dados para análise.

## 📌 DoR e DoD da Sprint
### User Story 1: Acessar o dashboard pelo navegador

#### ✅ Definition of Ready (DoR)
- Objetivo da funcionalidade está claro (acesso via navegador)
- Tecnologias escolhidas (ex: frontend + backend)
- Dependências identificadas (backend rodando, dados disponíveis)
#### ✅ Definition of Done (DoD)
- Dashboard acessível via navegador
- Página carrega sem erros
- Integração com backend funcionando
- Tempo de carregamento aceitável (< 3s para MVP)
- Testado em pelo menos 1 navegador (Chrome, por exemplo)
- Código versionado no Git
- Sem erros críticos no console
---

### User Story 2: Visualizar painel inicial com dados nacionais

#### ✅ Definition of Ready (DoR)
- Indicadores nacionais definidos (ex: total de operações, carteira total)
- Fonte de dados definida
- Estrutura dos dados conhecida (colunas, formatos)
- Layout básico do dashboard definido (wireframe simples)
- Tipo de visualização definido (cards, KPIs, etc.)
- Endpoint/backend disponível ou planejado
#### ✅ Definition of Done (DoD)
- Indicadores nacionais calculados corretamente
- Dados exibidos no dashboard (cards ou gráficos)
- Valores formatados (ex: bilhões, milhões)
- Integração frontend + backend funcionando
- Dados atualizam corretamente ao carregar a página
- Código organizado e reutilizável
- Testado manualmente (valores conferidos)
---

### User Story 3: Dashboard responsivo (qualquer dispositivo)

#### ✅ Definition of Ready (DoR)
- Layout base já implementado (User Story 1 e 2)
- Ferramenta de responsividade definida (CSS, Tailwind, etc.)
- Componentes principais já identificados
- Critérios de responsividade definidos (ex: não quebrar layout)
#### ✅ Definition of Done (DoD)
- Layout adapta para diferentes tamanhos de tela
- Elementos não sobrepõem ou quebram
- Texto permanece legível em telas menores
- Gráficos/cards se reorganizam corretamente
- Sem scroll horizontal indesejado
- Experiência utilizável (mesmo que não perfeita no MVP)