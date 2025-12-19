import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
// import propertyRoutes from "./routes/property.routes.js";
// import tenantRoutes from "./routes/tenant.routes.js";
// import paymentRoutes from "./routes/payment.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/properties", propertyRoutes);
// app.use("/api/tenant", tenantRoutes);
// app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
