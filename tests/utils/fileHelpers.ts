import fs from 'fs';
import path from 'path';

/**
 * Ensure directory exists for a given file path
 */
export async function ensureDir(filePath: string): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.promises.mkdir(dir, { recursive: true });
}

/**
 * Generic function to save JSON data to a file atomically
 */
export async function saveJsonFile<T>(filePath: string, data: T): Promise<void> {
  await ensureDir(filePath);
  const tmp = `${filePath}.tmp`;
  await fs.promises.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.promises.rename(tmp, filePath);
}

/**
 * Generic function to load JSON data from a file
 */
export async function loadJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch (e) {
    return null;
  }
}

/**
 * Get path to test results file for a given worker
 */
export function getTestResultsPath(filename: string, workerId = 'default'): string {
  return path.resolve(__dirname, `../../test-results/${filename}-${workerId}.json`);
}
