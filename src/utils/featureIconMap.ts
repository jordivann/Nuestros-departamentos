import {
  Wifi,
  Snowflake,
  Tv,
  PawPrint,
  Car,
  Waves,
  Flame,
  WashingMachine,
  ShieldCheck,
  Sun,
  Users,
  Home,
  Wind,
} from "lucide-react";

export const FEATURE_ICON_MAP: Record<
  string,
  { label: string; Icon: React.FC<any>; type: "boolean" | "number" }
> = {
  wifi: { label: "Wifi", Icon: Wifi, type: "boolean" },
  ac: { label: "Aire acondicionado", Icon: Snowflake, type: "boolean" },
  tv: { label: "Televisor", Icon: Tv, type: "boolean" },
  mascotas: { label: "Apto mascotas", Icon: PawPrint, type: "boolean" },
  estacionamiento: { label: "Estacionamiento", Icon: Car, type: "boolean" },
  pileta: { label: "Pileta", Icon: Waves, type: "boolean" },
  parrilla: { label: "Parrilla", Icon: Flame, type: "boolean" },
  lavarropas: { label: "Lavarropas", Icon: WashingMachine, type: "boolean" },
  seguridad: { label: "Seguridad", Icon: ShieldCheck, type: "boolean" },
  terraza: { label: "Terraza", Icon: Sun, type: "boolean" },
  capacidad: { label: "Capacidad", Icon: Users, type: "number" },
  ambientes: { label: "Ambientes", Icon: Home, type: "number" },
  balcon: { label: "Balcón", Icon: Wind, type: "boolean" },
};
