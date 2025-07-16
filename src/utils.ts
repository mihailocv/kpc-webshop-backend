import { randomBytes } from 'crypto';
import { extname } from 'path';

export const generateFilename = (file: Express.Multer.File) => {
  const randomName = randomBytes(16).toString('hex');
  return `${randomName}${extname(file.originalname)}`;
};
