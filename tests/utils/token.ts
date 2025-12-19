import fs from 'fs';
import path from 'path';

export type TestToken = {
  token: string;
  userEmail: string;
  createdAt?: string;
};

function getTokenDataPath(workerId = 'default'): string {
  return path.resolve(__dirname, `../../test-results/test-token-${workerId}.json`);
}

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
}

export async function saveToken(token: string, userEmail: string, workerId?: string): Promise<string> {
  const dataPath = getTokenDataPath(workerId);
  const payload = { token, userEmail, createdAt: new Date().toISOString() };
  await ensureDir(dataPath);
  const tmp = `${dataPath}.tmp`;
  await fs.promises.writeFile(tmp, JSON.stringify(payload, null, 2), 'utf8');
  await fs.promises.rename(tmp, dataPath);
  return dataPath;
}

export async function getLastToken(workerId?: string): Promise<TestToken | null> {
  const dataPath = getTokenDataPath(workerId);
  try {
    const raw = await fs.promises.readFile(dataPath, 'utf8');
    return JSON.parse(raw) as TestToken;
  } catch (e) {
    return null;
  }
}

export default { saveToken, getLastToken };
