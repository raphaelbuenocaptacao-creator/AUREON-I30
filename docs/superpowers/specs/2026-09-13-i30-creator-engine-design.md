# I30 Creator Engine — Design

## Objetivo

Evoluir o I30 de um gerador especializado em 30 ideias de SaaS para uma central de criação que transforma uma ideia inicial em diferentes entregáveis úteis, sem perder o módulo atual de 30 oportunidades, validação e score.

O I30 deve continuar sendo um produto independente da home da AUREON. A home apresenta a proposta e leva o usuário para o I30; o I30 executa a criação de verdade.

## Princípios

- O nome do produto é **I30** até decisão explícita em contrário.
- Não mostrar resultados fictícios, progresso falso ou ações que aparentem executar algo que não executam.
- Nenhuma chave de API privada pode ficar exposta no frontend.
- Mobile-first e PWA continuam obrigatórios.
- O fluxo atual de **30 ideias de SaaS + score + melhor oportunidade + prompt completo** permanece funcional como um dos módulos.
- Cada criação deve poder ser copiada e persistida no histórico local.
- O produto deve continuar útil sem backend: a primeira evolução pode gerar entregáveis estruturados localmente; uma camada de IA pode enriquecer os resultados quando houver backend seguro.

## Fluxo principal

1. O usuário abre o I30 e vê a promessa: **“Você tem uma ideia? O I30 transforma.”**
2. Digita uma ideia, tema, negócio, problema ou objetivo em linguagem natural.
3. O I30 exibe os formatos disponíveis para transformar essa ideia.
4. O usuário escolhe um formato.
5. O I30 gera um resultado real e editável/copiável a partir da entrada.
6. O resultado fica salvo no histórico, junto com tipo, entrada, data e conteúdo gerado.
7. O usuário pode voltar à mesma ideia e transformá-la em outro formato sem redigitar tudo.

## Formatos de criação da primeira versão

### Post
Entrega título/gancho, texto principal, CTA e sugestões de hashtags.

### Roteiro de Reels/TikTok
Entrega gancho inicial, sequência de cenas, narração/falas, texto de tela, CTA e legenda sugerida.

### Vídeo
Enquanto não existir um provedor real de renderização conectado, “Vídeo” significa um **pacote de produção de vídeo**: conceito, duração, cenas, enquadramentos, narração, textos de tela, trilha/clima, CTA e prompt final para geração/renderização em ferramenta compatível. O I30 não deve afirmar que criou um MP4 se não criou.

### Prompt
Entrega um prompt completo, contextualizado e organizado para uso em uma IA, incluindo objetivo, contexto, restrições, formato de saída e critérios de qualidade.

### Nome / Marca
Entrega opções de nome, posicionamento, slogan curto e justificativa de cada direção sugerida.

### Oferta
Entrega público, problema, promessa, mecanismo, benefícios, objeções, bônus, CTA e estrutura de oferta.

### Anúncio
Entrega gancho, headline, corpo, CTA e variações curtas para mídia paga/social.

### Página de venda
Entrega estrutura da página em seções: hero, problema, solução, benefícios, prova, oferta, objeções, FAQ e CTA.

### Ideia de aplicativo
Entrega problema, público, proposta de valor, funcionalidades essenciais, MVP, modelo de receita e prompt técnico inicial.

### 30 ideias de SaaS
Preserva o motor atual: 30 oportunidades, sete critérios, score de 0–100, filtros, ranking, melhor oportunidade e geração de prompt completo.

### Plano de conteúdo
Entrega pilares, calendário inicial, ideias de posts, vídeos e CTAs para o período selecionado na interface.

### Estratégia de lançamento
Entrega objetivo, público, pré-lançamento, lançamento, canais, conteúdos, CTA, métricas e próximos passos.

## Arquitetura de interface

A tela inicial deixa de abrir diretamente no fluxo “30 ideias”. Ela passa a ter três blocos claros:

1. **Entrada da ideia** — campo principal com exemplos e CTA.
2. **Escolha do formato** — grade de módulos de criação.
3. **Workspace de resultado** — conteúdo gerado, ações de copiar, baixar quando fizer sentido, criar outro formato e voltar ao histórico.

O módulo “30 ideias de SaaS” abre o workspace existente, mantendo ranking, filtros, painel vencedor e prompt completo.

## Arquitetura de código

O código deve separar responsabilidades para evitar transformar `app.js` em um arquivo ainda maior.

