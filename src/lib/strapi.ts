import type { PaginaConfig } from './strapi-types';

const BASE = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: any;
}

export async function fetchStrapi<T>(
  path: string,
  params: string = ''
): Promise<T> {
  const hasPopulate = params.includes('populate');
  const url = `${BASE}/api${path}?${hasPopulate ? params : `populate=*${params ? '&' + params : ''}`}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Strapi error: ${res.status} ${res.statusText}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    throw error;
  }
}

export async function fetchStrapiList<T>(
  path: string,
  params: string = ''
): Promise<T[]> {
  const hasPopulate = params.includes('populate');
  const url = `${BASE}/api${path}?${hasPopulate ? params : `populate=*${params ? '&' + params : ''}`}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Strapi error: ${res.status} ${res.statusText}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error(`Error fetching list ${path}:`, error);
    throw error;
  }
}

export async function fetchPaginaConfig(): Promise<PaginaConfig | null> {
  const url = `${BASE}/api/pagina-configs?populate=*`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json = await res.json();
    console.log('fetchPaginaConfig response:', json);
    // Retorna el primer documento si existe
    return json.data && json.data.length > 0 ? (json.data[0] as PaginaConfig) : null;
  } catch (error) {
    console.error('Error fetching pagina-config:', error);
    return null;
  }
}

export async function fetchSectors(): Promise<any[]> {
  const url = `${BASE}/api/sectors?populate=*&sort=order:asc`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Strapi error: ${res.status}`);
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('Error fetching sectors:', error);
    return [];
  }
}

export function getImageUrl(imageData: any): string {
  if (!imageData) return '';

  // Si es un objeto con url
  if (imageData.url) {
    return imageData.url.startsWith('http')
      ? imageData.url
      : `${BASE}${imageData.url}`;
  }

  // Si es string
  if (typeof imageData === 'string') {
    return imageData.startsWith('http')
      ? imageData
      : `${BASE}${imageData}`;
  }

  return '';
}
