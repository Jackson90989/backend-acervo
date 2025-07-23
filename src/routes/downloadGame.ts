import express from 'express';
import path from 'path';
import prisma from '../prisma/cliente'; // ajuste conforme seu projeto
import archiver from 'archiver';
import fs from 'fs';

const router = express.Router();

router.get('/downloadGame/:filename', async (req, res) => {
  const filename = req.params.filename;
  const filePath = path.resolve(__dirname, '..', '..', 'uploads', filename);

  // Verifica se o arquivo existe no sistema de arquivos
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Arquivo não encontrado');
  }

  try {
    // Busca informações do jogo no banco para nomear o arquivo zip amigavelmente
    const game = await prisma.game.findFirst({
      where: { filePath: filename },
    });

    // Define o nome do arquivo zip a ser baixado (ex: Jogo_Exemplo.zip)
    const zipFileName = game?.title
      ? `${game.title.replace(/\s+/g, '_')}.zip`
      : `${path.parse(filename).name}.zip`;

    // Define os headers para download de arquivo zip
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
    res.setHeader('Content-Type', 'application/zip');

    // Cria o arquivador zip
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Trata erros do arquivador
    archive.on('error', (err) => {
      console.error('Erro no arquivador:', err);
      res.status(500).send({ error: err.message });
    });

    // Envia o conteúdo do zip como resposta HTTP
    archive.pipe(res);

    // Adiciona o arquivo original dentro do zip, com o nome original
    archive.file(filePath, { name: filename });

    // Finaliza o zip
    archive.finalize();

  } catch (err) {
    console.error('Erro ao processar o download:', err);
    res.status(500).send('Erro ao processar o download');
  }
});

export default router;
