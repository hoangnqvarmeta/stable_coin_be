import * as fs from 'fs';
import * as path from 'path';

const errorMessagesPath = path.resolve(__dirname, './errors.json');
const errorMessages = JSON.parse(fs.readFileSync(errorMessagesPath, 'utf8'));

export function getErrorMessage(key: string): {
  statusCode: number;
  message: string;
} {
  const errorMessage = errorMessages[key];
  if (!errorMessage) {
    return {
      statusCode: 500,
      message: 'internalServerError',
    };
  }
  return errorMessage;
}
