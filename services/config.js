const { CONTACT_DIRECTORY, HUMAN_LINE_PRODUCTS } = require("./contactDirectory");
const { PRODUCT_URL_SOURCES } = require("./productUrls");

const URL_SOURCES = PRODUCT_URL_SOURCES;

const BASE_MANUAL_SOURCES = [
  {
    title: "Uso de shampoo medicado",
    content:
      "El shampoo PUPPY es apto para caninos, equinos y bovinos. Ayuda a controlar infecciones leves en la piel."
  },
  {
    title: "Recomendación general",
    content:
      "Para infecciones cutáneas leves en perros se recomienda limpieza con productos medicados y seguimiento veterinario."
  },
  {
    title: "WhatsApp servicio al cliente",
    content: "Para consultas por WhatsApp de servicio al cliente en Vicar: (+57) 316 443 5619."
  },
  {
    title: "Teléfonos y canales de contacto Vicar",
    content:
      "Teléfonos de contacto Vicar: 601 742 5603 y (571) 742 5603 como teléfono principal. Servicio al cliente: servicioalcliente@vicar.com.co. Número con WhatsApp: (+57) 316 443 5619. Correo general: contactenos@vicar.com.co."
  },
  {
    title: "Regla para consultas de contacto",
    content:
      "Cuando pregunten por número celular, WhatsApp o número de contacto para compra, primero preguntar en qué ciudad o ubicación está el cliente y luego entregar contactos de esa zona usando el directorio de Vicar."
  },
  {
    title: "Captura de datos para ventas",
    content:
      "Si el cliente desea ser contactado por ventas, solicitar: nombre, celular, email y ciudad. Luego agradecer e informar que un encargado del área de ventas se pondrá en contacto lo antes posible."
  },
  {
    title: "Extensiones por área Vicar",
    content:
      "Teléfono principal: (571) 742 5603. Financiera - tesorería: Karen Velandia ext 112. Ventas - atención al cliente: Jenny Caicedo ext 130. Ventas - atención al cliente: Claret Pinto ext 144. Importaciones - asistente importaciones: Sandra Chía ext 188."
  },
  {
    title: "Ventas en Ecuador",
    content:
      "Para compras en Ecuador, el distribuidor autorizado es Vetagro. Instagram: https://www.instagram.com/vetagroscc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==. WhatsApp Vetagro: (+593) (9) 398 764 298."
  },
  {
    title: "Productos de línea humana en Vicar",
    content:
      "Los productos de línea humana corresponden a URLs con ruta vicar.com.co/humana. Productos de referencia: " +
      HUMAN_LINE_PRODUCTS.join(", ") +
      "."
  },
  {
    title: "Regla de dosis y ficha técnica",
    content:
      "Si preguntan frecuencia o dosificación y no está especificada claramente, indicar únicamente las dosis según la ficha técnica de cada medicamento. No inferir frecuencias no documentadas. Si piden dosis exacta para un animal, solicitar especie y peso para estimación cuando aplique."
  },
  {
    title: "Fichas técnicas de productos",
    content:
      "Las fichas técnicas de producto están disponibles para descarga en el enlace de cada producto, incluyendo la imagen destacada para su visualización."
  }
];

const CONTACT_MANUAL_SOURCES = CONTACT_DIRECTORY.map((contact, index) => ({
  title: `Directorio comercial ${contact.location}`,
  content: `${contact.district}. Contacto para ${contact.location}: ${contact.name}. Celular/WhatsApp: ${contact.phone}. Correo: ${contact.email}.`,
  metadata: {
    type: "contact",
    district: contact.district,
    location: contact.location,
    index
  }
}));

const MANUAL_SOURCES = [...BASE_MANUAL_SOURCES, ...CONTACT_MANUAL_SOURCES];

module.exports = {
  URL_SOURCES,
  MANUAL_SOURCES,
  CONTACT_DIRECTORY,
  HUMAN_LINE_PRODUCTS
};
