# QuizTech API

Backend REST para a plataforma QuizTech — Node.js + Express + SQLite.

## Como rodar

```bash
cd server
npm install
npm run dev       # inicia em modo desenvolvimento (nodemon)
# ou
npm start         # produção
```

A API sobe em `http://localhost:3001`.

## Usuários de teste

| Email | Senha | Perfil |
|---|---|---|
| ana@quiztech.com | senha123 | Aluna |
| professor@quiztech.com | professor123 | Professor |
| admin@quiztech.com | admin123 | Admin |

## Rotas disponíveis

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| POST | /api/auth/register | Cadastrar novo usuário |
| POST | /api/auth/login | Login (retorna JWT) |
| GET | /api/auth/me | Dados do usuário logado |
| POST | /api/auth/logout | Logout |

### Usuários
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/users | professor/admin |
| GET | /api/users/:id | próprio ou professor/admin |
| PUT | /api/users/:id | próprio ou admin |
| PUT | /api/users/:id/password | próprio |
| DELETE | /api/users/:id | admin |

### Categorias
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/categories | todos (autenticados) |
| GET | /api/categories/:id | todos |
| POST | /api/categories | professor/admin |
| PUT | /api/categories/:id | professor/admin |
| DELETE | /api/categories/:id | admin |

### Quizzes
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/quizzes | todos |
| GET | /api/quizzes/:id | todos |
| POST | /api/quizzes | professor/admin |
| PUT | /api/quizzes/:id | professor/admin |
| DELETE | /api/quizzes/:id | professor/admin |

### Questões
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/questions?quiz_id= | professor/admin |
| GET | /api/questions/:id | professor/admin |
| POST | /api/questions | professor/admin |
| PUT | /api/questions/:id | professor/admin |
| DELETE | /api/questions/:id | professor/admin |

### Tentativas de Quiz (Submissão de respostas)
| Método | Rota | Acesso |
|---|---|---|
| POST | /api/attempts | alunos |
| GET | /api/attempts | próprio |
| GET | /api/attempts/:id | próprio |

### Conquistas
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/achievements | todos |
| GET | /api/achievements/user/:userId | próprio ou professor/admin |

### Missões
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/missions | todos |
| GET | /api/missions/weekly | todos |
| GET | /api/missions/history | todos |

### Ranking
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/ranking | todos |
| GET | /api/ranking/category/:id | todos |

### Notificações
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/notifications | todos |
| PUT | /api/notifications/:id/read | todos |
| PUT | /api/notifications/read-all | todos |
| DELETE | /api/notifications/:id | todos |

### Área do Professor
| Método | Rota | Acesso |
|---|---|---|
| GET | /api/teacher/stats | professor/admin |
| GET | /api/teacher/reports | professor/admin |

## Autenticação

Todas as rotas (exceto /auth/login e /auth/register) exigem token JWT no header:

```
Authorization: Bearer <token>
```

## Variáveis de ambiente (.env)

```
PORT=3001
JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d
DB_PATH=./data/quiztech.db
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
