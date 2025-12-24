import { getTestResultsPath, saveJsonFile } from './fileHelpers';

export type TestToken = {
  token: string;
  userEmail: string;
  createdAt?: string;
};

function getTokenDataPath(workerId = 'default'): string {
  return getTestResultsPath('test-token', workerId);
}

export async function saveToken(token: string, userEmail: string, workerId?: string): Promise<string> {
  const dataPath = getTokenDataPath(workerId);
  const payload = { token, userEmail, createdAt: new Date().toISOString() };
  await saveJsonFile(dataPath, payload);
  return dataPath;
}
