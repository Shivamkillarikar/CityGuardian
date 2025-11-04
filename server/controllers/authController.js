import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) => {
  const payload = { id: user._id, email: user.email, isAdmin: user.isAdmin };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign(payload, secret, { expiresIn });
};

export const register = async (req, res, next) => {
  try {
    const { name, surname, email, password, address } = req.body;
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      surname,
      email: email.toLowerCase(),
      password: hashed,
      address: address || ""
      // isAdmin defaults to false
    });

    const token = signToken(user);

    res.status(201).json({ message: "User created", user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please provide email and password" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ message: "Login successful", user: user.toJSON(), token });
  } catch (err) {
    next(err);
  }
};

// Example of a protected route
export const getProfile = async (req, res, next) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
