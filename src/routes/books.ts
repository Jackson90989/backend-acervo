// src/routes/books.ts

import { Router, Request, Response } from 'express';
import prisma from '../prisma/cliente';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = 'chave_secreta';

// Middleware de autenticação
function authMiddleware(req: Request & { user?: any }, res: Response, next: Function) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'Token ausente' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' });
  }
}

// Cadastrar livro (rota privada)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, filePath, coverImagePath } = req.body;

  try {
    const book = await prisma.book.create({
      data: { title, description, filePath, coverImagePath },
    });
    res.status(201).json(book);
  } catch (err) {
    console.error('Erro ao cadastrar livro:', err);
    res.status(400).json({ message: 'Erro ao cadastrar livro' });
  }
});

// Listar livros (pública)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        filePath: true,
        coverImagePath: true,
      },
    });
    res.json(books);
  } catch (err) {
    console.error('Erro ao buscar livros:', err);
    res.status(500).json({ message: 'Erro ao buscar livros' });
  }
});

export default router;
