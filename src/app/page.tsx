import { Abertura } from '@/components/Abertura';
import { Processo } from '@/components/Processo';
import { Projetos } from '@/components/Projetos';
import { Stack } from '@/components/Stack';
import { Trajetoria } from '@/components/Trajetoria';
import { Notas } from '@/components/Notas';
import { Contato } from '@/components/Contato';
import { ScrollExperience } from '@/components/ScrollExperience';
import { getNotas, getProjetos } from '@/lib/content';

export default function Home() {
  const projetos = getProjetos();
  const notas = getNotas();

  return (
    <>
      <ScrollExperience />
      <Abertura />
      <Projetos projetos={projetos} />
      <Stack />
      <Processo />
      <Trajetoria />
      <Notas notas={notas} />
      <Contato />
    </>
  );
}
