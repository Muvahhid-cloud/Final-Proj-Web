const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const asyncH = require("../middleware/async.middleware");
const validator = require("validator");
const Order = require("../models/order.model");

// Delete user (admin only)
exports.deleteUser = asyncH(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
});

// Get user orders (admin only)
exports.getUserOrders = asyncH(async (req, res) => {
  console.log("[DEBUG] getUserOrders - userId:", req.params.id);
  const orders = await Order.find({ userId: req.params.id });
  console.log("[DEBUG] getUserOrders - orders found:", orders.length, orders);
  res.json(orders);
});

// List all users (admin only)
exports.getAllUsers = asyncH(async (req, res) => {
  const users = await User.find().select("-password");
  console.log("[DEBUG] getAllUsers - Total users in DB:", users.length);
  console.log("[DEBUG] getAllUsers - Current admin ID:", req.user.userId);
  console.log("[DEBUG] getAllUsers - All users:", users);
  // Return all users except the current admin to show others
  const filteredUsers = users.filter(u => u._id.toString() !== req.user.userId);
  console.log("[DEBUG] getAllUsers - Filtered users (excluding current admin):", filteredUsers);
  res.json(filteredUsers);
});

exports.getProfile = asyncH(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});

exports.updateProfile = asyncH(async (req, res) => {
  const { username, email } = req.body;

  const updates = {};
  if (username) {
    const uname = String(username).trim();
    if (uname.length < 2 || uname.length > 32) {
      return res.status(400).json({ message: "Username must be 2-32 characters" });
    }
    const exists = await User.findOne({ username: uname });
    if (exists && exists._id.toString() !== req.user.userId) {
      return res.status(409).json({ message: "Username already in use" });
    }
    updates.username = uname;
  }
  if (email) {
    const cleaned = String(email).toLowerCase().trim();
    if (!validator.isEmail(cleaned)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    const exists = await User.findOne({ email: cleaned });
    if (exists && exists._id.toString() !== req.user.userId) {
      return res.status(409).json({ message: "Email already in use" });
    }
    updates.email = cleaned;
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    updates,
    { new: true }
  ).select("-password");

  res.json(user);
});

exports.updatePassword = asyncH(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.userId);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return res.status(400).json({ message: "Wrong old password" });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Password updated" });
});