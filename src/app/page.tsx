import { Abertura } from '@/components/Abertura';
import { Processo } from '@/components/Processo';
import { Projetos } from '@/components/Projetos';
import { Stack } from '@/components/Stack';
import { QuemSou } from '@/components/QuemSou';
import { Notas } from '@/components/Notas';
import { Contato } from '@/components/Contato';
import { getNotas, getProjetos } from '@/lib/content';

export default function Home() {
  const projetos = getProjetos();
  const notas = getNotas();

  return (
    <>
      <Abertura />
      <Projetos projetos={projetos} />
      <Stack />
      <Processo />
      <QuemSou />
      <Notas notas={notas} />
      <Contato />
    </>
  );
}
