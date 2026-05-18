export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}

export interface HeroSlide {
  id: number;
  documentId: string;
  image: StrapiMedia;
  title: string | null;
  subtitle: string | null;
  order: number;
  isActive: boolean;
  publishedAt: string | null;
}

export interface TeamMember {
  id: number;
  documentId: string;
  name: string;
  role: string | null;
  bio: string | null;
  photo: StrapiMedia | null;
  order: number;
  slug: string;
  experience: string | null;
  email: string | null;
  phone: string | null;
  category: 'socio' | 'asociado' | 'asociada' | 'consultor';
  education: string[] | null;
  highlights: string[] | null;
  practiceAreas: string[] | null;
  industries: string[] | null;
  languages: string[] | null;
  achievements: string[] | null;
  publishedAt: string | null;
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  author: TeamMember | null;
  publishedDate: string | null;
  readTime: number | null;
  category:
    | 'Energia'
    | 'Laboral'
    | 'Arbitraje'
    | 'APPs'
    | 'Corporativo'
    | 'Administrativo'
    | null;
  image: StrapiMedia | null;
  featured: boolean;
  publishedAt: string | null;
}

export interface Sector {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  content: string | null;
  image: StrapiMedia | null;
  order: number;
  subtitle: string | null;
  services: string[] | null;
  icon: string | null;
  publishedAt: string | null;
}

export interface Service {
  id: number;
  documentId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  order: number;
  number: string | null;
  scope: any[] | null;
  methodology: string[] | null;
  areas: string[] | null;
  valueProposition: any[] | null;
  cycle: any[] | null;
  servicesDetail: any[] | null;
  lifecycle: any[] | null;
  complementary: any[] | null;
  ambits: string[] | null;
  features: string[] | null;
  frameworks: string[] | null;
  publishedAt: string | null;
}

export interface PaginaConfig {
  bannerNosotros: StrapiMedia | null;
  bannerServicios: StrapiMedia | null;
  bannerSectores:  StrapiMedia | null;
  bannerAbogados:  StrapiMedia | null;
  bannerBlog:      StrapiMedia | null;
  bannerContacto:  StrapiMedia | null;
  imagenAcerca:    StrapiMedia | null;
}

export const CATEGORY_LABELS: Record<string, string> = {
  Energia: 'Energía',
  Laboral: 'Laboral',
  Arbitraje: 'Arbitraje',
  APPs: 'APPs',
  Corporativo: 'Corporativo',
  Administrativo: 'Administrativo',
};
