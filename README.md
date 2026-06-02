# 🏆 Plataforma de Torneios - Fullstack Web

## Arena Lagoa Beach - Frontend

Bem-vindo ao repositório da Plataforma de Torneios. 

Plataforma web para gestão de torneios de futevôlei, criada para transformar o processo manual de organização dos torneios já realizados de forma manual em uma solução digital rápida, organizada e escalável. Trazendo mais controle, agilidade e profissionalização para a gestão esportiva.

A plataforma também incentiva a **competitividade entre atletas**, principalmente através da tela de ranking, que exibe desempenho, evolução e posição dos jogadores, estimulando participação contínua e melhora de performance.

## 🚀 O Pivot Tecnológico: Expo ➔ Next.js

Originalmente concebido como uma aplicação móvel utilizando Expo (React Native), o projeto foi migrado para uma solução Fullstack Web utilizando Next.js 15 e React.

Esta mudança permite:
- **Renderização no Lado do Servidor (SSR):** Melhor indexação e performance.
- **Ecossistema Web:** Integração nativa com ferramentas de análise e dashboards.
- **Unificação de Stack:** Melhor sincronia com o nosso backend em Node.js e PostgreSQL.

---

### 📂 Estrutura de Branches 

Para manter a integridade do trabalho já realizado, o repositório foi organizado da seguinte forma:

* **`main` (Padrão):** Contém o novo projeto Next.js. Todo o desenvolvimento atual e futuro será realizado aqui.
* **`producao-mobile`:** Contém o código legado da aplicação móvel desenvolvida em Expo/React Native. Esta branch serve como documentação e backup da versão mobile estável.

### Como aceder à versão anterior (Mobile)?

Se precisar de consultar ou executar o código mobile, utilize:

```bash
git checkout producao-mobile
```

### 👤 Perfis do Sistema
### 🧑 USER (Atleta)

- Participa de torneios

- Realiza inscrições

- Acompanha partidas e resultados

- Consulta ranking geral

- Acompanha sua evolução competitiva

### 🛠️ ADMIN (Organização)
- Cria e gerencia torneios

- Controla inscrições

- Monta e atualiza partidas

- Atualiza resultados em tempo real

- Gerencia usuários e estrutura geral

- Mantém o ranking atualizado

---

## 🚀 Quick Start
Pré-requisitos: 

- Node.js v20+

- PostgreSQL configurado (ou acesso ao NeonDB)

### Instalação (Branch Main)
```bash
# Clone o repositório
git clone [https://github.com/kaikibarros/plataforma-torneios-frontend.git](https://github.com/kaikibarros/plataforma-torneios-frontend.git)
cd plataforma-torneios-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

###  📁 Estrutura de Pastas

```bash
arena-lagoa-beach/
├── app/
│   ├── (public)/
│   ├── (private)/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── auth/
│   ├── admin/
│   ├── chatbot/
│   ├── navbar/
│   └── sidebar/
├── lib/
├── public/
├── package.json
└── ...
```

###  🛠️ Tecnologias Utilizadas (Versão Web)
- Frontend: React 19, Next.js 15, TypeScript 5, Tailwind CSS 4, shadcn/ui + Radix UI

- Backend (API): Node.js, Express, Sequelize

- Base de Dados: PostgreSQL (Hosted via Neon/Render)

- Autenticação: JWT (JSON Web Token)

- Infraestrutura: Docker, Vercel (Frontend), Render (Backend)
  
- Outros: Axios, Lucide React, Sonner, ReCAPTCHA v3, Vercel AI SDK

### 🔐 Autenticação e Segurança

- Fluxo: Login gera JWT -> Salvo em localStorage -> Requisições incluem Authorization: Bearer {token}.

- Roles: ADMIN, USER.

- Rotas Protegidas: O diretório (private) controla acesso autenticado via HOC ProtecaoRota, validando o token antes de renderizar páginas privadas.

### 📝 Scripts
```bash
npm run dev       # Desenvolvimento
npm run build     # Build de produção
npm start         # Execução em produção
npm run lint      # Lint do projeto
```
## 🤝 Processo de Contribuição
### 1. Criação de branch
```bash
git checkout -b feature/nome-da-feature
```
### 2. Desenvolvimento e commits
```bash
git add .
git commit -m "feat: descrição da feature"
```
### 3. Envio da branch
```bash
git push origin feature/nome-da-feature
```
### 4. Pull Request
- Abrir PR para branch develop.
- Descrever mudanças feitas.
- Aguardar review.
- Ajustar se necessário.

## 📚 Documentação
- Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)
  
- React: [https://react.dev](https://react.dev)
  
- TypeScript: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)
  
- Tailwind CSS: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
  
- shadcn/ui: [https://ui.shadcn.com](https://ui.shadcn.com)
  
- Axios: [https://axios-http.com](https://axios-http.com)
