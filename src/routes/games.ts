// src/routes/games.ts

import { Router } from 'express';
import prisma from '../prisma/cliente';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = 'chave_secreta';

function authMiddleware(req: any, res: any, next: any) {
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

// Cadastrar jogo (rota privada)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, filePath } = req.body;

  try {
    const game = await prisma.game.create({
      data: { title, description, filePath },
    });
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao cadastrar jogo' });
  }
});

// Listar jogos (pública)
router.get('/', async (_req, res) => {
  const games = await prisma.game.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(games);
});

export default router;
