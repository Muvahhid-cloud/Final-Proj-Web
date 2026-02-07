const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const asyncH = require("../middleware/async.middleware");

exports.registerAdmin = asyncH(async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (!username || !email || !password || !phone) {
    res.status(400);
    throw new Error("All fields are required");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  if (username.length < 2 || username.length > 32) {
    res.status(400);
    throw new Error("Username must be 2-32 characters");
  }
  if (!/^\+7\d{10}$/.test(phone)) {
    res.status(400);
    throw new Error("Phone number must start with +7 and be 12 digits total");
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const unameExists = await User.findOne({ username: String(username).trim() });
  if (unameExists) {
    res.status(409);
    throw new Error("Username already registered");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    username: String(username).trim(),
    email: String(email).toLowerCase().trim(),
    password: hashed,
    role: "admin",
    phone
  });

  res.status(201).json({ message: "Admin registered" });
});

const signToken = (user) =>
  jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

exports.register = asyncH(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("username, email, password are required");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Invalid email format");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }
  if (username.length < 2 || username.length > 32) {
    res.status(400);
    throw new Error("Username must be 2-32 characters");
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const unameExists = await User.findOne({ username: String(username).trim() });
  if (unameExists) {
    res.status(409);
    throw new Error("Username already registered");
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    username: String(username).trim(),
    email: String(email).toLowerCase().trim(),
    password: hashed
  });

  res.status(201).json({ token: signToken(user) });
});

exports.login = asyncH(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("email and password are required");
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    res.status(401);
    throw new Error("Wrong password");
  }

  res.json({ token: signToken(user) });
});

exports.me = asyncH(async (req, res) => {
  const user = await User.findById(req.user.userId).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role
  });
});
