
export interface SEO {
  title: string;
  description: string;
  keywords: string;
}

export interface Service {
  id: number;
  title: string;
  desc: string;
  imgUrl: string;
  icon: string;
}

export interface Brand {
  id: number;
  name: string;
  url: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  whatsappNumber: string;
  address: string;
  mapUrl: string;
  seo: SEO;
  services: Service[];
  brands: Brand[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Nuevo' | 'En Proceso' | 'Venta Realizada' | 'Cerrada';
  createdAt: number;
}
