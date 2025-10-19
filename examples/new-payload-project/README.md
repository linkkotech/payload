# New Payload Project

Projeto minimalista de exemplo usando Payload CMS.

Pré-requisitos:
- Node 18+ (recomendado)
- MongoDB rodando localmente ou uma URI de banco (ex: MongoDB Atlas)

Instalação e execução (PowerShell):

```powershell
cd examples\new-payload-project
pnpm install   # ou npm install
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/payload'
npm run dev
# New Payload Project

Projeto minimalista de exemplo usando Payload CMS.

Pré-requisitos:
- Node 18+ (recomendado)
- MongoDB rodando localmente ou uma URI de banco (ex: MongoDB Atlas) OR uma instância Postgres (Supabase funciona)

Instalação e execução (PowerShell):

```powershell
cd examples\new-payload-project
pnpm install   # ou npm install
# Para MongoDB (fallback):
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/payload'
npm run dev
```

O painel admin do Payload ficará disponível em `http://localhost:3000/admin`.

Notas:
- Altere `PAYLOAD_SECRET` e `MONGODB_URI` via variáveis de ambiente em produção.
- Este é um exemplo mínimo. Para um projeto mais completo use o `create-payload-app` ou configure TypeScript, autenticação de usuário e uploads.

Usando Supabase / Postgres

1. Crie um projeto no Supabase e vá em Settings → Database → Connection string. Copie a connection string do tipo `postgres://...`.
2. Exporte a variável `POSTGRES_URL` (ou `SUPABASE_DB_URL` / `DATABASE_URL`) antes de rodar:

```powershell
$env:POSTGRES_URL = 'postgres://<user>:<pass>@<host>:5432/<db>'
$env:ADMIN_EMAIL = 'admin@exemplo.com'
$env:ADMIN_PASSWORD = 'sua-senha'

# then
npm run dev
```

O servidor detecta a variável e inicializa o adapter Postgres (compatível com Supabase). Em desenvolvimento o servidor tentará criar um usuário admin inicial caso não exista.

Segurança

- Nunca comite secrets em repositórios públicos. Use variáveis de ambiente e segredos do provedor (ex.: Supabase Project Settings).
- Troque `PAYLOAD_SECRET` por um valor forte em produção.

Próximos passos sugeridos

- Adicionar collection `Users` com autenticação e roles.
- Adicionar upload/storage adapter (S3, GCS, etc.).
- Converter para TypeScript e configurar scripts de migração.

Versionamento & CI/CD (Docker Hub)

1) Versionar com GitHub Desktop

 - Abra o repositório no GitHub Desktop.
 - Crie uma branch para seu trabalho: `feature/new-deploy`.
 - Commit e push das mudanças para o GitHub.

2) Configurar GitHub Actions para publicar no Docker Hub

 - No repositório GitHub, vá em Settings → Secrets and variables → Actions → New repository secret.
 - Adicione os seguintes secrets:
	 - `DOCKERHUB_USERNAME` — seu usuário no Docker Hub
	 - `DOCKERHUB_TOKEN` — um access token do Docker Hub (use Access Tokens em https://hub.docker.com/settings/security)
	 - `IMAGE_NAME` — nome completo da imagem, ex.: `meu-usuario/meu-repo`

A action já adicionada (`.github/workflows/publish-dockerhub.yml`) vai buildar a pasta `examples/new-payload-project` e subir a imagem com tags `latest` e `gh-<sha>` sempre que você fizer push nas branches `main`, `master`, `develop` ou `release/**`.

3) Deploy no EasyPanel (Missão 1)

EasyPanel pode puxar imagens do Docker Hub. Passos gerais:

 - Faça login no EasyPanel e crie um novo serviço/app.
 - Configure a imagem Docker apontando para `meu-usuario/meu-repo:latest` (ou outra tag específica).
 - Configure variáveis de ambiente no EasyPanel (`POSTGRES_URL`, `PAYLOAD_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, etc.).
 - Aponte as portas (ex.: 3000) e configure volumes se necessário.

Opção: Auto-deploy

 - Configure o repositório no Docker Hub para habilitar autobuilds a partir do GitHub OR usar a webhook do GitHub Actions que notifica o EasyPanel para redeploy quando a imagem for atualizada.

Observação: EasyPanel tem UI específica para configurar deploys; esses passos são a orientação geral. Se quiser, eu posso criar um script de exemplo para configurar um webhook ou um template `docker-compose.yml` que o EasyPanel aceite.

Arquivo .env

Para conveniência você pode criar um arquivo `.env` na raiz deste exemplo com as variáveis necessárias. Não comite esse arquivo em repositórios públicos.

Crie `.env` a partir de `.env.example` e preencha a `POSTGRES_URL` com a connection string do Supabase (veja observação sobre encoding abaixo).

Exemplo local (não comitar):

```powershell
# copie .env.example para .env e edite
copy .env.example .env
# edite .env e rode
npm run dev
```

Observação sobre caracteres especiais na senha

Se a senha do banco contiver caracteres especiais como `@`, `#`, `:` ou `/`, você precisa percent-encodá-los na URL. Por exemplo, a string que você forneceu:

```
postgresql://postgres:05v04d20g16MDM@#@db.qnevnarnjkkohxfwsqeh.supabase.co:5432/postgres
```

Deve ser URL-encoded na parte da senha (substituindo `@` por `%40` e `#` por `%23`). A versão codificada fica:

```
postgresql://postgres:05v04d20g16MDM%40%23%40@db.qnevnarnjkkohxfwsqeh.supabase.co:5432/postgres
```

No PowerShell, defina a variável de ambiente assim (temporário para a sessão):

```powershell
$env:POSTGRES_URL = 'postgresql://postgres:05v04d20g16MDM%40%23%40@db.qnevnarnjkkohxfwsqeh.supabase.co:5432/postgres'
$env:ADMIN_EMAIL = 'admin@example.com'
$env:ADMIN_PASSWORD = 'password'
npm run dev
```

Ou coloque `POSTGRES_URL` dentro do arquivo `.env` (não comitar).
