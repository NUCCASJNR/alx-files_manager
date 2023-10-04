#!/usr/bin/node

/*
* @author: Al-Areef
* Contains a DBClient Class that establishes a Database connection
 */

/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-await */

import { MongoClient } from 'mongodb';

const MongodbHost = process.env.DB_HOST || '127.0.0.1';
const MongodbPort = process.env.DB_PORT || 27017;
const Database = process.env.DB_DATABASE || 'files_manager';
const dbUrl = `mongodb://${MongodbHost}:${MongodbPort}/${Database}`;

class DBClient {
  constructor () {
    this.client = new MongoClient(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    this.client.connect();
  }

  /*
  Returns True if database connection was successful
  And False if otherwise
   */
  isAlive () {
    return this.client.isConnected();
  }

  /*
  Returns the numbers of documents in the users collections
   */
  async nbUsers () {
    try {
      return await this.client.db().collection('users').countDocuments();
    } catch (error) {
      throw new Error(error);
    }
  }

  /*
   Returns the numbers of documents in the files collections
   */
  async nbFiles () {
    try {
      return await this.client.db().collection('files').countDocuments();
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const dbClient = new DBClient();
export default dbClient;
