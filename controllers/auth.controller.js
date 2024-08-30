const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // limit 1MB
}).single('resume');

exports.signup = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) return res.status(400).send('Error: ' + err.message);

      const { username, email, password } = req.body;

      // Check if all fields are provided
      if (!username || !email || !password || !req.file) {
        return res.status(400).json({ status: "400", message: 'All fields are necessary.' });
      }

      // Check if email is unique
      const existingUserByEmail = await User.findOne({ email });
      if (existingUserByEmail) {
        return res.status(400).json({ status: "400", message: 'Email is already in use.' });
      }

      // Check if username is unique
      const existingUserByUsername = await User.findOne({ username });
      if (existingUserByUsername) {
        return res.status(400).json({ status: "400", message: 'Username is already in use.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload resume to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'auto',
      });

      // Create new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        resume_url: cloudinaryResult.secure_url,
      });

      // Save the new user
      await newUser.save();
      console.log(newUser);
      res.status(201).json({ user: newUser, message: 'User registered successfully.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password.' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};