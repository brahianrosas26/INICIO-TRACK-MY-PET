import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
});

const preference = new Preference(client);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {

    const { items } = req.body;

    const result = await preference.create({
      body: {
        items
      }
    });

    return res.status(200).json({
      init_point: result.init_point
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "No se pudo crear el pago"
    });

  }

}
