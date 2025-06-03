
import { User, StoredUser } from '@/types/auth';

export const getStoredUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem('user');
};

export const getStoredUsers = (): StoredUser[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const setStoredUsers = (users: StoredUser[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getResetRequests = (): Record<string, { code: string; expiresAt: number }> => {
  return JSON.parse(localStorage.getItem('resetRequests') || '{}');
};

export const setResetRequests = (requests: Record<string, { code: string; expiresAt: number }>): void => {
  localStorage.setItem('resetRequests', JSON.stringify(requests));
};
