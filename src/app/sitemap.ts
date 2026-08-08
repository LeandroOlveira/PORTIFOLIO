import type { MetadataRoute } from 'next';
import { getNotas, getProjetos } from '@/lib/content';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();

  return [
    { url: site.url, lastModified: agora, priority: 1 },
    { url: `${site.url}/projetos`, lastModified: agora, priority: 0.9 },
    { url: `${site.url}/notas`, lastModified: agora, priority: 0.7 },
    ...getProjetos().map((p) => ({
      url: `${site.url}/projetos/${p.slug}`,
      lastModified: agora,
      priority: 0.8,
    })),
    ...getNotas().map((n) => ({
      url: `${site.url}/notas/${n.slug}`,
      lastModified: new Date(n.data),
      priority: 0.6,
    })),
  ];
}
