export function generateTimestampedEmail(prefix: string, domain: string): string {
  const timestamp = Date.now().toString();
  const lastSixDigits = timestamp.slice(-6);
  const randomSuffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const localPart = `${prefix}${lastSixDigits}${randomSuffix}`;
  return `${localPart}@${domain}`;
}
