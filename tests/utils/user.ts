import fs from 'fs';
import path from 'path';

export type TestUser = {
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
};

function getUserDataPath(workerId = 'default'): string {
  return path.resolve(__dirname, `../../test-results/test-users-${workerId}.json`);
}

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
}

export async function saveUser(user: TestUser, workerId?: string): Promise<string> {
  const dataPath = getUserDataPath(workerId);
  const payload = { ...user, createdAt: user.createdAt ?? new Date().toISOString() };
  await ensureDir(dataPath);
  const tmp = `${dataPath}.tmp`;
  await fs.promises.writeFile(tmp, JSON.stringify(payload, null, 2), 'utf8');
  await fs.promises.rename(tmp, dataPath);
  return dataPath;
}

export async function getLastUser(workerId?: string): Promise<TestUser | null> {
  const dataPath = getUserDataPath(workerId);
  try {
    const raw = await fs.promises.readFile(dataPath, 'utf8');
    return JSON.parse(raw) as TestUser;
  } catch (e) {
    return null;
  }
}

export default { saveUser, getLastUser };
