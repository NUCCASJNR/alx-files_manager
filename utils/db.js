#!/usr/bin/node

/*
* @author: Al-Areef
* Contains a DBClient Class that establishes a Database connection
 */

/* eslint-disable space-before-function-paren */
import { MongoClient } from 'mongodb';
import { createHash } from 'crypto';

const MongodbHost = process.env.DB_HOST || '127.0.0.1';
const MongodbPort = process.env.DB_PORT || 27017;
const Database = process.env.DB_DATABASE || 'files_manager';
const dbUrl = `mongodb://${MongodbHost}:${MongodbPort}/${Database}`;

const generateHash = (password) => {
  const Sha1 = createHash('sha1');
  Sha1.update(password);
  return Sha1.digest('hex');
};
class DBClient {
  constructor () {
    this.client = new MongoClient(dbUrl, { useUnifiedTopology: true });
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

  /*
  Finds a user in the users collection using the email provided
   */
  async findUser (email) {
    try {
      return await this.client.db().collection('users').findOne(email);
    } catch (error) {
      throw new Error(error);
    }
  }

  /*
  Adds a new user to the users collection
  email: user's email
  password: user's password
   */
  async addUser(email, password) {
    try {
      const hashedpwd = generateHash(password);
      const result = await this.client.db().collection('users').insertOne({ email, password: hashedpwd });
      const id = `${result.insertedId}`;
      return ({ _id: id, email: email });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const dbClient = new DBClient();
export default dbClient;
