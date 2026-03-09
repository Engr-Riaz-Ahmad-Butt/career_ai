/**
 * backend/src/services/cache.service.ts
 *
 * Redis-based caching service for AI operations and expensive queries
 * Reduces API calls to Gemini and database queries
 *
 * Usage:
 *   const cache = new CacheService();
 *   const result = await cache.getOrFetch('resume:123:enhance', async () => {
 *     return expensiveAICall();
 *   }, 3600); // Cache for 1 hour
 */

import { createClient, RedisClientType } from 'redis';
import { env } from '@/config/env';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  namespace?: string; // Key prefix
}

/**
 * Redis cache service — optional performance enhancement
 * If Redis is not configured, gracefully degrades to no-op
 */
export class CacheService {
  private client: RedisClientType | null = null;
  private connected = false;

  constructor(private namespace = 'career_ai') {
    this.initialize();
  }

  /**
   * Initialize Redis connection if available
   */
  private async initialize() {
    if (!env.REDIS_URL) {
      console.log('⚠️  Redis not configured — caching disabled');
      return;
    }

    try {
      this.client = createClient({
        url: env.REDIS_URL,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 10) {
              console.error('❌ Redis reconnection failed after 10 attempts');
              return new Error('Redis reconnection failed');
            }
            return Math.min(retries * 50, 500);
          },
        },
      });

      this.client.on('error', (err: unknown) => console.error('Redis error:', err));

      await this.client.connect();
      this.connected = true;
      console.log('✅ Redis cache connected');
    } catch (err) {
      console.error('⚠️  Failed to connect to Redis:', err);
      this.client = null;
      this.connected = false;
    }
  }

  /**
   * Generate namespaced cache key
   */
  private getKey(key: string, ns?: string): string {
    const prefix = ns || this.namespace;
    return `${prefix}:${key}`;
  }

  /**
   * Get value from cache
   * @param key Cache key
   * @param options Cache options with namespace
   */
  public async get<T>(key: string, options?: CacheOptions): Promise<T | null> {
    if (!this.connected || !this.client) return null;

    try {
      const fullKey = this.getKey(key, options?.namespace);
      const value = await this.client.get(fullKey);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.warn('Cache get error:', err);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param key Cache key
   * @param value Value to store
   * @param options Cache options with ttl and namespace
   */
  public async set<T>(
    key: string,
    value: T,
    options?: CacheOptions
  ): Promise<boolean> {
    if (!this.connected || !this.client) return false;

    try {
      const fullKey = this.getKey(key, options?.namespace);
      const serialized = JSON.stringify(value);

      if (options?.ttl) {
        await this.client.setEx(fullKey, options.ttl, serialized);
      } else {
        await this.client.set(fullKey, serialized);
      }

      return true;
    } catch (err) {
      console.warn('Cache set error:', err);
      return false;
    }
  }

  /**
   * Get-or-fetch pattern: retrieve from cache, or fetch and cache result
   *
   * @param key Cache key
   * @param fetchFn Function that fetches fresh data
   * @param ttl Time to live in seconds
   * @param options Additional options
   *
   * @example
   * const resume = await cache.getOrFetch(
   *   `resume:${id}:enhanced`,
   *   () => enhanceResume(id),
   *   3600 // 1 hour
   * );
   */
  public async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number,
    options?: CacheOptions
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    // Cache miss — fetch fresh data
    const fresh = await fetchFn();

    // Store in cache for next time
    await this.set(key, fresh, { ttl, ...options });

    return fresh;
  }

  /**
   * Invalidate cache key(s)
   * @param keys Single key or array of keys to delete
   * @param options Options with namespace
   */
  public async invalidate(
    keys: string | string[],
    options?: CacheOptions
  ): Promise<number> {
    if (!this.connected || !this.client) return 0;

    try {
      const keyArray = Array.isArray(keys) ? keys : [keys];
      const fullKeys = keyArray.map((k) => this.getKey(k, options?.namespace));
      return await this.client.del(fullKeys);
    } catch (err) {
      console.warn('Cache invalidation error:', err);
      return 0;
    }
  }

  /**
   * Invalidate all keys with a pattern
   * @param pattern Pattern like "resume:*" or "resume:123:*"
   * @param options Options with namespace
   */
  public async invalidatePattern(
    pattern: string,
    options?: CacheOptions
  ): Promise<number> {
    if (!this.connected || !this.client) return 0;

    try {
      const fullPattern = this.getKey(pattern, options?.namespace);
      const keys = await this.client.keys(fullPattern);

      if (keys.length === 0) return 0;

      return await this.client.del(keys);
    } catch (err) {
      console.warn('Cache invalidation pattern error:', err);
      return 0;
    }
  }

  /**
   * Clear all cache in this namespace
   */
  public async clear(namespace?: string): Promise<number> {
    const ns = namespace || this.namespace;
    return this.invalidatePattern('*', { namespace: ns });
  }

  /**
   * Get cache stats
   */
  public async getStats(namespace?: string): Promise<{ keys: number; info?: string }> {
    if (!this.connected || !this.client) {
      return { keys: 0 };
    }

    try {
      const ns = namespace || this.namespace;
      const pattern = this.getKey('*', ns);
      const keys = await this.client.keys(pattern);
      const info = await this.client.info('stats');

      return {
        keys: keys.length,
        info: info ? info.substring(0, 200) : undefined,
      };
    } catch (err) {
      console.warn('Cache stats error:', err);
      return { keys: 0 };
    }
  }

  /**
   * Disconnect from Redis
   */
  public async disconnect(): Promise<void> {
    if (this.client && this.connected) {
      await this.client.disconnect();
      this.connected = false;
    }
  }

  /**
   * Check if Redis is available
   */
  public isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
let cacheInstance: CacheService | null = null;

export function getCacheService(): CacheService {
  if (!cacheInstance) {
    cacheInstance = new CacheService();
  }
  return cacheInstance;
}
