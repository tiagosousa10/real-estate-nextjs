"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const applicationController_1 = require("../controllers/applicationController");
const router = express_1.default.Router();
router.post("/", (0, authMiddleware_1.authMiddleware)(["tenant"]), applicationController_1.createApplication);
router.put("/:id/status", (0, authMiddleware_1.authMiddleware)(["manager"]), applicationController_1.updateApplicationStatus);
router.get("/", (0, authMiddleware_1.authMiddleware)(["manager", "tenant"]), applicationController_1.listApplications);
exports.default = router;
