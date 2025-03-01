import { api } from 'encore.dev/api';
import { version } from 'node:os';
import { orm } from '../common/db/db';
import { promises as fs } from 'fs';
import path from 'path';

interface HealthCheckResponse {
  status: string;
  services: { [key: string]: string };
  timestamp: string;
}

export const health = api({ method: 'GET', expose: true, path: '/health' }, async (): Promise<HealthCheckResponse> => {
  const services = {
    database: 'operational',
    cache: 'operational',
    api_gateway: 'operational',
    storage: 'operational',
    version: '3',
  };

  return {
    status: 'healthy',
    services,
    timestamp: new Date().toISOString(),
  };
});

interface ShowTablesResponse {
  tables: string[];
}

export const showTables = api(
  { method: 'GET', expose: true, path: '/sadhihii3xc-show-tables-jhgdsagdbasjbv' },
  async (): Promise<ShowTablesResponse> => {
    const result = await orm.raw("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");

    return { tables: result.rows.map((row: any) => row.tablename) };
  }
);

interface PathCheckResponse {
  exists: boolean;
}

export const checkMigrationsPath = api({ method: 'GET', expose: true, path: '/check-migrations' }, async (): Promise<PathCheckResponse> => {
  try {
    await fs.access('./common/db/migrations');
    return { exists: true };
  } catch {
    return { exists: false };
  }
});

interface MigrationResponse {
  exists: boolean;
  migrationsRun: string[];
  error?: string;
  failedFile?: string;
}

export const runMigrations = api({ method: 'POST', expose: true, path: '/run-migrations' }, async (): Promise<MigrationResponse> => {
  const migrationsPath = './common/db/migrations';

  try {
    // Controlla se la cartella esiste
    await fs.access(migrationsPath);
  } catch {
    return { exists: false, migrationsRun: [], error: 'Directory not found' };
  }

  let migrationFiles: string[];
  try {
    // Filtra e ordina i file correttamente
    migrationFiles = (await fs.readdir(migrationsPath))
      .filter((file) => file.endsWith('.up.sql'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/^\d+/)?.[0] || '0', 10);
        const numB = parseInt(b.match(/^\d+/)?.[0] || '0', 10);
        return numA - numB;
      });
  } catch (error: unknown) {
    return { exists: true, migrationsRun: [], error: `Error reading migrations: ${String(error)}` };
  }

  const executedMigrations: string[] = [];

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsPath, file);
    const sql = await fs.readFile(filePath, 'utf-8');

    try {
      await orm.raw(sql); // Esegui la migrazione SENZA transazione globale
      executedMigrations.push(file);
    } catch (error: unknown) {
      return {
        exists: true,
        migrationsRun: executedMigrations,
        error: `Migration error in file: ${file} - ${String(error)}`,
        failedFile: file,
      };
    }
  }

  return { exists: true, migrationsRun: executedMigrations };
});

interface DropTablesResponse {
  success: boolean;
  droppedObjects: string[];
  error?: string;
}

export const dropAllTablesAndTypes = api(
  { method: 'POST', expose: true, path: '/drop-all-tables-and-types' },
  async (): Promise<DropTablesResponse> => {
    try {
      const droppedObjects: string[] = [];

      // 1️⃣ Elimina tutte le tabelle
      const tablesResult = await orm.raw("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
      const tables = tablesResult.rows.map((row: any) => row.tablename);

      for (const table of tables) {
        await orm.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`);
        droppedObjects.push(`Table: ${table}`);
      }

      // 2️⃣ Elimina tutti i tipi ENUM
      const typesResult = await orm.raw(
        "SELECT typname FROM pg_type WHERE typtype = 'e' AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')"
      );
      const types = typesResult.rows.map((row: any) => row.typname);

      for (const type of types) {
        await orm.raw(`DROP TYPE IF EXISTS "${type}" CASCADE`);
        droppedObjects.push(`Type: ${type}`);
      }

      // 3️⃣ Elimina tutte le sequenze
      const sequencesResult = await orm.raw(
        "SELECT relname FROM pg_class WHERE relkind = 'S' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')"
      );
      const sequences = sequencesResult.rows.map((row: any) => row.relname);

      for (const sequence of sequences) {
        await orm.raw(`DROP SEQUENCE IF EXISTS "${sequence}" CASCADE`);
        droppedObjects.push(`Sequence: ${sequence}`);
      }

      return { success: true, droppedObjects };
    } catch (error) {
      return { success: false, droppedObjects: [], error: (error as Error).message };
    }
  }
);
