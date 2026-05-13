import mercadopago from "mercadopago";

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {

    const { items } = req.body;

    const preference = {
      items: items.map(item => ({
        title: item.title,
        quantity: Number(item.quantity),
        currency_id: "UYU",
        unit_price: Number(item.unit_price)
      }))
    };

    const response = await mercadopago.preferences.create(preference);

    return res.status(200).json({
      init_point: response.body.init_point
    });

  } catch (error) {

    console.error("ERROR MP:", error);

    return res.status(500).json({
      error: error.message || "No se pudo crear el pago"
    });

  }

}
