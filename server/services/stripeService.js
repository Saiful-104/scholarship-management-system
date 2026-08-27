const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (paymentInfo) => {
  try {
    const amount = Number(paymentInfo.applicationFees) || 0;

    if (amount === 0) {
      throw new Error("Application fee is 0, no payment required");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: paymentInfo.scholarshipName,
              description: `Application Fee for ${paymentInfo.degree} at ${paymentInfo.universityName}`,
              metadata: {
                scholarshipId: paymentInfo.scholarshipId,
              },
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: paymentInfo.customer.email,
      metadata: {
        scholarshipId: paymentInfo.scholarshipId,
        userId: paymentInfo.customer.id || "",
        userName: paymentInfo.customer.name,
        userEmail: paymentInfo.customer.email,
      },
      success_url: `${process.env.CLIENT_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_DOMAIN}/payment-cancel`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    throw error;
  }
};

const retrieveSession = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Stripe Retrieve Session Error:", error);
    throw error;
  }
};

module.exports = {
  createCheckoutSession,
  retrieveSession,
};