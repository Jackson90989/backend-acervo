import express from 'express';
import path from 'path';
import prisma from '../prisma/cliente';

const router = express.Router();

// 📥 Rota para download de filme
router.get('/downloadMovie/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, '..', '..', 'uploads', filename);

  try {
    // Busca o filme no banco de dados
    const movie = await prisma.movie.findFirst({
      where: { filePath: filename },
    });

    // Nome do arquivo para download
    const nomeDownload = movie?.title
      ? `${movie.title.replace(/\s+/g, '_')}.mp4`
      : filename;

    res.download(filePath, nomeDownload, (err) => {
      if (err) {
        console.error('Erro ao baixar o arquivo:', err);
        res.status(500).send('Erro ao baixar o arquivo');
      }
    });
  } catch (err) {
    console.error('Erro ao buscar o filme para download:', err);
    res.status(404).send('Arquivo não encontrado');
  }
});

// 🎬 Rota para assistir filme diretamente
router.get('/watchMovie/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, '..', '..', 'uploads', filename);

  try {
    // (Opcional) Verifica se o filme existe no banco de dados
    const movie = await prisma.movie.findFirst({
      where: { filePath: filename },
    });

    if (!movie) {
      return res.status(404).send('Filme não encontrado no banco de dados');
    }

    // Define o tipo do conteúdo como vídeo
    res.type('video/mp4');
    res.sendFile(filePath);
  } catch (err) {
    console.error('Erro ao carregar o vídeo:', err);
    res.status(500).send('Erro ao carregar o vídeo');
  }
});

export default router;
