const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");
const stripe = require("stripe")(
  "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"
);

app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.post("/payment-sheet", async (req, res) => {
  console.warn("HEHEHEH");
  const { amount } = req.body;
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});

app.listen(port, () => {
  console.warn("RUNINGGGGG at " + port);
});
