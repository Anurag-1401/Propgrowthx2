import { supabase } from "../config/supabase.js";

import bcrypt from "bcryptjs";
import { generateToken } from "../middlewares/jwt.middleware.js";

export const register = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Email, password, and role are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("profiles")
      .insert({
        email,
        role,
        password: hashedPassword,
      })
      .select()
      .single();

    if (error) {
      console.log("Error inserting user:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Register successful",
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) return res.status(400).json({ error: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      role:user.role,
      id:user.id
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// forgot password (partially completed )
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("Forgot password request received for:", email);

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.log("Error sending reset email:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("Reset email sent to:", email);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.log("Unexpected error in forgotPassword:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfileWithProperties = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get user profile
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("id,role")
      .eq("id", userId)
      .single();

    if (userError || !user)
      return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
