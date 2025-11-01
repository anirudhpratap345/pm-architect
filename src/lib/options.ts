export type Tech = {
  id: string;
  name: string;
  slug: string;
  categories: string[];
  short_desc?: string;
  official_url?: string;
};

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  return getJson<string[]>(`/api/options/categories`);
}

export async function fetchPresets(): Promise<string[]> {
  return getJson<string[]>(`/api/options/presets`);
}

export async function fetchTechs(params?: { category?: string; search?: string }): Promise<Tech[]> {
  const qs = new URLSearchParams();
  if (params?.category) qs.set('category', params.category);
  if (params?.search) qs.set('search', params.search);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  return getJson<Tech[]>(`/api/options/techs${suffix}`);
}


