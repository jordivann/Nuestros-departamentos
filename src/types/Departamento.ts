export interface Caracteristicas {
  ac: boolean;                 // aire acondicionado
  ambientes: number;
  balcon: boolean;
  cable: boolean;
  calefaccion: boolean;
  capacidad: number;
  estacionamiento: boolean;
  fumadores: boolean;
  lavarropas: boolean;
  mascotas: boolean;
  parrilla: boolean;
  patio: boolean;
  pileta: boolean;
  ropa_cama: boolean;
  secador_pelo: boolean;
  seguridad: boolean;
  terraza: boolean;
  tv: boolean;
  wifi: boolean;

  [key: string]: string | number | boolean;
}

export interface Departamento {
  id: string;
  titulo: string;
  descripcion: string;

  direccion: string;
  ciudad: string;
  provincia: string;
  pais: string;

  coordenadas: {
    lat: number;
    lng: number;
  };

  imagenes: string[];

  color_principal: string;
  caracteristicas: Caracteristicas;

  observaciones: string;

  puntos_interes: string[];

  status: boolean;

  precio_base_noche: number; 
}
