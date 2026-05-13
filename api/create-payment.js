import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    const validItems = items.map((item) => ({
      title: String(item.title),
      quantity: Number(item.quantity),
      unit_price: Number(item.unit_price),
      currency_id: "UYU"
    }));

    const result = await preference.create({
      body: {
        items: validItems,
        back_urls: {
          success: "https://TU-DOMINIO.com",
          failure: "https://TU-DOMINIO.com",
          pending: "https://TU-DOMINIO.com"
        },
        auto_return: "approved"
      }
    });

    return res.status(200).json({
      init_point: result.init_point
    });

  } catch (error) {
    console.error("Error Mercado Pago:", error);
    return res.status(500).json({
      error: "No se pudo crear el pago"
    });
  }
}
