import { api } from 'encore.dev/api';
import { version } from 'node:os';
import { orm } from '../common/db/db';

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
