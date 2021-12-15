const { Router } = require("express");
const router = Router();
const mercadopago = require("mercadopago");
const { encrypt } = require("../users/utils");
const Sales = require("../../models/Sales");
const Institution = require("../../models/Institution");

mercadopago.configure({
  access_token:
    "TEST-102980178963781-121022-2bd48d71c22e89069502432b4ad8d8d8-379616593",
});

//venta paso 1
router.post("/ask-pay", async (req, res) => {
  const {
    institution,
    email,
    id_orden,
    title,
    quantity,
    unit_price,
    suscriptionTo,
  } = req.body;
  const ticket = encrypt(id_orden);
  const fecha = new Date();

  var newSale = await new Sales({
    hashed_token: ticket,
    date: `${fecha}`,
    institution: institution,
    product: title,
    suscriptionTo,
  });
  newSale.save();

  var preference = {
    items: [
      {
        title,
        quantity,
        currency_id: "ARS",
        unit_price,
      },
    ],
    external_reference: id_orden,
    excluded_payment_types: [
      {
        id: "ticket",
      },
    ],
    payer: {
      institution: institution,
      email: email,
    },
    back_urls: {
      success: "http://localhost:3001/payment/control-pay",
      failure: `http://localhost:3000/payment/admin/verify-sale/false`,
    },
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      // Este valor reemplazará el string "<%= global.id %>" en tu HTML
      global.id = response.body.id;
      res.json({ id: global.id, res: response.body.init_point });
    })
    .catch(function (error) {});
});

//venta paso 2 control y redirect
router.get("/control-pay", async (req, res) => {
  const id_orden = req.query.external_reference;

  try {
    await Sales.findOneAndUpdate(
      { hashed_token: encrypt(id_orden) },
      {
        $set: {
          verified: true,
        },
        new: true,
      }
      /* (err, result) => {
        if (result)
          return res.redirect(
            'http://localhost:3000/payment/admin/verify-sale/true'
          )
        if (err)
          return res.redirect(
            'http://localhost:3000/payment/admin/verify-sale/true'
          )
      } */
    );
  } catch (error) {}

  return res.redirect(
    `http://localhost:3000/institucion/admin/payment?success=true`
  );
});

router.post("/verifyTruePayment", async (req, res) => {
  let today = new Date().toLocaleDateString();
  let { institution } = req.body;

  let salePaid = await Sales.find({ institution: institution }).sort({
    date: -1,
  });
  let fechaExpire = salePaid[0].suscriptionTo;
  if (salePaid[0].verified === true) {
    await Institution.findOneAndUpdate(
      { name: institution },
      {
        suscription: fechaExpire,
      }
    );
  }
});

module.exports = router;
