import { supabase } from "../config/supabase.js";

export const getPayments = async (req, res) => {
  const { data, error } = await supabase.from("payments").select("*");

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
};

export const createPayment = async (req, res) => {
  const {
    property_id,
    amount,
    payment_date,
    status,
    payment_mode,
    reference_no,
  } = req.body;

  // here i will reduce the current payment and  mark right to successfully payment     ******* ###

  const { data, error } = await supabase
    .from("payments")
    .insert([
      {
        property_id,
        amount,
        payment_date,
        status,
        payment_mode,
        reference_no,
      },
    ])
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
};

export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, payment_date, status, payment_mode, reference_no } = req.body;

  //  here i will make sure that the  client will not pay overdue if less payment i can add some fine on that (it is optional)

  const { data, error } = await supabase
    .from("payments")
    .update({
      amount,
      payment_date,
      status,
      payment_mode,
      reference_no,
    })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({
    message: "Payment updated successfully",
    data,
  });
};
