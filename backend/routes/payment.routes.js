import {
  getPayments,
  createPayment,
  updatePayment,
} from "../controller/payment.controllers.js";

const router = express.Router();

router.get("/get", getPayments);
router.post("/create", createPayment);
router.put("/update/:id", updatePayment);

export default router;
