# Configuração de Deploy na Vercel

## Passo 1: Preparar o Projeto

1. Certifique-se de que o projeto está versionado no Git:
```bash
git init
git add .
git commit -m "Deploy inicial"
```

2. Crie um repositório no GitHub e faça push:
```bash
git remote add origin https://github.com/seu-usuario/seu-repo.git
git branch -M main
git push -u origin main
```

## Passo 2: Deploy na Vercel

### Opção A: Via Interface Web (Recomendado)

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New"** → **"Project"**
3. Importe seu repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Adicione variáveis de ambiente:
   - `VITE_API_URL` = URL do seu backend
   - `GEMINI_API_KEY` = Sua chave do Gemini AI

6. Clique em **"Deploy"**

### Opção B: Via CLI

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Faça login:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Configure variáveis de ambiente:
```bash
vercel env add VITE_API_URL
vercel env add GEMINI_API_KEY
```

5. Deploy para produção:
```bash
vercel --prod
```

## Passo 3: Configurar Variáveis de Ambiente

No painel da Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `VITE_API_URL`: URL do backend (ex: https://api-alianca.onrender.com)
   - `GEMINI_API_KEY`: Sua chave API do Google Gemini

## Passo 4: Atualizar o Código (se necessário)

Se você usa API local, atualize os arquivos de serviço:

```typescript
// services/api.ts ou similar
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## Passo 5: Redeploy Automático

Sempre que fizer push para o GitHub, a Vercel fará deploy automático!

```bash
git add .
git commit -m "Atualização"
git push
```

## URLs Úteis

- Dashboard: https://vercel.com/dashboard
- Documentação: https://vercel.com/docs
- Status: https://vercel-status.com

## Troubleshooting

### Erro de build?
- Verifique logs no dashboard da Vercel
- Teste build local: `npm run build`

### Página em branco?
- Verifique console do navegador
- Certifique-se que `vercel.json` tem o rewrite correto

### API não conecta?
- Verifique variável `VITE_API_URL`
- Configure CORS no backend para aceitar domínio da Vercel
