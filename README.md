# Arena Lagoa Beach - Frontend

Plataforma web para gestão de torneios de futevôlei, criada para transformar o processo manual de organização dos torneios já realizados de forma manual em uma solução digital rápida, organizada e escalável. Trazendo mais controle, agilidade e profissionalização para a gestão esportiva

A plataforma também incentiva a **competitividade entre atletas**, principalmente através da tela de **ranking**, que exibe desempenho, evolução e posição dos jogadores, estimulando participação contínua e melhora de performance.

---

## 👤 Perfis do Sistema

### 🧑 USER (Atleta)

- Participa de torneios
- Realiza inscrições
- Acompanha partidas e resultados
- Consulta ranking geral
- Acompanha sua evolução competitiva

A experiência é focada em incentivar participação constante e evolução dentro da plataforma.



### 🛠️ ADMIN (Organização)

- Cria e gerencia torneios
- Controla inscrições
- Monta e atualiza partidas
- Atualiza resultados em tempo real
- Gerencia usuários e estrutura geral
- Mantém o ranking atualizado

Responsável por transformar a organização manual em um fluxo digital eficiente.



## 🚀 Quick Start

### Pré-requisitos
- Node.js 20+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-repo/arena-lagoa-beach.git
cd arena-lagoa-beach

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```
### 📁 Estrutura de Pastas

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
### 📦 Stack Tecnológico
React 19
Next.js 16
TypeScript 5
Tailwind CSS 4
shadcn/ui + Radix UI
Axios
Lucide React
Sonner
JWT (JSON Web Token)
ReCAPTCHA v3
Vercel AI SDK

### 🔐 Autenticação
Login gera JWT
Token salvo em localStorage
Requisições usam Bearer Token

### 🔄 Fluxo de autenticação
Usuário realiza login ou cadastro
Backend retorna token JWT
Frontend armazena token, userId e role
Requisições incluem Authorization: Bearer {token}
Rotas privadas validam autenticação
Usuário é redirecionado para /login se inválido

### 👤 Roles
ADMIN
USER

### 🛡️ Rotas Protegidas
(private) controla acesso autenticado
Proteção via HOC ProtecaoRota
Validação de token antes de renderizar páginas privadas

### 📝 Scripts

```bash
npm run dev      # Desenvolvimento
npm run build    # Build de produção
npm start        # Execução em produção
npm run lint     # Lint do projeto
```
## 🤝 Processo de Contribuição
### 🔀 Criação de branch
```bash
git checkout -b feature/nome-da-feature
```
### 💻 Desenvolvimento e commits
```bash
git add .
git commit -m "feat: descrição da feature"
```
### 📤 Envio da branch
```bash
git push origin feature/nome-da-feature
```
### 🔍 Pull Request
```bash
Abrir PR para branch develop
Descrever mudanças feitas
Aguardar review
Ajustar se necessário
```
## 📚 Documentação
```bash
Next.js: https://nextjs.org/docs
React: https://react.dev
TypeScript: https://www.typescriptlang.org/docs
Tailwind CSS: https://tailwindcss.com/docs
shadcn/ui: https://ui.shadcn.com
Axios: https://axios-http.com
```

