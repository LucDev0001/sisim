# Sim Sim

Faça a pergunta difícil sem medo de rejeição. **A resposta só aparece se os dois disserem sim.**
Um "não" nunca é revelado — para quem perguntou, é indistinguível de "ainda não respondeu".

## Rodar local

```bash
npm install
npm run dev
```

Sem `DATABASE_URL`, o app usa um banco **em memória** (some ao reiniciar) — ótimo para testar.
Para testar sozinho no mesmo navegador, abra o link da pergunta com `?teste` no final.

## Deploy na Vercel + banco grátis (Neon)

1. Suba este projeto num repositório GitHub e importe na [Vercel](https://vercel.com/new).
2. No projeto da Vercel: **Storage → Create Database → Neon (Postgres)** (plano free).
   A Vercel injeta `DATABASE_URL` automaticamente. (Alternativa: crie em neon.tech e cole a connection string
   em *Settings → Environment Variables* como `DATABASE_URL`.)
3. Faça o deploy. A tabela `questions` é criada sozinha no primeiro acesso — não precisa de migração.

Opcional: `NEXT_PUBLIC_SITE_URL=https://seu-dominio.com` para links absolutos de compartilhamento (OG).

## Privacidade (por design)

- Nenhuma rota devolve a resposta de alguém; só `revealed` quando os dois disseram sim.
- Tokens de dono/convidado são guardados como hash SHA-256.
- Quem usa o link sem o token da primeira resposta recebe uma resposta "isca" neutra (não vaza nada).
- O preview do link (WhatsApp/OG) é genérico — não vaza a pergunta.
- Perguntas expiram em 7 dias.
