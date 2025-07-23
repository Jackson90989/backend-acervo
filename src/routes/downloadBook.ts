import express from 'express';
import path from 'path';
import prisma from '../prisma/cliente';

const router = express.Router();

router.get('/downloadBook/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, '..', '..','uploads', filename);

  try {
    // Buscar o livro no banco de dados usando o nome do arquivo
    const book = await prisma.book.findFirst({
      where: { filePath: filename },
    });

    // Nome de download amigável baseado no título do livro
    const nomeDownload = book?.title
      ? `${book.title.replace(/\s+/g, '_')}.pdf`
      : filename;

    res.download(filePath, nomeDownload, (err) => {
      if (err) {
        console.error('Erro ao baixar o arquivo:', err);
        res.status(500).send('Erro ao baixar o arquivo');
      }
    });
  } catch (err) {
    res.status(404).send('Arquivo não encontrado');
  }
});

export default router;
