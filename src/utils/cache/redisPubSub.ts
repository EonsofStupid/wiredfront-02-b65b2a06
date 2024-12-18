import { createClient } from '@redis/client';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const initializeRedisPubSub = async () => {
  try {
    await redisClient.connect();
    console.log('Redis PubSub client connected');
  } catch (error) {
    console.error('Redis PubSub connection error:', error);
  }
};

export const publishMessage = async (channel: string, message: any) => {
  try {
    await redisClient.publish(channel, JSON.stringify(message));
    return true;
  } catch (error) {
    console.error('Redis publish error:', error);
    return false;
  }
};

export const subscribeToChannel = async (channel: string, callback: (message: any) => void) => {
  try {
    const subscriber = redisClient.duplicate();
    await subscriber.connect();

    await subscriber.subscribe(channel, (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    return subscriber;
  } catch (error) {
    console.error('Redis subscribe error:', error);
    return null;
  }
};