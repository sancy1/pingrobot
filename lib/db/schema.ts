// // lib/db/schema.ts
// // Database schema definitions matching the SQL tables in Neon PostgreSQL
// // This provides TypeScript type safety for all database operations

// import { sql } from 'drizzle-orm';
// import { 
//   pgTable, 
//   serial, 
//   varchar, 
//   text, 
//   integer, 
//   timestamp, 
//   date,
//   jsonb, 
//   boolean, 
//   decimal,
//   uniqueIndex,
//   index
// } from 'drizzle-orm/pg-core';

// // ============================================
// // TABLE 1: MONITORS
// // Stores all URL monitoring configurations
// // ============================================

// export const monitors = pgTable('monitors', {
//   // Primary Key
//   id: serial('id').primaryKey(),
  
//   // Basic Information
//   name: varchar('name', { length: 255 }).notNull(),
//   url: varchar('url', { length: 500 }).notNull(),
//   description: text('description'),
  
//   // 'website': Full website monitoring with content checking
//   monitorType: varchar('monitor_type', { length: 50 }).notNull().default('http'),
  
//   // HTTP Method - GET is fastest, HEAD even faster (no body)
//   method: varchar('method', { length: 10 }).notNull().default('GET'),
  
//   // Schedule - How often to ping in seconds
//   intervalSeconds: integer('interval_seconds').notNull().default(300),
  
//   // Geolocation - Where the ping originates
//   region: varchar('region', { length: 50 }).notNull().default('auto'),

//   // Range: 5000ms to 120000ms (5 to 120 seconds)
//   timeoutMs: integer('timeout_ms').notNull().default(60000),
  
//   // FIXED: Corrected syntax using sql templates for JSON data type defaults
//   customHeaders: jsonb('custom_headers').default(sql`'{}'::jsonb`),
//   requestBody: text('request_body'),
//   expectedStatusCodes: jsonb('expected_status_codes').notNull().default(sql`'[200, 201, 202, 204]'::jsonb`),
  
//   // SSL Certificate Monitoring
//   sslEnabled: boolean('ssl_enabled').notNull().default(false),
//   sslExpiryDays: integer('ssl_expiry_days'),
  
//   // Operational Status
//   isActive: boolean('is_active').notNull().default(true),
//   status: varchar('status', { length: 20 }).notNull().default('pending'),
  
//   // Timestamps
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   lastPingAt: timestamp('last_ping_at'),
//   nextPingAt: timestamp('next_ping_at'),
  
//   // Aggregated Statistics (denormalized for performance)
//   uptimePercentage: decimal('uptime_percentage', { precision: 5, scale: 2 }).default('100.00'),
//   totalPings: integer('total_pings').default(0),
//   successfulPings: integer('successful_pings').default(0),
//   averageResponseMs: integer('average_response_ms').default(0),
// }, (table) => ({
//   // FIXED: Converted where filters to use sql template strings
//   nextPingIdx: index('idx_monitors_next_ping').on(table.nextPingAt).where(sql`is_active = true`),
//   statusIdx: index('idx_monitors_status').on(table.status).where(sql`is_active = true`),
//   regionIdx: index('idx_monitors_region').on(table.region).where(sql`is_active = true`),
// }));

// // ============================================
// // TABLE 2: PING RESULTS
// // Stores every individual ping attempt with complete details
// // ============================================

// export const pingResults = pgTable('ping_results', {
//   // Primary Key
//   id: serial('id').primaryKey(),
  
//   // Foreign Key to monitors table
//   monitorId: integer('monitor_id').notNull().references(() => monitors.id, { onDelete: 'cascade' }),
  
//   // HTTP Response Details
//   statusCode: integer('status_code'),
//   responseTimeMs: integer('response_time_ms'),
//   success: boolean('success').notNull(),
  
//   // WAKE-UP DETECTION - CRITICAL FEATURE
//   isWakeUp: boolean('is_wake_up').default(false),
  
//   // Error Information
//   errorMessage: varchar('error_message', { length: 500 }),
//   errorType: varchar('error_type', { length: 50 }),
  
//   // Response Data Capture
//   responsePreview: varchar('response_preview', { length: 500 }),
//   jsonResponse: jsonb('json_response'),
  
//   // SSL Certificate Information (if monitored)
//   sslValid: boolean('ssl_valid'),
//   sslExpiryDays: integer('ssl_expiry_days'),
  
//   // Geolocation Data from ping execution
//   pingRegion: varchar('ping_region', { length: 50 }),
//   pingLatencyMs: integer('ping_latency_ms'),
  
//   // Timestamp
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// }, (table) => ({
//   // Indexes for fast queries and analytics
//   createdAtIdx: index('idx_ping_results_created_at').on(table.createdAt.desc()),
//   monitorIdIdx: index('idx_ping_results_monitor_id').on(table.monitorId),
//   monitorCreatedIdx: index('idx_ping_results_monitor_created').on(table.monitorId, table.createdAt.desc()),
//   // FIXED: Changed filter expression to valid sql literal
//   wakeupIdx: index('idx_ping_results_wakeup').on(table.monitorId, table.isWakeUp, table.createdAt.desc()).where(sql`is_wake_up = true`),
// }));

