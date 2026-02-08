import type { LucideIcon } from "lucide-react";

export type WebData = {
  hero: {
    titulo: string;
    subtitulo: string;
    version: string;
    placeholder: string;
  };
  estadisticas: {
    proyectos: string;
    años: string;
    uptime: string;
    soporte: string;
  };
  contacto: {
    tel: string;
    email: string;
    direccion: string;
    wa_link: string;
  };
  redes: {
    fb: string;
    ig: string;
    tt: string;
  };
  garantia: {
    btn: string;
    titulo:string;
    items: string[];
    btn_cierre: string;
  };
  paleta_colores: {
    dark_primary: string;
    dark_bg: string;
    light_primary: string;
    light_bg: string;
  };
  finanzas: {
    iva: string;
    descuento: string;
  };
  marcas: string[];
};

export type Service = {
  id: string;
  titulo: string;
  icono: string; // Name of the lucide-react icon
  descripcion: string;
  precio_base: number;
};
