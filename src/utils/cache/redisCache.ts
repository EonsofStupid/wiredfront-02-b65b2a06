import { createClient } from '@redis/client';
import { toast } from 'sonner';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
  toast.error('Cache service error. Some features may be slower.');
});

export type CacheOptions = {
  ttl?: number; // Time to live in seconds
  background?: boolean; // If true, don't wait for cache operations
};

export const cacheGet = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

export const cacheSet = async <T>(
  key: string,
  value: T,
  options: CacheOptions = {}
): Promise<boolean> => {
  try {
    const stringValue = JSON.stringify(value);
    if (options.ttl) {
      await redisClient.setEx(key, options.ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

export const cacheDelete = async (key: string): Promise<boolean> => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Cache delete error:', error);
    return false;
  }
};

export const clearCache = async (): Promise<boolean> => {
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

export const initializeRedis = async (): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    return true;
  } catch (error) {
    console.error('Redis initialization error:', error);
    return false;
  }
};

export const closeRedis = async (): Promise<void> => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  } catch (error) {
    console.error('Redis close error:', error);
  }
};