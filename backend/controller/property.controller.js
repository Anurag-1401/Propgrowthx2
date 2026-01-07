import { supabase } from "../config/supabase.js";

export const getPropertyById = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Property ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("id", id)
      .single(); // fetch single property

    if (error || !data) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.status(200).json({ property: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPropertiesByOwner = async (req, res) => {
  const { owner_id } = req.query; // or req.query.owner_id

  if (!owner_id) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("owner_id", owner_id);

    if (error) {
      console.log("Error fetching properties:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      owner_id,
      properties: data,
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
export const getAllPropertiesByBuyer = async (req, res) => {
  const { buyer_id } = req.query;

  if (!buyer_id) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("buyer_id", buyer_id);

    if (error) {
      console.log("Error fetching properties:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      buyer_id,
      properties: data,
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
export const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase.from("properties").select("*");

    if (error) {
      console.log("Error fetching properties:", error.message);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      properties: data,
    });
  } catch (err) {
    console.log("Unexpected error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// export const createProperty = async (req, res) => {
//   const {
//     owner_id,
//     property_name,
//     address,
//     prize,
//     property_type,
//     total_area,
//     water_available,
//     electricity_available,
//     availability_status,
//     monthly_rent,
//   } = req.body;

//   // Required validation
//   if (!owner_id || !property_name) {
//     return res.status(400).json({
//       error: "Owner ID and Property Name are required",
//     });
//   }

//   try {
//     const { data, error } = await supabase
//       .from("properties")
//       .insert([
//         {
//           owner_id,
//           property_name,
//           address,
//           prize,
//           property_type,
//           total_area,
//           water_available,
//           electricity_available,
//           availability_status: availability_status || "available",
//           monthly_rent,
//         },
//       ])
//       .select()
//       .single();

//     if (error) {
//       return res.status(400).json({ error: error.message });
//     }

//     res.status(201).json({
//       message: "Property created successfully",
//       property: data,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


export const createProperty = async (req, res) => {
  const {
    owner_id,
    property_name,
    address,
    city,
    state,
    zip_code,
    listing_type,
    property_type,
    price,
    bedrooms,
    bathrooms,
    total_area,
    description,
    amenities,
    status,
    images,
    water_available,
    electricity_available,
    availability_status,
  } = req.body;

  if (!owner_id || !property_name) {
    return res.status(400).json({
      error: "Owner ID and Property Name are required",
    });
  }

  const { data, error } = await supabase
    .from("properties")
    .insert([
      {
        owner_id,
        property_name,
        address,
        city,
        state,
        zip_code,
        listing_type,
        property_type,
        price,
        bedrooms,
        bathrooms,
        total_area,
        description,
        amenities,
        status,
        images,
        water_available,
        electricity_available,
        availability_status,
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json({
    message: "Property created successfully",
    property: data,
  });
};


export const updateProperty = async (req, res) => {
  const { id } = req.params;

  const {
    property_name,
    address,
    prize,
    property_type,
    total_area,
    water_available,
    electricity_available,
    availability_status,
    monthly_rent,
  } = req.body;
  console.log(req.body);

  if (!id) {
    return res.status(400).json({ error: "Property ID is required" });
  }

  try {
    const updateData = {};

    if (property_name !== undefined) updateData.property_name = property_name;

    if (address !== undefined) updateData.address = address;

    if (prize !== undefined) updateData.prize = prize;

    if (property_type !== undefined) updateData.property_type = property_type;

    if (total_area !== undefined) updateData.total_area = total_area;

    if (water_available !== undefined)
      updateData.water_available = water_available;

    if (electricity_available !== undefined)
      updateData.electricity_available = electricity_available;

    if (availability_status !== undefined)
      updateData.availability_status = availability_status;

    if (monthly_rent !== undefined) updateData.monthly_rent = monthly_rent;

    const { data, error } = await supabase
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Property updated successfully",
      property: data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const buyProperty = async (req, res) => {
  const { userId, propId } = req.body;
  const { data, error } = await supabase
    .from("properties")
    .update({ buyer_id: userId })
    .eq("id", propId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ message: "Property purchased successfully" });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
};