// // ============================================
// // TABLE 3: HEALTH METRICS
// // Daily aggregated statistics for fast dashboard loading
// // ============================================

// export const healthMetrics = pgTable('health_metrics', {
//   // Primary Key
//   id: serial('id').primaryKey(),
  
//   // Foreign Key to monitors table
//   monitorId: integer('monitor_id').notNull().references(() => monitors.id, { onDelete: 'cascade' }),
  
//   // FIXED: Switched column type from timestamp to date to match pure SQL date tracking
//   date: date('date').notNull(),
  
//   // Daily Counts
//   totalChecks: integer('total_checks').default(0),
//   successfulChecks: integer('successful_checks').default(0),
//   wakeUpEvents: integer('wake_up_events').default(0),
  
//   // Response Time Statistics
//   averageResponseMs: integer('average_response_ms').default(0),
//   minResponseMs: integer('min_response_ms').default(0),
//   maxResponseMs: integer('max_response_ms').default(0),
  
//   // Uptime Percentage for the period
//   uptimePercentage: decimal('uptime_percentage', { precision: 5, scale: 2 }).default('100.00'),
  
//   // Timestamp
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// }, (table) => ({
//   // Unique constraint: one record per monitor per day
//   monitorDateUniq: uniqueIndex('idx_health_metrics_monitor_date').on(table.monitorId, table.date),
// }));

// // ============================================
// // TABLE 4: ALERTS
// // Notification system for downtime and wake-up events
// // ============================================

// export const alerts = pgTable('alerts', {
//   // Primary Key
//   id: serial('id').primaryKey(),
  
//   // Foreign Key to monitors table
//   monitorId: integer('monitor_id').notNull().references(() => monitors.id, { onDelete: 'cascade' }),
  
//   // Alert Classification
//   alertType: varchar('alert_type', { length: 50 }).notNull(),
//   message: varchar('message', { length: 1000 }).notNull(),
//   severity: varchar('severity', { length: 20 }).notNull(),
  
//   // Resolution Tracking
//   isResolved: boolean('is_resolved').default(false),
//   resolvedAt: timestamp('resolved_at'),
  
//   // Timestamp
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// }, (table) => ({
//   // FIXED: Altered condition to target unresolved issues correctly (is_resolved = false)
//   unresolvedIdx: index('idx_alerts_monitor_unresolved').on(table.monitorId, table.isResolved).where(sql`is_resolved = false`),
//   severityIdx: index('idx_alerts_severity_created').on(table.severity, table.createdAt.desc()),
// }));























// lib/db/schema.ts
// Database schema definitions matching the SQL tables in Neon PostgreSQL
// This provides TypeScript type safety for all database operations

import { sql } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  varchar, 
  text, 
  integer, 
  timestamp, 
  date,
  jsonb, 
  boolean, 
  decimal,
  uniqueIndex,
  index
} from 'drizzle-orm/pg-core';

// ============================================
// TABLE 1: MONITORS
// Stores all URL monitoring configurations
// ============================================

