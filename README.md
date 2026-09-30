# Letterboxd Backend

Backend completo de um site de avaliação de filmes e séries usando Node.js, Express e PostgreSQL.

## Estrutura

```text
backend/
├── database/
│   └── letterboxd.sql
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controller/
│   │   ├── avaliacaoController.js
│   │   ├── tituloController.js
│   │   └── usuarioController.js
│   ├── repository/
│   │   ├── avaliacaoRepository.js
│   │   ├── tituloRepository.js
│   │   └── usuarioRepository.js
│   ├── routes/
│   │   ├── avaliacaoRoutes.js
│   │   ├── tituloRoutes.js
│   │   └── usuarioRoutes.js
│   ├── service/
│   │   ├── avaliacaoService.js
│   │   ├── tituloService.js
│   │   └── usuarioService.js
│   └── server/
│       ├── app.js
│       └── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Instalação

1. Crie o banco `Letterboxd` no PostgreSQL.
2. Execute `database/letterboxd.sql` no pgAdmin.
3. Confira o `.env`:

```env
DB_HOST=localhost
DB_USER=postgres
DB_NAME=Letterboxd
DB_PORT=5432
DB_PASSWORD=senai
PORT=3000
```

4. No terminal, dentro de `backend`:

```bash
npm install
npm start
```

Servidor: `http://localhost:3000`

## Endpoints CRUD

### Usuários

| Método | Rota | Descrição |
|---|---|---|
| POST | /api/login | Faz login com e-mail e senha |

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/usuarios | Lista usuários |
| GET | /api/usuarios/:id | Busca usuário |
| POST | /api/usuarios | Cria usuário |
| PUT | /api/usuarios/:id | Atualiza usuário |
| DELETE | /api/usuarios/:id | Remove usuário |

### Filmes e séries

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/titulos | Lista títulos |
| GET | /api/titulos/:id | Busca título |
| POST | /api/titulos | Cria filme/série |
| PUT | /api/titulos/:id | Atualiza filme/série |
| DELETE | /api/titulos/:id | Remove filme/série |
| GET | /api/titulos/:id/avaliacoes | Lista avaliações do título |
| GET | /api/titulos/:id/media | Retorna a média do título |

Filtros em `GET /api/titulos`:
- `?tipo=Filme`
- `?tipo=Serie`
- `?genero=Drama`
- `?busca=Interestelar`

### Avaliações

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/avaliacoes | Lista avaliações com usuário e título |
| GET | /api/avaliacoes/:id | Busca avaliação |
| POST | /api/avaliacoes | Cria avaliação |
| PUT | /api/avaliacoes/:id | Atualiza avaliação |
| DELETE | /api/avaliacoes/:id | Remove avaliação |

## Exemplos de JSON

### POST /api/usuarios

```json
{
  "nome": "Lucas Silva",
  "email": "lucas@email.com",
  "senha": "123456"
}
```

### POST /api/titulos

```json
{
  "nome": "Matrix",
  "genero": "Ficção Científica",
  "tipo": "Filme",
  "ano_lancamento": 1999,
  "sinopse": "Um programador descobre uma realidade diferente da que conhecia."
}
```

### POST /api/avaliacoes

```json
{
  "nota": 5,
  "comentario": "Excelente filme!",
  "id_titulo": 1,
  "id_usuario": 1
}
```

## Observação

O projeto é voltado para a atividade de modelagem de backend. A senha está armazenada diretamente para manter o projeto simples; em um sistema real, ela deve ser armazenada com hash e autenticação.

## Frontend integrado

O frontend está em `public/` e é servido pelo próprio Express. Ele usa HTML, JavaScript e Tailwind CSS e consome as rotas `/api/usuarios`, `/api/titulos` e `/api/avaliacoes`.

Abra `http://localhost:3000` depois de iniciar o servidor.
