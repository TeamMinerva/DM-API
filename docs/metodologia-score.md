# Score Composto de Potencial de Crédito Sustentável

- [Componentes do score](#componentes-do-score)
- [Normalização](#normalização-z-score--escala-0100)
- [Peso dos componentes](#score-final)

---

# Componentes do Score

### 1. Qualidade da Carteira

Mede a saúde do crédito já existente.

```text
qualidade = 1 - (carteira_inadimplencia / carteira_ativa)
```

* Quanto menor a inadimplência relativa, maior o score.

---

### 2. Solidez dos Ativos

Mede o risco de perdas futuras.

```text
solidez = 1 - (ativo_problematico / carteira_ativa)
```

* Quanto menos ativo problemático relativo, mais sólido.

---

### 3. Eficiência Operacional

Mede o ticket médio (carteira por contrato).

```text
eficiencia = carteira_ativa / numero_de_operacoes
```

* Depois normalizada, indica densidade e maturidade do mercado local.

---

### 4. Dinamismo

Mede o crescimento recente da carteira ativa.

```text
dinamismo = (carteira_ativa_t - carteira_ativa_t-1) / carteira_ativa_t-1
```

* Crescimento relativo, então SP e AP competem igualmente.

---

# Normalização (Z-Score → Escala 0–100)

Cada componente precisa ser normalizado antes de combinar, senão a eficiência (que é em reais) vai dominar o score.

Para cada componente `X`:

```text
z = (X_estado - média(X)) / desvio_padrão(X)
```

Converter para escala `0–100`:

```text
normalizado = (z - z_min) / (z_max - z_min) × 100
```

---

## De Onde Vêm os Valores

### X_estado

É o valor do componente daquele estado específico calculado anteriormente.

Exemplo:

```text
qualidade_MA = 0.73
```

---

### média(X)

É a média do componente entre todos os 27 estados.

```text
média(qualidade) =
(qualidade_SP + qualidade_MG + qualidade_MA + ... ) / 27
```

Você calcula isso uma vez com todos os estados.

---

### desvio_padrão(X)

Mede o quanto os valores variam em torno da média.

```text
desvio =
√( soma((X_estado - média)²) / 27 )
```

---

### z_min e z_max

Depois de calcular o Z-Score de todos os estados:

* `z_min` → menor Z-Score encontrado
* `z_max` → maior Z-Score encontrado

Esses valores servem para transformar os resultados em uma escala de `0 a 100`.

---

# Score Final

```text
score =
(qualidade   × 0.35) +
(solidez     × 0.30) +
(dinamismo   × 0.25) +
(eficiencia  × 0.10)
```

---

## Pesos dos Componentes

| Componente | Peso | Justificativa                                                |
| ---------- | ---- | ------------------------------------------------------------ |
| Qualidade  | 35%  | Saúde atual é o principal indicador de sustentabilidade      |
| Solidez    | 30%  | Risco de perda futura é crítico para crédito sustentável     |
| Dinamismo  | 25%  | Crescimento relativo captura potencial sem favorecer tamanho |
| Eficiência | 10%  | Mercados maduros possuem tickets maiores                     |
