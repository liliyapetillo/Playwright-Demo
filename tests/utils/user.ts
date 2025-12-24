import { getTestResultsPath, saveJsonFile, loadJsonFile } from './fileHelpers';

export type TestUser = {
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
};

function getUserDataPath(workerId = 'default'): string {
  return getTestResultsPath('test-users', workerId);
}

export async function saveUser(user: TestUser, workerId?: string): Promise<string> {
  const dataPath = getUserDataPath(workerId);
  const payload = { ...user, createdAt: user.createdAt ?? new Date().toISOString() };
  await saveJsonFile(dataPath, payload);
  return dataPath;
}

export async function getLastUser(workerId?: string): Promise<TestUser | null> {
  const dataPath = getUserDataPath(workerId);
  return loadJsonFile<TestUser>(dataPath);
}

export default { saveUser, getLastUser };
