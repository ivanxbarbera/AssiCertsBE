// libraries
import { SQLDatabase } from 'encore.dev/storage/sqldb';
import knex from 'knex';

// connect to database
const db = new SQLDatabase('assihub', { migrations: './migrations' });
// initialize orm
export const orm = knex({ client: 'pg', connection: db.connectionString });
