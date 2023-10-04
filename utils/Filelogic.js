#!/usr/bin/node
/* eslint-disable comma-dangle */

import {join} from 'path';

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

export const ReadFileContent = async (fileName) => {
  return await readFile(fileName)
}

export default {
  CreateDirectory,
  SaveFileLocally,
  ReadFileContent
};
