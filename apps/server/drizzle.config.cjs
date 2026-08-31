module.exports = {
  schema: './apps/server/src/db/schema.ts',
  out: './apps/server/drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './apps/server/sqlite.db',
  },
};

