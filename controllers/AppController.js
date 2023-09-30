/* eslint-disable import/no-named-as-default */
/*
@author: Al-Areef
Controller
 */

import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  static getStatus (req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();
    res.json({ redis: redisStatus, db: dbStatus });
  }

  static async getStats (req, res) {
    const nbUsers = await dbClient.nbUsers();
    const nbFiles = await dbClient.nbFiles();
    res.json({ users: nbUsers, files: nbFiles });
  }
}

export default AppController;
