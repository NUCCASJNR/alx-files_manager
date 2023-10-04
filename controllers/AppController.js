/* eslint-disable import/no-named-as-default, space-before-function-paren */

/*
@author: Al-Areef
Controller
 */

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus (req, res) {
    const redis = redisClient.isAlive();
    const db = dbClient.isAlive();
    res.status(200).json({ redis, db });
  }

  static async getStats (req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.status(200).json({ users, files });
  }
}

export default AppController;
