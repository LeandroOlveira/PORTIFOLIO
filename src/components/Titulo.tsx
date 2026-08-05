export function Titulo({
  children,
  apoio,
  acao,
}: {
  children: React.ReactNode;
  apoio: React.ReactNode;
  acao?: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
      <h2 data-motion-title className="title title-vivo max-w-[14ch] text-[2.25rem] text-paper sm:text-[3rem] md:text-[3.75rem]">
        {children}
      </h2>

      <div data-motion-copy className="lg:pb-2">
        <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-mid sm:text-base">
          {apoio}
        </p>
        {acao ? <div className="mt-6">{acao}</div> : null}
      </div>
    </div>
  );
}
