import { supabase } from "@/lib/supabase";
import emailjs from "emailjs-com";
import { toast } from "sonner";

export const requestForInvitation = async (
   property_Id: string,
  tenantEmail: string,
  owner_id: string) => {
    const url = import.meta.env.VITE_PUBLIC_APP_URL;
    const token = crypto.randomUUID();
  try {

    const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  ).toISOString();

  const { error } = await supabase
    .from('property_invites')
    .insert({
      property_id: property_Id,
      token,
      owner_id: owner_id,
      expires_at: expiresAt
    });

  if (error) throw error;

    const { data: owner } = await supabase
      .from("profiles")
      .select("name, email")
      .eq("id", owner_id)
      .single();

    const { data: property } = await supabase
      .from("properties")
      .select("*")
      .eq("id", property_Id)
      .single();

    /* 2️⃣ Send Email via EmailJS */
    await emailjs.send(
  "service_pia6efr",
  "template_j37gqvh",
  {
    to_email: tenantEmail,

    owner_name: owner.name,
    owner_email: owner.email,

    property_name: property.property_name,
    address: property.address,
    city: property.city,
    state: property.state,

    accept_link: `http://localhost:8080/setPassword?token=${token}&propId=${property_Id}`
    // return `${url}/setPassword?token=${token}&propId=${property_Id}`;

  },
  "msM6UBCrh8skmh2dd"
);


    toast.success("Email invitation sent!");
    console.log("Email sent successfuly!")
  } catch (err) {
    console.error(err);
    toast.error("Failed to send email invitation");
  }
};

// export const acceptInvitation = async (req, res) => {
//   try {
//     const { tenantId, owner_id, property_Id } = req.params;

//     const { data: tenant } = await supabase
//       .from("profiles")
//       .select("name, email, emer_contact")
//       .eq("id", tenantId)
//       .single();

//     const { data: owner } = await supabase
//       .from("profiles")
//       .select("name, email")
//       .eq("id", owner_id)
//       .single();

//     const { data: property } = await supabase
//       .from("properties")
//       .select("*")
//       .eq("id", property_Id)
//       .single();

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.COMPANY_EMAIL,
//         pass: process.env.COMPANY_EMAIL_PASS,
//       },
//     });

//     const localLink = `http://localhost:5173/show_prop/${property_Id}`;

//     await transporter.sendMail({
//       from: `"PROPGROWTHX" <${process.env.COMPANY_EMAIL}>`,
//       to: tenant.email,
//       subject: `Owner Accepted Your Request for ${property.property_name}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <style>
//             body { font-family: Arial; background:#f4f6f8; padding:20px; }
//             .card { max-width:600px; background:#fff; padding:20px; border-radius:8px; margin:auto; box-shadow:0 4px 10px rgba(0,0,0,0.1); }
//             h2 { color:#2c3e50; }
//             .btn { display:inline-block; margin-top:20px; padding:12px 18px; background:#2ecc71; color:white; text-decoration:none; border-radius:6px; font-weight:bold; }
//           </style>
//         </head>
//         <body>
//           <div class="card">
//             <h2>🎉 Your Request Has Been Accepted!</h2>

//             <p><b>Property:</b> ${property.property_name}</p>
//             <p><b>Owner:</b> ${owner.name} (${owner.email})</p>

//             <a href="${localLink}" class="btn">
//               ✅ View Property
//             </a>

//             <p style="margin-top:20px;">© PROPGROWTHX – Property Management System</p>
//           </div>
//         </body>
//         </html>
//       `,
//     });

//     res.send(`
//       <center style="margin-top:50px; font-family:Arial;">
//         <h1 style="color:green;">✔ Request Accepted Successfully</h1>
//         <p>Tenant has been notified by email.</p>
//         <p>You can close this window now.</p>
//       </center>
//     `);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// };
