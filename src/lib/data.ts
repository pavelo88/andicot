import type { WebData, Service } from '@/lib/types';

export const webData: WebData = {
  hero: {
    titulo: 'Protegemos su infraestructura',
    subtitulo: 'Especialistas en el análisis, diseño e implementación de sistemas electrónicos y eléctricos...',
    version: 'v3.3',
    placeholder: 'Ingrese su búsqueda...',
  },
  estadisticas: {
    proyectos: '500+',
    años: '15+',
    uptime: '99.9%',
    soporte: '24/7',
  },
  contacto: {
    tel: '+593 98 446 7411',
    email: 'info@andicot.com',
    direccion: 'Quito - Ecuador. José Tamayo N24-33 y Baquerizo Moreno. Torres del Castillo, T2, Of. 903.',
    wa_link: 'https://wa.me/593984467411',
  },
  redes: {
    fb: 'https://www.facebook.com/andicot2018',
    ig: 'https://www.instagram.com/andicot.ec',
    tt: 'https://www.tiktok.com/@andicotec',
  },
  garantia: {
    btn: 'Ver Garantía',
    titulo: 'Políticas de Garantía',
    items: [
      '12 meses de garantía técnica.',
      'Asistencia remota inmediata.',
      'Trámite personal con factura.',
    ],
    btn_cierre: '[ ACEPTAR Y CERRAR ]',
  },
  paleta_colores: {
    dark_primary: '#00f2ff',
    dark_bg: '#000000',
    light_primary: '#0077ff',
    light_bg: '#f1f3f5',
  },
  finanzas: {
    iva: '15',
    descuento: '0',
  },
  marcas: [
    'PELCO', 'AVIGILON', 'MOTOROLA', 'LENEL', 'EDWARDS', 'BOSCH', 'NOTIFIER', 'TYCO', 'HIKVISION',
  ],
};

export const servicesData: Service[] = [
  {
    id: 'cctv-ia',
    titulo: 'CCTV con IA',
    icono: 'Video',
    descripcion: 'Sistemas de videovigilancia inteligentes con análisis de video en tiempo real para detección de anomalías y reconocimiento de objetos.',
    precio_base: 150,
  },
  {
    id: 'control-acceso',
    titulo: 'Control de Acceso',
    icono: 'UserCheck',
    descripcion: 'Soluciones de control de acceso biométrico y con tarjetas para garantizar la seguridad de sus instalaciones.',
    precio_base: 200,
  },
  {
    id: 'deteccion-incendios',
    titulo: 'Detección de Incendios',
    icono: 'Flame',
    descripcion: 'Sistemas de detección temprana de incendios con notificación automática a servicios de emergencia y monitoreo 24/7.',
    precio_base: 250,
  },
  {
    id: 'alarmas-intrusion',
    titulo: 'Alarmas de Intrusión',
    icono: 'ShieldAlert',
    descripcion: 'Sistemas de alarma avanzados para proteger su propiedad contra intrusiones no autorizadas, con sensores de última generación.',
    precio_base: 180,
  },
  {
    id: 'cableado-estructurado',
    titulo: 'Cableado Estructurado',
    icono: 'Network',
    descripcion: 'Diseño e implementación de infraestructura de red robusta y escalable para voz, datos y video, certificada bajo estándares internacionales.',
    precio_base: 300,
  },
  {
    id: 'automatizacion-edificios',
    titulo: 'Automatización de Edificios',
    icono: 'Building',
    descripcion: 'Sistemas integrados para la gestión inteligente de iluminación, climatización y seguridad en edificios (BMS).',
    precio_base: 500,
  },
  {
    id: 'mantenimiento-electrico',
    titulo: 'Mantenimiento Eléctrico',
    icono: 'Wrench',
    descripcion: 'Servicios de mantenimiento preventivo y correctivo para sistemas eléctricos de baja y media tensión, asegurando la continuidad operativa.',
    precio_base: 120,
  },
  {
    id: 'consultoria-seguridad',
    titulo: 'Consultoría de Seguridad',
    icono: 'ClipboardCheck',
    descripcion: 'Análisis de riesgos y diseño de estrategias de seguridad física y electrónica personalizadas para su organización.',
    precio_base: 400,
  },
  {
    id: 'integracion-sistemas',
    titulo: 'Integración de Sistemas',
    icono: 'GitMerge',
    descripcion: 'Integración de múltiples sistemas de seguridad y eléctricos (CCTV, acceso, incendios) en una plataforma unificada de gestión.',
    precio_base: 450,
  },
];
