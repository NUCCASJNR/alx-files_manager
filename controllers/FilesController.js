#!/usr/in/node
/* eslint-disable comma-dangle */
/* eslint-disable  object-curly-newline */
/* eslint-disable space-before-function-paren, consistent-return, radix  */
/*
Files controller
 */

import { generateUuid, authClient } from '../utils/auth';

import { CreateDirectory, SaveFileLocally, GetMimeType, ReadFileContent } from '../utils/Filelogic';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
class FilesController {
  static async postUpload (req, res) {
    try {
      const { name, type, parentId, isPublic, data } = req.body;
      const token = req.headers['x-token'];
      const user = await authClient.FindUserWithToken(token);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const AcceptedFileType = ['folder', 'file', 'image'];
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }
      if (!type || !AcceptedFileType.includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (!data && type !== AcceptedFileType[0]) {
        return res.status(400).json({ error: 'Missing data' });
      }
      if (parentId) {
        const FileInDb = await authClient.findFolder(parentId);
        if (!FileInDb) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        const File = await authClient.findFolder(parentId, { type: AcceptedFileType[0] });
        if (!File) {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }
      if (type === AcceptedFileType[0]) {
        const result = await authClient.createFolder(
          user.id.toString(),
          name,
          type,
          parentId,
          isPublic
        );
        return res.status(201).json(result);
      }

      await CreateDirectory(FOLDER_PATH);
      const LocalPath = await SaveFileLocally(
        FOLDER_PATH,
        generateUuid(),
        Buffer.from(data, 'base64')
      );
      const UserId = user.id.toString();
      const ret = await authClient.createFile(UserId, name, type, isPublic, parentId, LocalPath);
      return res.status(201).json(ret);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getShow(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    const user = await authClient.FindUserWithToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const UserId = user.id.toString();
    const query = await authClient.findFolder(id, { userId: UserId });
    if (query) {
      res.status(200).json(query);
    } else {
      return res.status(404).json({ error: 'Not found' });
    }
  }

  static async getIndex(req, res) {
    const parentId = req.query.parentId || 0;
    const page = parseInt(req.query.page) || 0;

    const token = req.headers['x-token'];
    const user = await authClient.FindUserWithToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const pageSize = 20;
    const skip = page * pageSize;
    const query = {
      parentId,
    };
    const pipeLine = [
      {
        $match: query,
      },
      {
        $skip: skip,
      },
      {
        $limit: pageSize,
      }
    ];
    const result = await authClient.paginate(pipeLine);
    res.status(200).json(result);
  }

  static async putPublish(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    const user = await authClient.FindUserWithToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const query = await authClient.findFolder(id);
    if (!query) {
      return res.status(404).json({ error: 'Not found' });
    }
    const result = await authClient.publish(id);
    res.status(200).json(result);
  }

  static async putUnpublish(req, res) {
    const { id } = req.params;
    const token = req.headers['x-token'];
    const user = await authClient.FindUserWithToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const query = await authClient.findFolder(id);
    if (!query) {
      return res.status(404).json({ error: 'Not found' });
    }
    const result = await authClient.Unpublish(id);
    res.status(200).json(result);
  }

  static async getFile(req, res) {
    const { id } = req.params;
    const document = await authClient.findFolder(id);
    const token = req.headers['x-token'];
    const user = await authClient.FindUserWithToken(token);
    if (!document) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (document.isPublic === false && (!user || user.id !== document.userId)) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (document.type === 'folder') {
      return res.status(400).json({ error: "A folder doesn't have content" });
    }
    const { localPath } = document;
    // console.log(localPath)
    // const  filePath = GenerateFilePath(FOLDER_PATH, localPath);
    const mimeType = GetMimeType(document.name);
    // console.log(filePath)
    try {
      const fileContent = await ReadFileContent(localPath);
      // console.log(fileContent)
      res.set('Content-Type', mimeType);
      res.status(200).send(fileContent);
    } catch (error) {
      return res.status(404).json({ error: 'Not found' });
    }
  }
}

export default FilesController;
