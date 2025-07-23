// src/routes/movies.ts

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

// Cadastrar filme (rota privada)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, videoPath, filePath, rating, coverImagePath } = req.body;

  try {
    const movie = await prisma.movie.create({
      data: { title, description, filePath, rating, coverImagePath },
    });
    res.status(201).json(movie);
  } catch (err) {
    console.error('Erro ao cadastrar filme:', err);
    res.status(400).json({ message: 'Erro ao cadastrar filme' });
  }
});

// Listar filmes (pública)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        rating: true,
        filePath: true,   
        coverImagePath: true,
      },
    });
    res.json(movies);
  } catch (err) {
    console.error('Erro ao buscar filmes:', err);
    res.status(500).json({ message: 'Erro ao buscar filmes' });
  }
});

export default router;
