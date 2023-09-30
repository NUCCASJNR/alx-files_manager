#!/usr/bin/node

/*
* Contains a redisClient Class that establishes a connection
 */

import { createClient }from 'redis';

const redisPort = 6379;
const redisHost = 'localhost';
class RedisClient {
  constructor() {
    this.client = createClient(redisPort, redisHost);
    this.client.on('error', (error) => {
      console.log(error);
    });
  }

  isAlive() {
    return !!this.client;
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', duration, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

export const redisClient = new RedisClient();
export default redisClient;
