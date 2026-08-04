import type { ProjectStatus } from '@/lib/content';

const statusLabels: Record<ProjectStatus, string> = {
  publicado: 'Publicado',
  entregue: 'Entregue',
  'em-construcao': 'Em construção',
  demonstracao: 'Demonstração',
};

export function StatusProjeto({ status }: { status: ProjectStatus }) {
  return (
    <span className="meta inline-flex items-center gap-2 text-mid">
      <span
        aria-hidden
        className={`block h-2 w-2 ${
          status === 'publicado' || status === 'entregue' ? 'bg-mark' : 'border border-mid'
        }`}
      />
      {statusLabels[status]}
    </span>
  );
}
