const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { jwtAuthMiddleware, generateToken } = require("../jwt");
  router.post("/signup", async (req, res) => {
    try {
      const {
        name,
        age,
        email,
        mobile,
        address,
        role,
        aadharCardNumber,
        password,
      } = req.body;
    
      if (
        !name ||
        !age ||
        !email ||
        !mobile ||
        !address ||
        !aadharCardNumber ||
        !password
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }
      // Check if user already exists
      const existingUser = await User.findOne({ aadharCardNumber });
      console.log(existingUser);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({
        name,
        age,
        email,
        mobile,
        address,
        aadharCardNumber,
        role,
        password,
      });
      console.log(newUser);
      const response = await newUser.save();
      const payload = {
        id: response._id,
      };
      const token = generateToken(payload);
      return res
        .status(201)
        .json({ message: "User Registered Successfully", token });
    } catch (error) {
      console.error("Signup error:", error);
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

//LOgin
router.post("/login", async (req, res) => {
  //exrracting adhar card number and password from the request body
  const { aadharCardNumber, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ aadharCardNumber });
  try {
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    //token gerneation
    const payload = {
      id: user.id,
      role:user.role,
    };
    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    res.status(200).json({ token: token });
    console.log(`token generated:[${token}]`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData.id);
    const userId = userData.id;
    console.log(userId);
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "internal server errror" });
  }
});

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const UserId = req.user;
    console.log("UserId", UserId); //retrive the parameter from token
    const { currentPassword, newPassword } = req.body;
    console.log(
      `currentPassword:${currentPassword},newPassword:${newPassword}`
    );
    // is user actually present in the database
    const user = await User.findById(UserId.id);
    console.log("user", user);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    //alllow the user to update the password
    user.password = newPassword;
    await user.save();
    console.log("Password updated");
    res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/me", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
