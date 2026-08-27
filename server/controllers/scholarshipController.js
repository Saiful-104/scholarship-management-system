const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/database");

// Get all scholarships with filtering, sorting, pagination
const getScholarships = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const {
      search,
      category,
      subject,
      country,
      degree,
      page = 1,
      limit = 9,
      sort = "applicationFees",
      order = "asc",
    } = req.query;

    let query = {};

    // Search functionality
    if (search && search.trim() !== "") {
      query.$or = [
        { scholarshipName: { $regex: search, $options: "i" } },
        { universityName: { $regex: search, $options: "i" } },
        { degree: { $regex: search, $options: "i" } },
      ];
    }

    // Filters
    if (category && category !== "all") query.scholarshipCategory = category;
    if (subject && subject !== "all") query.subjectCategory = subject;
    if (country && country !== "all") query.universityCountry = country;
    if (degree && degree !== "all") query.degree = degree;

    const currentPage = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (currentPage - 1) * pageSize;

    // Sorting
    const sortOrder = order === "desc" ? -1 : 1;
    let sortObj = {};
    if (sort === "applicationFees") {
      sortObj = { applicationFees: sortOrder };
    } else if (sort === "scholarshipPostDate") {
      sortObj = { scholarshipPostDate: sortOrder };
    } else {
      sortObj = { applicationFees: 1 };
    }

    const total = await scholarshipsCollection.countDocuments(query);
    const scholarships = await scholarshipsCollection
      .find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .toArray();

    res.send({
      success: true,
      data: scholarships,
      pagination: {
        currentPage,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    console.error("Get scholarships error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching scholarships",
    });
  }
};

// Get single scholarship by ID
const getScholarshipById = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid scholarship ID",
      });
    }

    const scholarship = await scholarshipsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!scholarship) {
      return res.status(404).send({
        success: false,
        message: "Scholarship not found",
      });
    }

    res.send({ success: true, data: scholarship });
  } catch (err) {
    console.error("Get scholarship by ID error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching scholarship",
    });
  }
};

// Create new scholarship (Admin only)
const createScholarship = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const scholarshipData = req.body;

    if (!scholarshipData.scholarshipPostDate) {
      scholarshipData.scholarshipPostDate = new Date().toISOString();
    }
    scholarshipData.applicationData = new Date();
    scholarshipData.createdAt = new Date();
    scholarshipData.updatedAt = new Date();

    const result = await scholarshipsCollection.insertOne(scholarshipData);

    res.send({
      success: true,
      message: "Scholarship created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Create scholarship error:", err);
    res.status(500).send({
      success: false,
      message: "Error creating scholarship",
    });
  }
};

// Update scholarship (Admin only)
const updateScholarship = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const { id } = req.params;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid scholarship ID",
      });
    }

    updateData.updatedAt = new Date();

    const result = await scholarshipsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Scholarship not found",
      });
    }

    res.send({
      success: true,
      message: "Scholarship updated successfully",
      data: result,
    });
  } catch (err) {
    console.error("Update scholarship error:", err);
    res.status(500).send({
      success: false,
      message: "Error updating scholarship",
    });
  }
};

// Delete scholarship (Admin only)
const deleteScholarship = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid scholarship ID",
      });
    }

    const result = await scholarshipsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Scholarship not found",
      });
    }

    res.send({
      success: true,
      message: "Scholarship deleted successfully",
      data: result,
    });
  } catch (err) {
    console.error("Delete scholarship error:", err);
    res.status(500).send({
      success: false,
      message: "Error deleting scholarship",
    });
  }
};

// Get top scholarships
const getTopScholarships = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    
    const topScholarships = await scholarshipsCollection
      .find({})
      .sort({ applicationFees: 1, scholarshipPostDate: -1 })
      .limit(6)
      .toArray();

    res.send({
      success: true,
      data: topScholarships,
    });
  } catch (err) {
    console.error("Get top scholarships error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching top scholarships",
    });
  }
};

