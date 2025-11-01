// Catalog API helpers for categories, techs, and metrics

export type Category = {
  id: string;
  label: string;
  description?: string;
};

export type Tech = {
  id: string;
  name: string;
  slug: string;
  short_desc?: string;
  categories: string[];
  tags: string[];
  aliases: string[];
  meta: Record<string, any>;
  popularity: number;
};

export type MetricTemplate = {
  metric_id: string;
  title: string;
  description: string;
  scale?: string;
};

export type EvidenceRef = {
  source_id: string;
  excerpt: string;
  url?: string;
};

export type TechMetricItem = {
  metric_id: string;
  score: number;
  delta?: number;
  explained_reason?: string;
  confidence?: number;
  evidence_refs?: EvidenceRef[];
};

export type TechMetricsResponse = {
  tech_id: string;
  metrics: TechMetricItem[];
  last_updated?: string;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
  return getJson<Category[]>(`/api/categories`);
}

export async function fetchTechs(params?: {
  category?: string;
  search?: string;
  limit?: number;
}): Promise<Tech[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.search) qs.set('search', params.search);
  if (params?.limit) qs.set('limit', String(params.limit));
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return getJson<Tech[]>(`/api/techs${suffix}`);
}

export async function fetchTech(techId: string): Promise<Tech> {
  return getJson<Tech>(`/api/tech/${techId}`);
}

export async function fetchMetricTemplates(): Promise<MetricTemplate[]> {
  return getJson<MetricTemplate[]>(`/api/metrics/templates`);
}

export async function fetchTechMetrics(techId: string): Promise<TechMetricsResponse> {
  return getJson<TechMetricsResponse>(`/api/tech/${techId}/metrics`);
}

