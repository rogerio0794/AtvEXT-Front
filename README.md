# QuizTech

Plataforma gamificada de aprendizado para alunos do IFSC. Alunos realizam quizzes, acumulam XP, moedas e conquistas. Professores acompanham desempenho, usuários e avaliações.

---

## Estrutura do Projeto

```
code/
├── src/               # Front-end (React + Vite)
│   └── app/
│       ├── pages/     # 15+ páginas (Dashboard, Quiz, Ranking, etc.)
│       ├── contexts/  # AuthContext (auth via JWT)
│       ├── data/      # seedData.ts — dados iniciais de testes e população do banco de dados com questões iniciais
│       └── routes.ts
└── server/            # Back-end (Node.js + Express + SQLite)
    ├── src/
    │   ├── database/
    │   │   ├── schema.js   # Criação das tabelas
    │   │   ├── seed.js     # Popula o banco (execução única) - dados iniciais de testes e população do banco de dados com questões iniciais
    │   │   └── db.js       # Conexão SQLite
    │   ├── routes/         # Endpoints da API REST
    │   └── index.js        # Entrada do servidor
    └── data/
        └── quiztech.db     # Banco SQLite (gerado automaticamente)
```

---

## Pré-requisitos

- **Node.js** v18 ou superior (recomendado v22)
- **npm** ou **pnpm**

> Se estiver usando `mise`, ative o Node antes: `mise use -g node@22.23.1`

---

## Como Rodar

### 1. Back-end

```bash
cd server

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Edite .env e troque JWT_SECRET por uma string segura

# Iniciar o servidor
npm run dev        # desenvolvimento (nodemon, auto-reload)
```

O servidor sobe em **http://localhost:3001**.

> O `seed` é protegido contra dupla execução — se o banco já tiver dados, o comando é ignorado automaticamente.

---

### 2. Front-end

Em outro terminal, na raiz do projeto:

```bash
# Instalar dependências (usa pnpm)
pnpm install
# ou: npm install

# Iniciar em modo desenvolvimento
pnpm dev
# ou: npx vite
```

O front-end sobe em **http://localhost:5173**.

---

## Ordem de Execução Resumida

```
1. cd server && npm install
2. cp server/.env.example server/.env   # e configure o JWT_SECRET
2. npm run dev           (dentro de server/)  ← back-end rodando
3. pnpm dev              (na raiz)            ← front-end rodando
4. Acesse http://localhost:5173
```

---

## Variáveis de Ambiente (server/.env)

| Variável        | Descrição                              | Padrão                    |
|-----------------|----------------------------------------|---------------------------|
| `PORT`          | Porta do servidor Express              | `3001`                    |
| `JWT_SECRET`    | Chave secreta para assinar tokens JWT  | *(obrigatório trocar)*    |
| `JWT_EXPIRES_IN`| Tempo de expiração do token            | `7d`                      |
| `DB_PATH`       | Caminho do arquivo SQLite              | `./data/quiztech.db`      |
| `NODE_ENV`      | Ambiente (`development`/`production`)  | `development`             |
| `FRONTEND_URL`  | URL do front para configurar o CORS    | `http://localhost:5173`   |

---

## Credenciais de Acesso

### Contas demo (login rápido)

| Perfil    | E-mail                      | Senha          |
|-----------|-----------------------------|----------------|
| Aluno     | `ana@quiztech.com`          | `senha123`     |
| Professor | `professor@quiztech.com`    | `professor123` |


## API — Principais Endpoints

| Método | Rota                    | Descrição                         |
|--------|-------------------------|-----------------------------------|
| POST   | `/api/auth/login`       | Login, retorna JWT                |
| POST   | `/api/auth/register`    | Cadastro de novo usuário          |
| GET    | `/api/users`            | Lista usuários (professor/admin)  |
| GET    | `/api/quizzes`          | Lista quizzes disponíveis         |
| POST   | `/api/attempts`         | Registra tentativa de quiz        |
| GET    | `/api/ranking`          | Ranking global por XP             |
| GET    | `/api/feedbacks`        | Lista avaliações (professor)      |
| POST   | `/api/feedbacks`        | Envia avaliação (aluno)           |
| GET    | `/api/teacher/stats`    | Estatísticas do dashboard         |

---

## Arquitetura de Autenticação

O front-end usa JWT via API REST

| Fluxo               | Como funciona                                                   |
|---------------------|-----------------------------------------------------------------|
| Login / Registro    | `POST /api/auth/login` ou `/api/auth/register` → retorna token |
| Sessão persistente  | Token JWT salvo em `localStorage` (`quiztech_token`)           |
| Restaurar sessão    | Na abertura do app: `GET /api/auth/me` com o token             |
| Avaliações (aluno)  | `GET /api/feedbacks/mine` e `POST /api/feedbacks`              |
| Avaliações (prof.)  | `GET /api/feedbacks?limit=200`                                 |
| Lista de usuários   | `GET /api/users?limit=200`                                     |

> O back-end **precisa estar rodando** para o front-end funcionar. Suba o servidor antes de acessar o app.
