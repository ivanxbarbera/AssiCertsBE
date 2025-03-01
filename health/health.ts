import { api } from 'encore.dev/api';
import { version } from 'node:os';

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
    version: '2',
  };

  return {
    status: 'healthy',
    services,
    timestamp: new Date().toISOString(),
  };
});
