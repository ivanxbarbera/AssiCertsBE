// libraries
import { SQLDatabase } from 'encore.dev/storage/sqldb';
import knex from 'knex';
import pg from 'pg';
const { types } = pg;

// connect to database
const db = new SQLDatabase('assihub', { migrations: './migrations' });
// define PostgreSQL types mapping
types.setTypeParser(types.builtins.INT8, (value) => parseInt(value, 11));
types.setTypeParser(types.builtins.TIMESTAMP, (value) => new Date(value));
types.setTypeParser(types.builtins.TIMESTAMPTZ, (value) => new Date(value));
// initialize orm
export const orm = knex({ client: 'pg', connection: db.connectionString });
