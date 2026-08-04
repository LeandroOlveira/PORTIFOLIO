import { Botao } from '@/components/Botao';

export default function NaoEncontrado() {
  return (
    <div className="bg-ink pt-14">
      <div className="shell flex min-h-[70svh] flex-col justify-center py-20">
        <p className="meta meta-lg text-mark">Página não encontrada</p>
        <h1 className="title mt-6 max-w-[16ch] text-[2.25rem] text-paper sm:text-[3rem]">
          Este endereço não existe
        </h1>
        <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-mid">
          O endereço que você abriu não corresponde a nenhuma página aqui. Pode ser um
          link antigo ou um erro de digitação.
        </p>
        <div className="mt-9">
          <Botao href="/">Voltar para o início</Botao>
        </div>
      </div>
    </div>
  );
}
