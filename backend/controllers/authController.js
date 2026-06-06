const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const sendEmail = require('../utils/sendEmail');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role: role || 'editor', is_active: true }])
      .select('id, name, email, role')
      .single();

    if (error) throw error;

    const token = generateToken(user.id);
    res.status(201).json({ success: true, token, user: { ...user, _id: user.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    const token = generateToken(user.id);
    delete user.password;
    res.status(200).json({ success: true, token, user: { ...user, _id: user.id } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// @desc    Forgot Password - Request OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    // Check if user exists
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: 'User not found with this email' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiry to 10 minutes from now
    const expiryTime = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Save OTP to DB
    const { error: updateError } = await supabase
      .from('users')
      .update({ reset_otp: otp, reset_otp_expiry: expiryTime })
      .eq('email', email);

    if (updateError) {
      return res.status(500).json({ success: false, message: 'Error saving reset token' });
    }

    // Send email
    const message = `Your password reset OTP is ${otp}. It is valid for 10 minutes.`;
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #3b82f6; text-align: center;">Password Recovery OTP</h2>
        <p>Hello,</p>
        <p>You requested a password reset for your account on the Media & Public Communication Portal.</p>
        <p>Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #111827; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset OTP - Media & Public Communication Portal',
        message,
        htmlMessage
      });

      res.status(200).json({ success: true, message: 'OTP sent successfully to your email.' });
    } catch (mailError) {
      console.error('Mail send error:', mailError);
      // Clear OTP in DB if email sending fails
      await supabase
        .from('users')
        .update({ reset_otp: null, reset_otp_expiry: null })
        .eq('email', email);

      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP and new password' });
    }

    // Find user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if OTP matches and has not expired
    if (!user.reset_otp || user.reset_otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const expiryDate = new Date(user.reset_otp_expiry);
    if (expiryDate < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear OTP fields
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        reset_otp: null,
        reset_otp_expiry: null
      })
      .eq('email', email);

    if (updateError) {
      return res.status(500).json({ success: false, message: 'Failed to reset password. Please try again.' });
    }

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

