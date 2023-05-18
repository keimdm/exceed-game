import apiRoutes from "./apiRoutes.js";
import { Router } from "express";

const router = Router();

router.use("/api", apiRoutes);

export default router;

