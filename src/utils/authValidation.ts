
import { getStoredUsers, getResetRequests } from './authStorage';

export const validateUserCredentials = (email: string, password: string) => {
  const users = getStoredUsers();
  return users.find((u) => u.email === email && u.password === password);
};

export const checkEmailExists = (email: string): boolean => {
  const users = getStoredUsers();
  return users.some((u) => u.email === email);
};

export const validateResetCode = (email: string, resetCode: string): boolean => {
  const resetRequests = getResetRequests();
  const request = resetRequests[email];
  
  if (!request) return false;
  return request.code === resetCode && request.expiresAt > Date.now();
};

export const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
