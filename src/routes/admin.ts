// src/routes/admin.ts
import { Router, Response, Express } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { verifyToken } from '../middleware/authMiddleware';
import prisma from '../prisma/cliente';
import path from 'path';
import multer from 'multer';

const router = Router();

router.get('/pending', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
console.log("Token user no backend:", user);

  if (!user?.owner || user.email !== 'mendes') {
    return res.status(403).json({ message: 'Acesso restrito ao administrador.' });
  }

  const pendentes = await prisma.user.findMany({
    where: { approved: false },
    select: { id: true, email: true },
  });

  return res.json(pendentes);
});

router.post('/approve/:id', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user?.owner || user.email !== 'mendes') {
    return res.status(403).json({ message: 'Acesso restrito ao administrador.' });
  }

  const id = parseInt(req.params.id);

  await prisma.user.update({
    where: { id },
    data: { approved: true },
  });

  return res.json({ message: 'Usuário aprovado com sucesso.' });
});

const upload = multer({
  dest: path.join(__dirname, "..", "uploads")
});

router.post("/post", upload.single("file"), async (req, res) => {
  const { title, description, type } = req.body;
  const file = req.file;

  if (!title || !description || !type || !file) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  // Aqui você salva no banco, etc...
  return res.status(201).json({ message: "Post criado com sucesso" });
});

export default router;
