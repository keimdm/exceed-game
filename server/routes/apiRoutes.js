import { Router } from "express";

const router = Router();

// /api/tests/
router.get('/test', (req, res) => {
    res.json({ message: "hello from server" });
});

export default router;