- `app.js`: inicialização, roteamento leve da interface e compatibilidade com o fluxo legado.
- `creator/catalog.js`: catálogo dos tipos de criação, metadados e rótulos.
- `creator/generators.js`: geradores locais determinísticos por tipo.
- `creator/templates.js`: estruturas e modelos reutilizáveis dos resultados.
- `creator/history.js`: leitura, gravação e migração do histórico local.
- `creator/ui.js`: renderização da grade de módulos e workspace de resultado.
- `creator/ai-adapter.js`: interface opcional para backend de IA; nunca contém chave privada.
- fluxo atual de 30 SaaS: preservado e chamado pelo catálogo como módulo especializado.

A interface entre geradores deve ser uniforme:

```js
generateCreation({ type, idea, context }) => {
  id,
  type,
  idea,
  title,
  sections,
  plainText,
  createdAt,
  source
}
```

`source` aceita `local` ou `ai`. Isso permite adicionar backend seguro posteriormente sem alterar a interface principal.

## Histórico e dados

Cada item salvo deve conter:

```js
{
  id: string,
  type: string,
  idea: string,
  title: string,
  sections: Array<{ heading: string, content: string }>,
  plainText: string,
  createdAt: string,
  source: 'local' | 'ai'
}
```

O histórico atual das buscas de SaaS deve continuar legível. Se o formato existente for diferente, `creator/history.js` fará migração não destrutiva ou leitura compatível. Nunca apagar histórico existente automaticamente.

## Camada de IA

A versão inicial não depende obrigatoriamente de uma API externa para funcionar. Os geradores locais garantem que todos os botões produzam um resultado real.

Quando uma camada de IA for ativada, o frontend chamará apenas um endpoint seguro, por exemplo `/api/i30/generate`, enviando `type`, `idea` e contexto. Credenciais do provedor permanecem no servidor. Se o backend falhar, o I30 deve informar o erro e permitir usar a geração local; não deve inventar resposta de IA.

## Integração com a home AUREON

A home da AUREON terá uma seção destacada para o I30 com a mensagem **“Você tem uma ideia? O I30 transforma.”** e exemplos dos formatos que ele cria.

O CTA principal abre o I30 completo. Se o usuário escrever uma ideia na home, ela poderá ser transportada por query string segura, por exemplo `?idea=...`, sem dados sensíveis, e o I30 pré-preenche o campo. A home não duplica o motor do I30.

## Segurança e privacidade

- Não persistir senhas, tokens ou segredos no histórico.
- Limitar comprimento das entradas e tratar conteúdo como texto, evitando injeção de HTML.
- Não usar `innerHTML` com entrada do usuário sem sanitização.
- Service worker não deve cachear rotas privadas, tokens, respostas autenticadas ou endpoints futuros de IA.
- O backend futuro deve aplicar limite de requisições, validação de payload e autenticação quando houver contas.

## Offline / PWA

A geração local, catálogo, histórico e módulo atual de 30 SaaS continuam disponíveis offline depois que o shell estiver cacheado. Recursos que exigirem IA devem indicar claramente quando a conexão/backend não estiver disponível.

O service worker deve usar versionamento explícito de cache quando os arquivos do creator forem adicionados, para impedir shell antigo após atualização.

## Tratamento de erros

- Ideia vazia: bloquear geração e orientar o usuário a descrever o que quer criar.
- Entrada longa demais: informar o limite sem descartar o texto já digitado.
- Tipo desconhecido: não gerar; retornar ao catálogo com mensagem legível.
- Falha de histórico/localStorage: manter o resultado na tela e avisar que não foi possível salvar.
- Falha de IA: oferecer geração local quando aplicável.
- Falha offline: manter os módulos locais funcionais.

## Testes de aceitação

A evolução só pode ser considerada pronta quando houver evidência para estes comportamentos:

1. O usuário digita uma ideia e vê todos os formatos da primeira versão.
2. Cada formato gera conteúdo real relacionado à ideia.
3. O botão de copiar copia o resultado completo.
4. O histórico registra e reabre uma criação.
5. O módulo “30 ideias de SaaS” continua gerando 30 itens e mantendo score/ranking.
6. O I30 funciona e navega corretamente em viewport móvel.
7. A PWA instala e o shell local abre offline.
8. Nenhum segredo ou chave privada aparece no frontend.
9. “Vídeo” não afirma renderizar vídeo real sem um provedor de renderização conectado.
10. Uma ideia enviada pela home AUREON via query string pré-preenche o I30 sem executar automaticamente conteúdo não solicitado.

## Rollout

A implementação deve ser incremental:

1. Catálogo + workspace + geradores locais + histórico compatível.
2. Reencaixe do módulo atual de 30 SaaS no catálogo.
3. Atualização PWA/cache e testes mobile/offline.
4. Integração da home AUREON com CTA e pré-preenchimento opcional.
5. Somente depois, backend de IA seguro e eventuais provedores de criação/renderização de mídia.

Essa ordem mantém o produto utilizável em cada etapa e evita depender de integrações externas para entregar valor.