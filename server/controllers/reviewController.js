const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/database");

// Create review
const createReview = async (req, res) => {
  try {
    const reviewsCollection = getCollection("reviews");
    const applicationsCollection = getCollection("applications");
    const scholarshipsCollection = getCollection("scholarships");
    
    const review = req.body;

    // Validation
    const requiredFields = ["scholarshipId", "ratingPoint", "reviewComment"];
    const missingFields = requiredFields.filter((field) => !review[field]);

    if (missingFields.length > 0) {
      return res.status(400).send({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    if (review.ratingPoint < 1 || review.ratingPoint > 5) {
      return res.status(400).send({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check for existing review
    const existingReview = await reviewsCollection.findOne({
      scholarshipId: new ObjectId(review.scholarshipId),
      userEmail: req.tokenEmail,
    });

    if (existingReview) {
      return res.status(400).send({
        success: false,
        message: "You have already reviewed this scholarship",
      });
    }

    // Check if user has completed application
    const application = await applicationsCollection.findOne({
      scholarshipId: new ObjectId(review.scholarshipId),
      userEmail: req.tokenEmail,
      applicationStatus: "completed",
    });

    if (!application) {
      return res.status(403).send({
        success: false,
        message: "You can only review scholarships you have completed applications for",
      });
    }

    // Get scholarship details
    const scholarship = await scholarshipsCollection.findOne({
      _id: new ObjectId(review.scholarshipId),
    });

    if (!scholarship) {
      return res.status(404).send({
        success: false,
        message: "Scholarship not found",
      });
    }

    const reviewData = {
      scholarshipId: new ObjectId(review.scholarshipId),
      applicationId: application._id,
      universityId: application.universityId,
      scholarshipName: scholarship.scholarshipName,
      universityName: application.universityName,
      userName: req.tokenName || review.userName,
      userEmail: req.tokenEmail,
      userImage: review.userImage || "",
      ratingPoint: parseInt(review.ratingPoint),
      reviewComment: review.reviewComment.trim(),
      status: "published",
      reviewDate: new Date(),
      createdAt: new Date(),
      helpfulCount: 0,
      reportCount: 0,
    };

    const result = await reviewsCollection.insertOne(reviewData);

    // Update scholarship average rating
    const allReviews = await reviewsCollection
      .find({ scholarshipId: new ObjectId(review.scholarshipId) })
      .toArray();

    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((acc, cur) => acc + cur.ratingPoint, 0) /
        allReviews.length;

      await scholarshipsCollection.updateOne(
        { _id: new ObjectId(review.scholarshipId) },
        {
          $set: {
            avgRating: parseFloat(avgRating.toFixed(1)),
            totalReviews: allReviews.length,
            lastReviewDate: new Date(),
          },
        }
      );
    }

    res.send({
      success: true,
      message: "Review submitted successfully",
      data: {
        insertedId: result.insertedId,
        review: reviewData,
      },
    });
  } catch (err) {
    console.error("Create review error:", err);
    res.status(500).send({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get user's reviews
const getMyReviews = async (req, res) => {
  try {
    const reviewsCollection = getCollection("reviews");
    const email = req.tokenEmail;

    const reviews = await reviewsCollection
      .find({ userEmail: email })
      .sort({ reviewDate: -1 })
      .toArray();

    res.send({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.error("Get my reviews error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching user reviews",
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const reviewsCollection = getCollection("reviews");
    const { id } = req.params;
    const { ratingPoint, reviewComment } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });

    if (!review) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userEmail !== req.tokenEmail) {
      return res.status(403).send({
        success: false,
        message: "You can only edit your own reviews",
      });
    }

    if (ratingPoint && (ratingPoint < 1 || ratingPoint > 5)) {
      return res.status(400).send({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const updates = {};
    if (ratingPoint) updates.ratingPoint = parseInt(ratingPoint);
    if (reviewComment) updates.reviewComment = reviewComment.trim();
    updates.updatedAt = new Date();

    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    res.send({
      success: true,
      message: "Review updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Update review error:", err);
    res.status(500).send({
      success: false,
      message: "Error updating review",
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const reviewsCollection = getCollection("reviews");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });

    if (!review) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    if (review.userEmail !== req.tokenEmail) {
      return res.status(403).send({
        success: false,
        message: "You can only delete your own reviews",
      });
    }

    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

    res.send({
      success: true,
      message: "Review deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error("Delete review error:", err);
    res.status(500).send({
      success: false,
      message: "Error deleting review",
    });
  }
};

// Get reviews by scholarship ID
const getReviewsByScholarship = async (req, res) => {
  try {
    const reviewsCollection = getCollection("reviews");
    const { scholarshipId } = req.params;

    if (!ObjectId.isValid(scholarshipId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid scholarship ID",
      });
    }

    const reviews = await reviewsCollection
      .find({ scholarshipId: new ObjectId(scholarshipId) })
      .sort({ reviewDate: -1 })
      .toArray();

    res.send({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.error("Get reviews by scholarship error:", err);
    res.status(500).send({
      success: false,
      error: err.message,
    });
  }
};

// Get all reviews (Moderator)
const getAllReviews = async (req, res) => {
  try {
    const reviewsCollection = getCollection("reviews");

    const reviews = await reviewsCollection
      .find({})
      .sort({ reviewDate: -1 })
      .toArray();

    res.send({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.error("Get all reviews error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching reviews",
    });
  }
};

// Delete review as moderator
const deleteReviewModerator = async (req, res) => {
  try {
    const reviewsCollection = getCollection("reviews");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid review ID",
      });
    }

    const result = await reviewsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Review not found",
      });
    }

    res.send({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Delete review moderator error:", err);
    res.status(500).send({
      success: false,
      message: "Error deleting review",
    });
  }
};

module.exports = {
  createReview,
  getMyReviews,
  updateReview,
  deleteReview,
  getReviewsByScholarship,
  getAllReviews,
  deleteReviewModerator,
};