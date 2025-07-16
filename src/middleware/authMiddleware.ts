// src/middlewares/verifyToken.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const SECRET = 'chave_secreta';

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
 const authHeader = req.headers['authorization'];
console.log("Authorization Header no backend:", authHeader);
 console.log("Authorization Header:", req.headers['authorization']);


  if (!authHeader) {
    return res.status(403).json({ message: 'Token não enviado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("Payload decodificado:", decoded);
    req.user = decoded as AuthenticatedRequest['user'];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};
