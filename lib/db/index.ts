// lib/db/index.ts
import { dbManager, getDb, getSql } from './connection';
import * as schema from './schema';

export { dbManager, getDb, getSql };
export * from './schema';

export async function getConnectedDb() {
  if (!dbManager.isConnected()) {
    await dbManager.connect();
  }
  return getDb();
}

export async function checkDatabaseConnection(): Promise<{
  connected: boolean;
  status: string;
  lastConnectedAt?: Date;
  lastError?: string;
  retryCount?: number;
}> {
  const state = dbManager.getState();

  return {
    connected: dbManager.isConnected(),
    status: state.status,
    lastConnectedAt: state.lastConnectedAt ?? undefined,
    lastError: state.lastError?.message ?? undefined,
    retryCount: state.retryCount,
  };
}

export async function shutdownDb(): Promise<void> {
  await dbManager.shutdown();
}