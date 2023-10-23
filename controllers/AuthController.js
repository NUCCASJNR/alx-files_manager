#!/usr/bin/node
/* eslint-disable import/no-named-as-default */
/* eslint-disable space-before-function-paren */
/*
Auth Controller to handle Authorization
 */

import authClient from '../utils/auth';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect (req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const encodedCredentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      const [email, password] = credentials.split(':');
      const user = await authClient.findMatchUser(email, password);
      if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
    }
  }

  static async getDisconnect (req, res) {
    const token = req.headers['x-token'];
    if (!await redisClient.get(`auth_${token}`)) {
      res.status(401).json({ error: 'Unauthorized' });
    } else {
      await redisClient.del(`auth_${token}`);
      res.status(204).send();
    }
  }
}

export default AuthController;
