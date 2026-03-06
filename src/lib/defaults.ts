import { SiteContent } from './types';

export const defaultSiteContent: SiteContent = {
  heroTitle: 'Título Principal del Hero',
  heroSubtitle: 'Un subtítulo atractivo que describe la propuesta de valor de tu negocio.',
  ctaText: 'Llamada a la Acción',
  whatsappNumber: '+593987654321',
  address: 'Tu Dirección Física, Ciudad, País',
  mapUrl: 'https://www.google.com/maps/embed?pb=...',
  seo: {
    title: 'Mi Sitio Web | Título para SEO',
    description: 'Descripción de mi sitio web optimizada para motores de búsqueda. Debe ser concisa y relevante.',
    keywords: 'palabra clave 1, palabra clave 2, palabra clave 3',
  },
  services: [
    { id: 1, title: 'Servicio de Ejemplo 1', desc: 'Descripción detallada sobre lo que ofrece el Servicio 1.', imgUrl: '', icon: 'Cpu' },
    { id: 2, title: 'Servicio de Ejemplo 2', desc: 'Descripción detallada sobre lo que ofrece el Servicio 2.', imgUrl: '', icon: 'Server' },
  ],
  brands: [
    { id: 1, name: 'Marca Ejemplo', url: '' }
  ],
};