export const monitors = pgTable('monitors', {
  // Primary Key
  id: serial('id').primaryKey(),
  
  // Basic Information
  name: varchar('name', { length: 255 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  description: text('description'),
  
  // 'website': Full website monitoring with content checking
  monitorType: varchar('monitor_type', { length: 50 }).notNull().default('http'),
  
  // HTTP Method - GET is fastest, HEAD even faster (no body)
  method: varchar('method', { length: 10 }).notNull().default('GET'),
  
  // Schedule - How often to ping in seconds
  intervalSeconds: integer('interval_seconds').notNull().default(300),
  
  // Geolocation - Where the ping originates
  region: varchar('region', { length: 50 }).notNull().default('auto'),

  // Range: 5000ms to 120000ms (5 to 120 seconds)
  timeoutMs: integer('timeout_ms').notNull().default(60000),
  
  // FIXED: Corrected syntax using sql templates for JSON data type defaults
  customHeaders: jsonb('custom_headers').default(sql`'{}'::jsonb`),
  requestBody: text('request_body'),
  expectedStatusCodes: jsonb('expected_status_codes').notNull().default(sql`'[200, 201, 202, 204]'::jsonb`),
  
  // SSL Certificate Monitoring
  sslEnabled: boolean('ssl_enabled').notNull().default(false),
  sslExpiryDays: integer('ssl_expiry_days'),
  
  // Operational Status
  isActive: boolean('is_active').notNull().default(true),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastPingAt: timestamp('last_ping_at'),
  nextPingAt: timestamp('next_ping_at'),
  
  // Aggregated Statistics (denormalized for performance)
  uptimePercentage: decimal('uptime_percentage', { precision: 5, scale: 2 }).default('100.00'),
  totalPings: integer('total_pings').default(0),
  successfulPings: integer('successful_pings').default(0),
  averageResponseMs: integer('average_response_ms').default(0),

  // 🔐 SOCIAL AUTH: User email for ownership isolation
  userEmail: varchar('user_email', { length: 255 }),
}, (table) => ({
  // FIXED: Converted where filters to use sql template strings
  nextPingIdx: index('idx_monitors_next_ping').on(table.nextPingAt).where(sql`is_active = true`),
  statusIdx: index('idx_monitors_status').on(table.status).where(sql`is_active = true`),
  regionIdx: index('idx_monitors_region').on(table.region).where(sql`is_active = true`),

  // 🔐 Efficient B-Tree lookup index for multi-tenant query separation
  userEmailIdx: index('idx_monitors_user_email').on(table.userEmail),
}));

// ============================================
// TABLE 2: PING RESULTS
// Stores every individual ping attempt with complete details
// ============================================

export const pingResults = pgTable('ping_results', {
  // Primary Key
  id: serial('id').primaryKey(),
  
  // Foreign Key to monitors table
  monitorId: integer('monitor_id').notNull().references(() => monitors.id, { onDelete: 'cascade' }),
  
  // HTTP Response Details
  statusCode: integer('status_code'),
  responseTimeMs: integer('response_time_ms'),
  success: boolean('success').notNull(),
  
  // WAKE-UP DETECTION - CRITICAL FEATURE
  isWakeUp: boolean('is_wake_up').default(false),
  
  // Error Information
  errorMessage: varchar('error_message', { length: 500 }),
  errorType: varchar('error_type', { length: 50 }),
  
  // Response Data Capture
  responsePreview: varchar('response_preview', { length: 500 }),
  jsonResponse: jsonb('json_response'),
  
  // SSL Certificate Information (if monitored)
  sslValid: boolean('ssl_valid'),
  sslExpiryDays: integer('ssl_expiry_days'),
  
  // Geolocation Data from ping execution
  pingRegion: varchar('ping_region', { length: 50 }),
  pingLatencyMs: integer('ping_latency_ms'),
  
  // Timestamp
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // Indexes for fast queries and analytics
  createdAtIdx: index('idx_ping_results_created_at').on(table.createdAt.desc()),
  monitorIdIdx: index('idx_ping_results_monitor_id').on(table.monitorId),
  monitorCreatedIdx: index('idx_ping_results_monitor_created').on(table.monitorId, table.createdAt.desc()),
  // FIXED: Changed filter expression to valid sql literal
  wakeupIdx: index('idx_ping_results_wakeup').on(table.monitorId, table.isWakeUp, table.createdAt.desc()).where(sql`is_wake_up = true`),
}));

// ============================================
// TABLE 3: HEALTH METRICS
// Daily aggregated statistics for fast dashboard loading
// ============================================

export const healthMetrics = pgTable('health_metrics', {
  // Primary Key
  id: serial('id').primaryKey(),
  
  // Foreign Key to monitors table
  monitorId: integer('monitor_id').notNull().references(() => monitors.id, { onDelete: 'cascade' }),
  
  // FIXED: Switched column type from timestamp to date to match pure SQL date tracking
  date: date('date').notNull(),
  
  // Daily Counts
  totalChecks: integer('total_checks').default(0),
  successfulChecks: integer('successful_checks').default(0),
  wakeUpEvents: integer('wake_up_events').default(0),
  
  // Response Time Statistics
  averageResponseMs: integer('average_response_ms').default(0),
  minResponseMs: integer('min_response_ms').default(0),
  maxResponseMs: integer('max_response_ms').default(0),
  
  // Uptime Percentage for the period
  uptimePercentage: decimal('uptime_percentage', { precision: 5, scale: 2 }).default('100.00'),
  
  // Timestamp
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // Unique constraint: one record per monitor per day
  monitorDateUniq: uniqueIndex('idx_health_metrics_monitor_date').on(table.monitorId, table.date),
}));

// ============================================
// TABLE 4: ALERTS
// Notification system for downtime and wake-up events
// ============================================

export const alerts = pgTable('alerts', {
  // Primary Key
  id: serial('id').primaryKey(),
  
  // Foreign Key to monitors table
  monitorId: integer('monitor_id').notNull().references(() => monitors.id, { onDelete: 'cascade' }),
  
  // Alert Classification
  alertType: varchar('alert_type', { length: 50 }).notNull(),
  message: varchar('message', { length: 1000 }).notNull(),
  severity: varchar('severity', { length: 20 }).notNull(),
  
  // Resolution Tracking
  isResolved: boolean('is_resolved').default(false),
  resolvedAt: timestamp('resolved_at'),
  
  // Timestamp
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  // FIXED: Altered condition to target unresolved issues correctly (is_resolved = false)
  unresolvedIdx: index('idx_alerts_monitor_unresolved').on(table.monitorId, table.isResolved).where(sql`is_resolved = false`),
  severityIdx: index('idx_alerts_severity_created').on(table.severity, table.createdAt.desc()),
}));