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
    
    // Initialize PubSub system
    const subscriber = redisClient.duplicate();
    await subscriber.connect();
    
    // Subscribe to backup channel for real-time features
    await subscriber.subscribe('realtime-backup', (message) => {
      try {
        const data = JSON.parse(message);
        handleRealtimeBackup(data);
      } catch (error) {
        console.error('Error processing backup message:', error);
      }
    });
    
  } catch (error) {
    console.error('Redis connection error:', error);
  }
};

const handleRealtimeBackup = async (data: any) => {
  // Handle backup data if Supabase real-time fails
  if (data.type === 'typing_status') {
    try {
      await supabase
        .from('typing_status')
        .upsert(data.payload);
    } catch (error) {
      console.error('Error processing backup typing status:', error);
    }
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