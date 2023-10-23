#!/usr/bin/node
/* eslint-disable comma-dangle */
/* eslint-disable no-return-await */
import { join } from 'path';

import mime from 'mime-types';

const fs = require('fs').promises;

const { mkdir, writeFile, readFile } = fs;

export const CreateDirectory = async (path) => {
  await mkdir(path, { recursive: true });
};

export const SaveFileLocally = async (BaseDir, fileName, FileContent) => {
  let localPath = fileName;
  if (BaseDir) {
    localPath = join(BaseDir, fileName);
  }
  await writeFile(localPath, FileContent);
  return localPath;
};

export const ReadFileContent = async (fileName) => await readFile(fileName);

export const GenerateFilePath = (BaseDir, FileName) => {
  if (BaseDir) {
    return join(BaseDir, FileName);
  }
  return FileName;
};

export const GetMimeType = (fileName) => mime.lookup(fileName);

export default {
  CreateDirectory,
  SaveFileLocally,
  ReadFileContent,
  GetMimeType,
  GenerateFilePath
};
