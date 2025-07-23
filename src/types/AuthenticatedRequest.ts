// src/types/AuthenticatedRequest.ts
import { Request } from 'express';

export interface TokenUser {
  userId: number;
  email: string;
  approved: boolean;
  owner?: boolean;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenUser;
}
