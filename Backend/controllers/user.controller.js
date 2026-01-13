import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";

import crypto from "crypto";

//*Api to register user
export const register = async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });
    await newUser.save();

    const profile = new Profile({ user: newUser._id });
    // await profile.save();
    return res.json({ message: "User Created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//*Api to   log  in user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ message: "User does not exist" });

    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token: token });
    res.json({
        token: token,
    })


  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
