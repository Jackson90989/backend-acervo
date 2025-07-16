import { Router } from 'express';
import prisma from '../prisma/cliente';
import path from 'path';
import fs from 'fs';

const router = Router();

// 📚 Listar livros
router.get('/books', async (req, res) => {
  const books = await prisma.book.findMany();
  res.json(books);
});

// 🎮 Listar jogos
router.get('/games', async (req, res) => {
  const games = await prisma.game.findMany();
  res.json(games);
});

// 📥 Baixar arquivo (livro ou jogo)
router.get('/download/:type/:filename', (req, res) => {
  const { type, filename } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Arquivo não encontrado' });
  }

  res.download(filePath);
});

export default router;
