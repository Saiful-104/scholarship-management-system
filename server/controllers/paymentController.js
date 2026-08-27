const { ObjectId } = require("mongodb");
const { createCheckoutSession, retrieveSession } = require("../services/stripeService");
const { getCollection } = require("../config/database");

// Create checkout session
const createSession = async (req, res) => {
  try {
    const paymentInfo = req.body;
    const result = await createCheckoutSession(paymentInfo);
    res.send(result);
  } catch (err) {
    console.error("Stripe Checkout Error:", err);
    res.status(500).send({ 
      success: false,
      message: err.message || "Failed to create checkout session" 
    });
  }
};

// Handle payment success
const handlePaymentSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const applicationsCollection = getCollection("applications");
    const scholarshipsCollection = getCollection("scholarships");

    const session = await retrieveSession(sessionId);

    if (session.payment_status === "paid") {
      const existingApp = await applicationsCollection.findOne({
        scholarshipId: new ObjectId(session.metadata.scholarshipId),
        userEmail: session.metadata.userEmail,
      });

      if (!existingApp) {
        const scholarship = await scholarshipsCollection.findOne({
          _id: new ObjectId(session.metadata.scholarshipId),
        });

        const application = {
          scholarshipId: new ObjectId(session.metadata.scholarshipId),
          userId: session.metadata.userId,
          userName: session.metadata.userName,
          userEmail: session.metadata.userEmail,
          universityName: scholarship ? scholarship.universityName : "Unknown",
          subjectCategory: scholarship ? scholarship.subjectCategory : "",
          scholarshipCategory: scholarship ? scholarship.scholarshipCategory : "Unknown",
          degree: scholarship ? scholarship.degree : "Unknown",
          applicationFees: scholarship ? scholarship.applicationFees : 0,
          serviceCharge: scholarship ? scholarship.serviceCharge || 0 : 0,
          applicationStatus: "pending",
          paymentStatus: "paid",
          applicationDate: new Date(),
          feedback: "",
        };

        await applicationsCollection.insertOne(application);
      } else {
        await applicationsCollection.updateOne(
          { _id: existingApp._id },
          { $set: { paymentStatus: "paid" } }
        );
      }

      return res.send({
        success: true,
        message: "Payment successful and application saved!",
        scholarshipId: session.metadata.scholarshipId,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Payment not completed",
      });
    }
  } catch (err) {
    console.error("Payment Success Error:", err);
    res.status(500).send({
      success: false,
      message: "Error saving application",
    });
  }
};

module.exports = {
  createSession,
  handlePaymentSuccess,
};