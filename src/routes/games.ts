// src/routes/games.ts

import { Router } from 'express';
import prisma from '../prisma/cliente';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = 'chave_secreta';

// Middleware para autenticar token JWT
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

// Rota para cadastrar jogo (privada)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, filePath, coverImagePath } = req.body;

  try {
    const game = await prisma.game.create({
      data: { title, description, filePath, coverImagePath },
    });
    res.status(201).json(game);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao cadastrar jogo' });
  }
});

// Rota para listar jogos (pública) com campo coverImagePath para a capa
router.get('/', async (_req, res) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        filePath: true,
        coverImagePath: true,
      },
    });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar jogos' });
  }
});

export default router;
