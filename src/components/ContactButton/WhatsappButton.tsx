import { MessageCircle } from "lucide-react";

interface Props {
  titulo?: string;
  direccion?: string;
}

export default function WhatsappButton({ titulo, direccion }: Props) {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER;

  if (!phone) {
    console.error("VITE_WHATSAPP_NUMBER no está definido");
    return null;
  }

  const hasDepartmentInfo = titulo && direccion;

  const message = hasDepartmentInfo
    ? encodeURIComponent(
        `Hola 👋
Quiero información sobre el departamento "${titulo}"
📍 ${direccion}

¿Me podrías indicar disponibilidad, precios y condiciones?`
      )
    : encodeURIComponent(
        `Hola 👋
Quisiera comunicarme para consultar qué departamento se ajusta mejor a mis necesidades.

Me gustaría recibir información sobre disponibilidad, precios y opciones. 

La fecha de mi viaje sería:
`
      );

  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-whatsapp"
    >
      <MessageCircle size={18} />
      <span>Consultar</span> 
      
    </a>
  );
}