// Get filter options
const getFilterOptions = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    
    const result = await scholarshipsCollection
      .aggregate([
        {
          $facet: {
            categories: [
              { $match: { scholarshipCategory: { $exists: true, $ne: "" } } },
              { $group: { _id: "$scholarshipCategory" } },
              { $sort: { _id: 1 } },
            ],
            subjects: [
              { $match: { subjectCategory: { $exists: true, $ne: "" } } },
              { $group: { _id: "$subjectCategory" } },
              { $sort: { _id: 1 } },
            ],
            countries: [
              { $match: { universityCountry: { $exists: true, $ne: "" } } },
              { $group: { _id: "$universityCountry" } },
              { $sort: { _id: 1 } },
            ],
            degrees: [
              { $match: { degree: { $exists: true, $ne: "" } } },
              { $group: { _id: "$degree" } },
              { $sort: { _id: 1 } },
            ],
          },
        },
      ])
      .toArray();

    const filters = {
      categories: result[0]?.categories.map((c) => c._id) || [],
      subjects: result[0]?.subjects.map((s) => s._id) || [],
      countries: result[0]?.countries.map((c) => c._id) || [],
      degrees: result[0]?.degrees.map((d) => d._id) || [],
    };

    res.send({
      success: true,
      data: filters,
    });
  } catch (err) {
    console.error("Get filter options error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching filter options",
    });
  }
};

// Get recommendations by category
const getRecommendationsByCategory = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const { category } = req.params;
    const { exclude } = req.query;

    if (!category || category === "undefined") {
      return res.status(400).send({
        success: false,
        message: "Category is required",
      });
    }

    let query = { scholarshipCategory: category };

    if (exclude && ObjectId.isValid(exclude)) {
      query._id = { $ne: new ObjectId(exclude) };
    }

    const recommendations = await scholarshipsCollection
      .find(query)
      .sort({ applicationFees: 1, scholarshipPostDate: -1 })
      .limit(6)
      .toArray();

    res.send({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Get recommendations error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get recommendations by scholarship ID
const getRecommendationsById = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid scholarship ID",
      });
    }

    const currentScholarship = await scholarshipsCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!currentScholarship) {
      return res.status(404).send({
        success: false,
        message: "Scholarship not found",
      });
    }

    const { scholarshipCategory } = currentScholarship;

    if (!scholarshipCategory) {
      const randomRecommendations = await scholarshipsCollection
        .aggregate([
          { $match: { _id: { $ne: new ObjectId(id) } } },
          { $sample: { size: 3 } },
        ])
        .toArray();

      return res.send({
        success: true,
        data: randomRecommendations,
      });
    }

    const recommendations = await scholarshipsCollection
      .find({
        _id: { $ne: new ObjectId(id) },
        scholarshipCategory: scholarshipCategory,
      })
      .sort({ applicationFees: 1, scholarshipPostDate: -1 })
      .limit(3)
      .toArray();

    if (recommendations.length < 3) {
      const additionalRecommendations = await scholarshipsCollection
        .find({
          _id: {
            $ne: new ObjectId(id),
            $nin: recommendations.map((r) => r._id),
          },
        })
        .sort({ applicationFees: 1 })
        .limit(3 - recommendations.length)
        .toArray();

      recommendations.push(...additionalRecommendations);
    }

    res.send({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Get recommendations by ID error:", error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

// Get all scholarships for admin
const getAllScholarshipsAdmin = async (req, res) => {
  try {
    const scholarshipsCollection = getCollection("scholarships");
    const scholarships = await scholarshipsCollection.find().toArray();

    res.send({
      success: true,
      data: scholarships,
    });
  } catch (err) {
    console.error("Get all scholarships admin error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching scholarships",
    });
  }
};

module.exports = {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getTopScholarships,
  getFilterOptions,
  getRecommendationsByCategory,
  getRecommendationsById,
  getAllScholarshipsAdmin,
};