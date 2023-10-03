#!/usr/bin/node

/*
* @author: Al-Areef
* Contains a DBClient Class that establishes a Database connection
 */

/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
/* eslint-disable prefer-destructuring */

import { MongoClient, ObjectId } from 'mongodb';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import { redisClient } from './redis';

const MongodbHost = process.env.DB_HOST || '127.0.0.1';
const MongodbPort = process.env.DB_PORT || 27017;
const Database = process.env.DB_DATABASE || 'files_manager';
const dbUrl = `mongodb://${MongodbHost}:${MongodbPort}/${Database}`;

const generateHash = (password) => sha1(password);

/*
Generates a unique uuid
 */
export const generateUuid = () => uuidv4();

const ObjId = (id) => {
  try {
    return ObjectId(id);
  } catch (error) {
    throw new Error(error);
  }
};
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
      return ({ id, email });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findMatchUser(email, password) {
    try {
      const query = {
        email,
        password: generateHash(password)
      };
      const user = await this.client.db().collection('users').findOne(query);
      if (user) {
        const authKey = generateUuid();
        const token = `auth_${authKey}`;
        await redisClient.set(token, user._id.toString(), 24 * 60 * 60);
        return ({ token: authKey });
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async FindUserWithToken(token) {
    try {
      const authToken = `auth_${token}`;
      const user = await redisClient.get(authToken);
      if (user) {
        const objectIdUserId = ObjId(user);
        const FilteredUser = await this.client.db().collection('users').findOne({ _id: objectIdUserId });
        if (FilteredUser) {
          return ({ id: FilteredUser._id.toString(), email: FilteredUser.email });
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async findFolder(parentId, query = {}) {
    try {
      const objId = ObjId(parentId);
      const filter = { _id: objId, ...query };
      const result = await this.client.db().collection('files').findOne(filter);
      if (result) {
        return (result);
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async createFolder (userId, name, type, parentId, isPublic) {
    try {
      const query = {
        userId,
        name,
        type,
        parentId: parentId || 0,
        isPublic: isPublic || false,
      };
      const idan = await this.client.db().collection('files').insertOne(query);
      const inserted = idan.insertedId;
      const res = await this.findFolder(inserted);
      return ({
        id: res._id,
        userId: res.userId,
        name: res.name,
        type: res.type,
        isPublic: res.isPublic,
        parentId: res.parentId
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async createFile(userId, name, type, isPublic, parentId, localPath) {
    try {
      const query = {
        userId,
        name,
        type,
        isPublic: isPublic || false,
        parentId: parentId || 0,
        localPath,
      };
      const data = await this.client.db().collection('files').insertOne(query);
      const insertedId = data.insertedId;
      const result = await this.findFolder(insertedId);
      return ({
        id: result._id,
        userId: result.userId,
        name: result.name,
        type: result.type,
        isPublic: result.isPublic,
        parentId: result.parentId,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

export const dbClient = new DBClient();
export default dbClient;
