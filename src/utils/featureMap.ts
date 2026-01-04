import {
  Wifi,
  Snowflake,
  Tv,
  Car,
  PawPrint,
  Waves,
  Flame,
  WashingMachine,
  ShieldCheck,
  Sun,
  Users,
  Home,
} from "lucide-react";

export const FEATURES_MAP = {
  wifi: { label: "Wifi", icon: Wifi },
  ac: { label: "Aire acondicionado", icon: Snowflake },
  tv: { label: "Televisor", icon: Tv },
  estacionamiento: { label: "Estacionamiento", icon: Car },
  mascotas: { label: "Mascotas", icon: PawPrint },
  pileta: { label: "Pileta", icon: Waves },
  parrilla: { label: "Parrilla", icon: Flame },
  lavarropas: { label: "Lavarropas", icon: WashingMachine },
  seguridad: { label: "Seguridad", icon: ShieldCheck },
  terraza: { label: "Terraza", icon: Sun },
  capacidad: { label: "Capacidad", icon: Users },
  ambientes: { label: "Ambientes", icon: Home },
} as const;


export type FeatureKey = keyof typeof FEATURES_MAP;