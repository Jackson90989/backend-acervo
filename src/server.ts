// src/server.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth'; // 🔥 Importando as rotas de autenticação
import bookRoutes from './routes/books';
import gameRoutes from './routes/games';
import adminRoutes from './routes/admin';
import publicRoutes from './routes/public';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors({}));
app.use(express.json());

// 📌 Registro das rotas
app.use('/auth', authRoutes);        // ✅ Rota para registro/login de admin
app.use('/books', bookRoutes);
app.use('/games', gameRoutes);
app.use('/admin', adminRoutes);
app.use('/public', publicRoutes);

// Para servir os arquivos enviados (livros e jogos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start do servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
