import { supabase } from "../config/supabase.js";

// Register new user
export const register = async (req, res) => {
  const { email, password, role } = req.body;
  console.log("Register request received:", { email, role });
  try {
    // 1️⃣ Create auth user
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.log("Error creating auth user:", authError.message);
      return res.status(400).json({ error: authError.message });
    }

    console.log("Auth user created:", authData.user.id);

    // 2️⃣ Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id, // link profile with auth user
      email,
      role: role || "owner",
      created_at: new Date(),
    });

    if (profileError) {
      console.log("Error inserting profile:", profileError.message);
      return res.status(400).json({ error: profileError.message });
    }

    console.log("Profile created for user:", email);

    // 3️⃣ Success response
    res.status(201).json({
      message: "User registered successfully",
      email,
      role: role || "owner",
    });
  } catch (err) {
    console.log("Unexpected error in register:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request received:", { email });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log("Login error:", error.message);
      return res.status(400).json({ error: error.message });
    }

    console.log("Login successful for user:", data.user.id);

    res.json({
      message: "Login successful",
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.log("Unexpected error in login:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Forgot password
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
