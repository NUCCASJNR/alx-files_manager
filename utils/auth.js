#!/usr/bin/node

/*
* @author: Al-Areef
* Contains a DBClient Class that establishes a Database connection
 */

/* eslint-disable space-before-function-paren */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return, class-methods-use-this */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-await */

import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import { redisClient } from './redis';
import { dbClient } from './db';

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

class Auth {
  /*
Finds a user in the users collection using the email provided
 */
  async findUser (email) {
    try {
      return await dbClient.client.db().collection('users').findOne(email);
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
      const result = await dbClient.client.db().collection('users').insertOne({ email, password: hashedpwd });
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
      const user = await dbClient.client.db().collection('users').findOne(query);
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
        const FilteredUser = await dbClient.client.db().collection('users').findOne({ _id: objectIdUserId });
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
      const result = await dbClient.client.db().collection('files').findOne(filter);
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
      const idan = await dbClient.client.db().collection('files').insertOne(query);
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
      const data = await dbClient.client.db().collection('files').insertOne(query);
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

  async paginate(pipeline) {
    const cursor = await dbClient.client.db().collection('files').aggregate(pipeline);
    return await cursor.toArray();
  }

  async publish(id) {
    const filter = { _id: ObjId(id) };
    const updatedDoc = {
      $set: { isPublic: true }
    };
    await dbClient.client.db().collection('files').updateOne(filter, updatedDoc);
    const result = await dbClient.client.db().collection('files').findOne(filter);
    return ({
      id: result._id,
      userId: result.userId,
      name: result.name,
      type: result.type,
      isPublic: result.isPublic,
      parentId: result.parentId,
    });
  }

  async Unpublish(id) {
    const filter = { _id: ObjId(id) };
    const updatedDoc = {
      $set: { isPublic: false }
    };
    await dbClient.client.db().collection('files').updateOne(filter, updatedDoc);
    const result = await dbClient.client.db().collection('files').findOne(filter);
    return ({
      id: result._id,
      userId: result.userId,
      name: result.name,
      type: result.type,
      isPublic: result.isPublic,
      parentId: result.parentId,
    });
  }
}

export const authClient = new Auth();
export default authClient;
