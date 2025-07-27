const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


// Register user
exports.register = async (req, res) => {
  const { name, email, password, phone, role = 'user' } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Trim and sanitize inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.toLowerCase().trim();
    const trimmedPhone = phone.trim();
    const userRole = role.toLowerCase();

    // Validate name
    if (trimmedName.length < 2 || !/^[a-zA-Z\s]+$/.test(trimmedName)) {
      return res.status(400).json({
        message: 'Name must be at least 2 characters and contain only letters and spaces'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    // Validate phone number
    const cleanPhone = trimmedPhone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[\+]?[1-9][\d]{6,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number' });
    }

    // Validate role
    const validRoles = ['user', 'farmer'];
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role. Role must be "user" or "farmer"' });
    }

    // Check if user already exists
    const emailExists = await User.findOne({ email: trimmedEmail });
    if (emailExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const phoneExists = await User.findOne({ phone: cleanPhone });
    if (phoneExists) {
      return res.status(400).json({ message: 'User already exists with this phone number' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Construct user data
    const userData = {
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      phone: cleanPhone,
      role: userRole,
      isActive: true,
      createdAt: new Date()
    };

    // Add farmer-specific default profile
    if (userRole === 'farmer') {
      userData.farmerProfile = {
        farmName: '',
        farmLocation: '',
        cropTypes: [],
        farmSize: '',
        experience: '',
        isVerified: false
      };
    }

    // Save user
    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    // Response data (omit password)
    const responseData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    if (user.role === 'farmer') {
      responseData.farmerProfile = user.farmerProfile;
    }

    // Send success response
    res.status(201).json({
      message: `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} registered successfully`,
      token,
      user: responseData
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const fieldName = field === 'email' ? 'Email' :
                        field === 'phone' ? 'Phone number' :
                        field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(400).json({
        message: `${fieldName} already exists`
      });
    }

    return res.status(500).json({
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};


//    Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.status(200).json({
  message: 'Login successful',
  token: generateToken(user._id),
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  }
});

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//     Protected route example
exports.getProfile = async (req, res) => {
  res.json(req.user);
};
