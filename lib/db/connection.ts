// lib/db/connection.ts
// AGGRESSIVE DATABASE CONNECTION MANAGER

import { neon } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { EventEmitter } from 'events';

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  MAX_RETRY_ATTEMPTS: 6,
  BASE_RETRY_DELAY_MS: 1000,
  MAX_RETRY_DELAY_MS: 32000,
  HEALTH_CHECK_INTERVAL_MS: 30000,
  HEALTH_CHECK_TIMEOUT_MS: 5000,
  POOL_MAX_CONNECTIONS: 10,
  POOL_IDLE_TIMEOUT_MS: 30000,
  CIRCUIT_BREAKER_THRESHOLD: 6,
  CIRCUIT_BREAKER_RESET_MS: 60000,
};

// ============================================
// TYPES
// ============================================

export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'reconnecting'
  | 'failed'
  | 'circuit_open';

export interface ConnectionState {
  status: ConnectionStatus;
  lastConnectedAt: Date | null;
  lastError: Error | null;
  retryCount: number;
  failureCount: number;
}

// ============================================
// CONNECTION MANAGER
// ============================================

class DatabaseConnectionManager extends EventEmitter {
  // Use ReturnType<typeof neon> — avoids the boolean generic mismatch entirely
  private sql: ReturnType<typeof neon> | null = null;
  private db: NeonHttpDatabase<typeof schema> | null = null;
  private state: ConnectionState;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isShuttingDown: boolean = false;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private circuitBreakerTimeout: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.state = {
      status: 'disconnected',
      lastConnectedAt: null,
      lastError: null,
      retryCount: 0,
      failureCount: 0,
    };
  }

  // ============================================
  // UTILITY — was missing, caused "sleep does not exist" error
  // ============================================

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ============================================
  // CORE CONNECTION LOGIC
  // ============================================

  async connect(retryAttempt: number = 0): Promise<boolean> {
    if (this.isShuttingDown) {
      console.log('🔌 Shutting down. Connection refused.');
      return false;
    }

    if (this.state.failureCount >= CONFIG.CIRCUIT_BREAKER_THRESHOLD) {
      this.state.status = 'circuit_open';
      this.emit('circuit_open', { failureCount: this.state.failureCount });
      console.log(
        `⚠️ Circuit breaker OPEN after ${this.state.failureCount} failures. ` +
        `Waiting ${CONFIG.CIRCUIT_BREAKER_RESET_MS / 1000}s.`
      );
      await this.waitForCircuitBreaker();
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      const error = new Error('DATABASE_URL environment variable is not set');
      this.updateState('failed', error);
      this.emit('error', error);
      return false;
    }

    this.updateState(retryAttempt === 0 ? 'connecting' : 'reconnecting', null);

    try {
      console.log(
        `🔌 Connecting to database... (Attempt ${retryAttempt + 1}/${CONFIG.MAX_RETRY_ATTEMPTS})`
      );

      this.sql = neon(databaseUrl);
      this.db = drizzle(this.sql, { schema });

      // Verify with a simple query
    // Verify with a simple query
    const verifyResult = await Promise.race([
        this.sql`SELECT 1 as connected, NOW() as timestamp`,
        new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new Error('Connection timeout')),
                CONFIG.HEALTH_CHECK_TIMEOUT_MS
            )
        ),
    ]) as Record<string, any>[];

    if (verifyResult && verifyResult.length > 0) {
        this.state.retryCount = 0;
        this.state.failureCount = 0;
        this.state.lastConnectedAt = new Date();
        this.state.lastError = null;
        this.updateState('connected', null);

        const connectedTime = verifyResult[0]?.timestamp ?? new Date().toISOString();

        console.log(`✅ Database connected at ${connectedTime}`);
        this.emit('connected', { timestamp: connectedTime });

        this.startHealthChecks();
        return true;
    }

      throw new Error('Verification query returned no results');

    } catch (error: any) {
      this.state.lastError = error;
      this.state.failureCount++;

      console.error(
        `❌ Connection attempt ${retryAttempt + 1} failed: ${error.message}`
      );
      this.emit('connection_error', {
        attempt: retryAttempt + 1,
        error: error.message,
      });

      if (retryAttempt < CONFIG.MAX_RETRY_ATTEMPTS - 1 && !this.isShuttingDown) {
        const delay = Math.min(
          CONFIG.BASE_RETRY_DELAY_MS * Math.pow(2, retryAttempt),
          CONFIG.MAX_RETRY_DELAY_MS
        );

        this.state.retryCount = retryAttempt + 1;
        this.updateState('reconnecting', null);

        console.log(
          `🔄 Retrying in ${delay / 1000}s... ` +
          `(Retry ${retryAttempt + 1}/${CONFIG.MAX_RETRY_ATTEMPTS})`
        );
        this.emit('retrying', {
          attempt: retryAttempt + 1,
          delay,
          maxAttempts: CONFIG.MAX_RETRY_ATTEMPTS,
        });

        await this.sleep(delay);
        return this.connect(retryAttempt + 1);

      } else {
        this.updateState('failed', error);
        this.emit('connection_failed', {
          attempts: CONFIG.MAX_RETRY_ATTEMPTS,
          lastError: error.message,
          failureCount: this.state.failureCount,
        });

        console.error(
          `💀 Database connection FAILED after ${CONFIG.MAX_RETRY_ATTEMPTS} attempts.`
        );

        if (!this.isShuttingDown) {
          this.scheduleReconnection();
        }

        return false;
      }
    }
  }

  // ============================================
  // HEALTH CHECKS
  // ============================================

  private startHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    this.healthCheckInterval = setInterval(async () => {
      if (this.state.status === 'connected' && !this.isShuttingDown) {
        const isHealthy = await this.checkHealth();

        if (!isHealthy) {
          console.log('⚠️ Health check failed. Reconnecting...');
          this.emit('health_check_failed', { timestamp: new Date() });
          await this.reconnect();
        } else {
          this.emit('health_check_passed', { timestamp: new Date() });
        }
      }
    }, CONFIG.HEALTH_CHECK_INTERVAL_MS);
  }

  private async checkHealth(): Promise<boolean> {
    if (!this.sql) return false;

    try {
      
        const result = await Promise.race([
        this.sql`SELECT 1 as healthy`,
        new Promise<never>((_, reject) =>
            setTimeout(
                () => reject(new Error('Health check timeout')),
                CONFIG.HEALTH_CHECK_TIMEOUT_MS
            )
        ),
    ]) as Record<string, any>[];

    return result != null && result.length > 0;

    } catch {
      return false;
    }
  }

  async reconnect(): Promise<boolean> {
    if (this.isShuttingDown) return false;

    console.log('🔄 Reconnecting...');
    this.updateState('reconnecting', null);
    await this.closeConnection();
    return this.connect(0);
  }

  private scheduleReconnection(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(async () => {
      if (!this.isShuttingDown && this.state.status !== 'connected') {
        console.log('🔄 Scheduled reconnection starting...');
        await this.connect(0);
      }
    }, CONFIG.CIRCUIT_BREAKER_RESET_MS);
  }

  // ============================================
  // CIRCUIT BREAKER
  // ============================================

  private waitForCircuitBreaker(): Promise<void> {
    return new Promise((resolve) => {
      if (this.circuitBreakerTimeout) {
        clearTimeout(this.circuitBreakerTimeout);
      }

      this.circuitBreakerTimeout = setTimeout(() => {
        console.log('🔄 Circuit breaker reset. Retrying...');
        this.state.failureCount = 0;
        this.state.status = 'disconnected';
        resolve();
      }, CONFIG.CIRCUIT_BREAKER_RESET_MS);
    });
  }

  // ============================================
  // UTILITIES
  // ============================================

  private async closeConnection(): Promise<void> {
    this.sql = null;
    this.db = null;
    console.log('🔌 Database references cleared.');
  }

  private updateState(status: ConnectionStatus, error: Error | null): void {
    const oldStatus = this.state.status;
    this.state.status = status;

    if (error) {
      this.state.lastError = error;
    }

    if (oldStatus !== status) {
      this.emit('status_change', { from: oldStatus, to: status });
    }
  }

  // ============================================
  // PUBLIC ACCESSORS
  // ============================================

  getDb(): NeonHttpDatabase<typeof schema> {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getSql(): ReturnType<typeof neon> {
    if (!this.sql) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.sql;
  }

  getState(): Readonly<ConnectionState> {
    return { ...this.state };
  }

  isConnected(): boolean {
    return this.state.status === 'connected' && this.db !== null;
  }

  // ============================================
  // GRACEFUL SHUTDOWN
  // ============================================

  async shutdown(): Promise<void> {
    console.log('🔌 Shutting down database connection manager...');
    this.isShuttingDown = true;

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.circuitBreakerTimeout) {
      clearTimeout(this.circuitBreakerTimeout);
      this.circuitBreakerTimeout = null;
    }

    await this.closeConnection();
    console.log('✅ Database connection manager shut down cleanly.');
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const dbManager = new DatabaseConnectionManager();

export const getDb = (): NeonHttpDatabase<typeof schema> => dbManager.getDb();
export const getSql = (): ReturnType<typeof neon> => dbManager.getSql();