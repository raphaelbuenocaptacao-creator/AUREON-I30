# AUREON-I30

**30 ideias. 1 melhor oportunidade.**

O AUREON-I30 transforma um tema, mercado, produto, profissão ou problema em 30 caminhos de SaaS. Depois, compara as oportunidades por critérios estratégicos, cria um ranking e gera um prompt técnico completo para construir o produto escolhido.

## Fluxo

`TEMA → 30 IDEIAS → VALIDAR → SCORE → MELHOR OPORTUNIDADE → PROMPT COMPLETO → APP`

## O que já funciona na v1

- Entrada livre por tema.
- Geração imediata de 30 propostas diferentes.
- 7 critérios de validação, totalizando 100 pontos.
- Ranking automático e destaque da melhor oportunidade.
- Filtros: Top 10, MVP rápido e alta recorrência.
- Detalhe de problema, solução, público e monetização.
- Explicação do score por critério.
- Gerador de prompt completo para construção do SaaS.
- Copiar prompt e baixar em TXT.
- Histórico local das buscas.
- Interface responsiva para desktop e celular.
- Manifest para instalação como web app.

## Critérios do I30 Score

- Problema real: 20
- Potencial de receita: 20
- Tamanho do público: 15
- Recorrência: 15
- Facilidade do MVP: 10
- Diferenciação: 10
- Facilidade de vender: 10

> O score da v1 é uma priorização estratégica do motor local do I30. Ele não substitui validação externa de mercado. A próxima camada pode usar IA e dados externos para análise de concorrência, demanda e pricing.

## Arquivos

- `index.html` — estrutura da aplicação
- `styles.css` — design system e responsividade
- `app.js` — motor de ideias, score, ranking, histórico e prompt builder
- `manifest.json` — configuração do web app
- `icon.svg` — identidade do I30

## Próxima evolução

A v2 pode conectar um backend seguro a um modelo de IA para gerar ideias realmente abertas a partir do contexto do usuário e enriquecer a validação com pesquisa de mercado, concorrentes, pricing, TAM aproximado, riscos e evidências. Chaves de API nunca devem ficar expostas no frontend.
