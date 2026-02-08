export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

export const JWT_SECRET = process.env.JWT_SECRET || 'bookwise-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '24h';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};
