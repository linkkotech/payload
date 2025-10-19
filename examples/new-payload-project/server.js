require('dotenv').config();
const express = require('express');
const payload = require('payload');
const path = require('path');

const app = express();
const payloadConfig = require('./payload.config');

async function init() {
  const secret = process.env.PAYLOAD_SECRET || 'payload-secret';

  const dbAdapterUrl = process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

  const initOptions = {
    secret,
    express: app,
    onInit: async (payloadInstance) => {
      console.log('Payload inicializado');

      // Cria um usuário admin inicial se não houver nenhum (útil para desenvolvimento)
      try {
        const Users = payloadInstance.collections?.users;
        if (Users) {
          const result = await payloadInstance.find({ collection: 'users', limit: 1 });
          if (!result?.docs?.length) {
            console.log('Nenhum usuário encontrado. Criando admin padrão...');
            await payloadInstance.create({
              collection: 'users',
              data: {
                email: process.env.ADMIN_EMAIL || 'admin@example.com',
                password: process.env.ADMIN_PASSWORD || 'password',
                roles: [],
              },
            });
            console.log('Admin criado: use as variáveis ADMIN_EMAIL/ADMIN_PASSWORD para alterar.');
          }
        }
      } catch (err) {
        // não bloquear inicialização por erros de seed
        console.error('Erro ao criar usuário admin inicial:', err?.message || err);
      }
    },
  };

  if (dbAdapterUrl) {
    // usa Postgres via @payloadcms/db-postgres (compatível com Supabase)
    const { postgresAdapter } = require('@payloadcms/db-postgres');
    initOptions.db = postgresAdapter({
      pool: { connectionString: dbAdapterUrl },
      logger: true,
    });
  } else {
    // fallback para MongoDB local
    initOptions.mongoURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/payload';
  }

  await payload.init({
    ...initOptions,
    ...payloadConfig,
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
