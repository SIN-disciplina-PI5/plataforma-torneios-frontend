🏆 Plataforma de Torneios - Fullstack Web

Bem-vindo ao repositório da Plataforma de Torneios. Recentemente, o projeto passou por uma transição arquitetural significativa para melhor atender aos requisitos de escalabilidade, SEO e performance.

🚀 O Pivot Tecnológico: Expo ➔ Next.js

Originalmente concebido como uma aplicação móvel utilizando Expo (React Native), o projeto foi migrado para uma solução Fullstack Web utilizando Next.js 15 e React.

Esta mudança permite:

Renderização no Lado do Servidor (SSR): Melhor indexação e performance.

Ecossistema Web: Integração nativa com ferramentas de análise e dashboards.

Unificação de Stack: Melhor sincronia com o nosso backend em Node.js e PostgreSQL.

📂 Estrutura de Branches (Importante)

Para manter a integridade do trabalho já realizado, o repositório foi organizado da seguinte forma:

main (Padrão): Contém o novo projeto Next.js. Todo o desenvolvimento atual e futuro será realizado aqui.

producao-mobile: Contém o código legado da aplicação móvel desenvolvida em Expo/React Native. Esta branch serve como documentação e backup da versão mobile estável.

Como aceder à versão anterior (Mobile)?

Se precisar de consultar ou executar o código mobile, utilize:

git checkout producao-mobile


🛠️ Tecnologias Utilizadas (Versão Web)

Frontend: React 19, Next.js 15, Tailwind CSS.

Backend (API): Node.js, Express, Sequelize.

Base de Dados: PostgreSQL (Hosted via Neon/Render).

Segurança: Autenticação via JWT, Middlewares de propriedade de recurso.

Infraestrutura: Docker, Vercel (Frontend), Render (Backend).

⚙️ Como Executar o Projeto

Pré-requisitos

Node.js v20+

PostgreSQL configurado (ou acesso ao NeonDB)

Instalação (Branch Main)

Clone o repositório:

git clone [https://github.com/kaikibarros/plataforma-torneios-frontend.git](https://github.com/kaikibarros/plataforma-torneios-frontend.git)


Instale as dependências:

npm install

Inicie o servidor de desenvolvimento:

npm run dev


👥 Equipa e Contribuição

Certifique-se de criar a sua branch a partir da main atualizada
Metodologiad: Ágil (Scrum)

📝 Licença

Este projeto é para fins educativos e de portfólio.