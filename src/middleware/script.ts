import prisma from '../prisma/cliente';
import bcrypt from 'bcryptjs';

async function main() {
  const passwordHash = await bcrypt.hash('1234', 10);

  const user = await prisma.user.upsert({
    where: { email: 'mendes' },
    update: { password: passwordHash, approved: true },
    create: {
      email: 'mendes',
      password: passwordHash,
      approved: true,
    },
  });

  console.log('Usuário mendes criado/atualizado:', user);
}

main()
  .catch(console.error)
  .finally(() => process.exit());
