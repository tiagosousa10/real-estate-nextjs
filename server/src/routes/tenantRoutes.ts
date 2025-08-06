import express from "express";
import {
  createTenant,
  getCurrentResidences,
  getTenant,
  updateTenant,
} from "../controllers/tenantController";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.put("/:cognitoId", updateTenant);
router.put("/:cognitoId/current-residences", getCurrentResidences);
router.post("/", createTenant);

export default router;
