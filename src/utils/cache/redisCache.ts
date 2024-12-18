import { createClient } from '@redis/client';
import { supabase } from '@/integrations/supabase/client';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const initializeRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connected');
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};

export const cacheGet = async (key: string) => {
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

export const cacheSet = async (key: string, value: any, ttl?: number) => {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redisClient.setEx(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
};

export const cacheDelete = async (key: string) => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
};

export const clearCache = async () => {
  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error('Redis flush error:', error);
    return false;
  }
};