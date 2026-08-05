import { Corredor } from '@/components/Corredor';
import { Stack } from '@/components/Stack';
import { Processo } from '@/components/Processo';
import { Trajetoria } from '@/components/Trajetoria';
import { Notas } from '@/components/Notas';
import { Contato } from '@/components/Contato';
import { getNotas, getProjetos } from '@/lib/content';

export default function Home() {
  const projetos = getProjetos();
  const notas = getNotas();

  return (
    <>
      <Corredor projetos={projetos} />
      <Stack />
      <Processo />
      <Trajetoria />
      <Notas notas={notas} />
      <Contato />
    </>
  );
}
