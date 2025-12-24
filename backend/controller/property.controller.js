import { supabase } from "../config/supabase.js";

export const getProperties = async (req, res) => {
  const { data, error } = await supabase.from("properties").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
};

export const createProperty = async (req, res) => {
  const { name, address } = req.body;

  const { data, error } = await supabase
    .from("properties")
    .insert([{ name, address }])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  const { data, error } = await supabase
    .from("properties")
    .update({ name, address })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({
    message: "Property updated successfully",
    data,
  });
};
