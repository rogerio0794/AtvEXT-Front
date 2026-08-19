# QuizTech

Plataforma gamificada de aprendizado para alunos do IFSC. Alunos realizam quizzes, acumulam XP, moedas e conquistas. Professores acompanham desempenho, usuários e avaliações.

---

## Estrutura do Projeto

```
code/
├── src/               # Front-end (React + Vite)
│   └── app/
│       ├── pages/     # 15+ páginas (Dashboard, Quiz, Ranking, etc.)
│       ├── contexts/  # AuthContext (auth via localStorage)
│       ├── data/      # seedData.ts — dados iniciais do localStorage
│       └── routes.ts
└── server/            # Back-end (Node.js + Express + SQLite)
    ├── src/
    │   ├── database/
    │   │   ├── schema.js   # Criação das tabelas
    │   │   ├── seed.js     # Popula o banco (execução única)
    │   │   └── db.js       # Conexão SQLite
    │   ├── routes/         # Endpoints da API REST
    │   └── index.js        # Entrada do servidor
    └── data/
        └── quiztech.db     # Banco SQLite
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
cp .env.example .env
# Edite .env e troque JWT_SECRET por uma string segura

# Iniciar o servidor
npm run dev        # desenvolvimento (nodemon, auto-reload)
# ou
npm start          # produção
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
4. npm run dev           (dentro de server/)  ← back-end rodando
5. pnpm dev              (na raiz)            ← front-end rodando
6. Acesse http://localhost:5173
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

---

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

## Observação sobre Autenticação

O front-end ainda usa **localStorage** para autenticação (não consome a API JWT). 