import { generateTimestampedEmail } from './email';

export type GeneratedContact = {
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  country: string;
  postalCode: string;
  city: string;
  state: string;
  address: string;
};

export function generateContact(options: Partial<GeneratedContact> = {}): GeneratedContact {
  const timestamp = Date.now().toString().slice(-5);
  
  return {
    email: options.email || generateTimestampedEmail('test', 'testliliyap.com'),
    firstName: options.firstName || `Test${timestamp}`,
    lastName: options.lastName || `User${timestamp}`,
    dob: options.dob || '1990-01-01',
    phone: options.phone || '5555551234',
    country: options.country || 'USA',
    postalCode: options.postalCode || '12345',
    city: options.city || 'TestCity',
    state: options.state || 'CA',
    address: options.address || '123 Test St',
  };
}
