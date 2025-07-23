import { Router, Response, Express } from 'express';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { verifyToken } from '../middleware/authMiddleware';
import prisma from '../prisma/cliente';
import path from 'path';
import multer from 'multer';

const router = Router();

// Configuração do multer para salvar arquivos com extensão original
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Rota para listar usuários pendentes - apenas admin com owner e email 'mendes'
router.get('/pending', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;
  console.log("Token user no backend:", user);

  if (!user?.owner || user.email !== 'mendes@gmail.com') {
    return res.status(403).json({ message: 'Acesso restrito ao administrador.' });
  }

  const pendentes = await prisma.user.findMany({
    where: { approved: false },
    select: { id: true, email: true },
  });

  return res.json(pendentes);
});

// Rota para aprovar usuário - apenas admin com owner e email 'mendes'
router.post('/approve/:id', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user?.owner || user.email !== 'mendes@gmail.com') {
    return res.status(403).json({ message: 'Acesso restrito ao administrador.' });
  }

  const id = parseInt(req.params.id);

  await prisma.user.update({
    where: { id },
    data: { approved: true },
  });

  return res.json({ message: 'Usuário aprovado com sucesso.' });
});

// Rota para upload de livro ou jogo
router.post("/post", 
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  async (req: AuthenticatedRequest, res: Response) => {
    const { title, description, type } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const file = files?.file?.[0];
    const coverImage = files?.coverImage?.[0];

    if (!file) return res.status(400).json({ error: 'Arquivo principal não enviado' });
    if (!coverImage) return res.status(400).json({ error: 'Imagem de capa não enviada' });

    try {
      if (type === "book") {
        const book = await prisma.book.create({
          data: {
            title,
            description,
            filePath: file.filename,
            coverImagePath: coverImage.filename,
          },
        });
        return res.json(book);
      } else if (type === "game") {
        const game = await prisma.game.create({
          data: {
            title,
            description,
            filePath: file.filename,
            coverImagePath: coverImage.filename,
          },
        });
        return res.json(game);

      } else if (type === "movie") {
        const { title, description, rating } = req.body;
        const movie = await prisma.movie.create({
          data: {
            title,
            description,
            rating: parseInt(rating) || 0,
            filePath: file.filename,
            coverImagePath: coverImage.filename,
           
          },
        });

        return res.json(movie);

      } else {
        return res.status(400).json({ error: 'Tipo inválido' });
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      return res.status(500).json({ error: 'Erro ao salvar conteúdo' });
    }
  }
);

export default router;
