const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/database");

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const wishlistCollection = getCollection("wishlist");
    const scholarshipsCollection = getCollection("scholarships");
    const { userEmail, scholarshipId } = req.body;

    if (!userEmail || !scholarshipId) {
      return res.status(400).send({
        success: false,
        message: "userEmail and scholarshipId are required",
      });
    }

    // Check if already in wishlist
    const existing = await wishlistCollection.findOne({
      userEmail,
      scholarshipId: new ObjectId(scholarshipId),
    });

    if (existing) {
      return res.status(400).send({
        success: false,
        message: "Already in wishlist",
      });
    }

    // Get scholarship details
    const scholarship = await scholarshipsCollection.findOne({
      _id: new ObjectId(scholarshipId),
    });

    if (!scholarship) {
      return res.status(404).send({
        success: false,
        message: "Scholarship not found",
      });
    }

    const wishlistItem = {
      userEmail,
      scholarshipId: new ObjectId(scholarshipId),
      createdAt: new Date(),
      updatedAt: new Date(),
      scholarshipDetails: scholarship,
    };

    const result = await wishlistCollection.insertOne(wishlistItem);

    res.send({
      success: true,
      message: "Added to wishlist",
      data: result,
    });
  } catch (err) {
    console.error("Add to wishlist error:", err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlistCollection = getCollection("wishlist");
    const { email } = req.params;

    if (req.tokenEmail !== email) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const wishlistItems = await wishlistCollection
      .find({ userEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    const scholarships = wishlistItems.map((item) => item.scholarshipDetails);

    res.send({
      success: true,
      data: scholarships,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const wishlistCollection = getCollection("wishlist");
    const { email, scholarshipId } = req.params;

    if (req.tokenEmail !== email) {
      return res.status(403).send({
        success: false,
        message: "Unauthorized access",
      });
    }

    const result = await wishlistCollection.deleteOne({
      userEmail: email,
      scholarshipId: new ObjectId(scholarshipId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Item not found in wishlist",
      });
    }

    res.send({
      success: true,
      message: "Removed from wishlist",
      data: result,
    });
  } catch (error) {
    console.error("Remove from wishlist error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};