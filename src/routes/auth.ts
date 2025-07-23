// src/routes/auth.ts
import { Router } from 'express';
import prisma from '../prisma/cliente';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET = 'chave_secreta'; // 🔐 Pode vir do .env depois

// 📌 Registro (cadastro) de admin
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hash,
        approved: false,
      },
    });

    res.status(201).json({ message: 'Solicitação de cadastro enviada. Aguarde aprovação.' });
  } catch (err) {
    res.status(400).json({ message: 'Erro ao cadastrar', error: err });
  }
});

// 📌 Login de admin (com verificação de dono)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Define owner baseado no email (senha já validada pelo bcrypt)
  const isOwner = user.email === 'mendes@gmail.com';

  if (!user.approved && !isOwner) {
    return res.status(403).json({ message: 'Cadastro ainda não aprovado pelo administrador.' });
  }

  const token = jwt.sign(
    {
      userId: user.id,
       email: user.email,
      owner: isOwner, // 🔒 se for mendes, recebe owner: true
    },
    SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
});

export default router;
