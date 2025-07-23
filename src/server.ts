// src/server.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth'; 
import bookRoutes from './routes/books';
import gameRoutes from './routes/games';
import adminRoutes from './routes/admin';
import publicRoutes from './routes/public';
import downloadRoute from './routes/downloadGame'; 
import downloadRoute2 from './routes/downloadBook';
import freetogameRouter from "./routes/freetogame";
import filmes from './routes/movies';
import downloadRoute3 from './routes/downloadMovie';
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
app.use('/', downloadRoute);
app.use('/', downloadRoute2);
app.use('/', downloadRoute3);
app.use('/freetogame', freetogameRouter);
app.use('/movies',filmes );


// Para servir os arquivos enviados (livros e jogos)
console.log('Servindo arquivos estáticos em:', path.resolve(__dirname, '..', 'uploads'));

app.use(
'/files',
  express.static(path.resolve(__dirname, '..', 'uploads'))
)

// Start do servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
