const { ObjectId } = require("mongodb");
const { getCollection } = require("../config/database");

// Save or update user
const saveUser = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const userData = req.body;

    userData.createdAt = new Date().toISOString();
    userData.last_loggedIn = new Date().toISOString();
    userData.role = "student";

    const query = { email: userData.email };
    const existingUser = await usersCollection.findOne(query);

    if (existingUser) {
      const result = await usersCollection.updateOne(query, {
        $set: { last_loggedIn: new Date().toISOString() },
      });
      return res.send(result);
    }

    const result = await usersCollection.insertOne(userData);
    res.send(result);
  } catch (err) {
    console.error("User save/update error:", err);
    res.status(500).send({ error: "Error saving user" });
  }
};

// Get user role by token
const getUserRole = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const user = await usersCollection.findOne({ email: req.tokenEmail });

    res.send({ role: user?.role || "student" });
  } catch (err) {
    console.error("Get user role error:", err);
    res.status(500).send({ role: "student" });
  }
};

// Get user role by email
const getUserRoleByEmail = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const { email } = req.params;

    const user = await usersCollection.findOne({ email });

    res.send({ role: user?.role || "student" });
  } catch (err) {
    console.error("Get user role by email error:", err);
    res.status(500).send({ role: "student" });
  }
};

// Get all users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const adminEmail = req.tokenEmail;

    const users = await usersCollection
      .find({ email: { $ne: adminEmail } })
      .toArray();

    res.send({
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
    });
  }
};

// Update user role (Admin)
const updateUserRole = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const { id } = req.params;
    const { role } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).send({
      success: false,
      message: "Error updating user role",
    });
  }
};

// Delete user (Admin)
const deleteUser = async (req, res) => {
  try {
    const usersCollection = getCollection("users");
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID",
      });
    }

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).send({
      success: false,
      message: "Error deleting user",
    });
  }
};

module.exports = {
  saveUser,
  getUserRole,
  getUserRoleByEmail,
  getAllUsers,
  updateUserRole,
  deleteUser,
};