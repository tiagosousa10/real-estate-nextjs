"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const managerController_1 = require("../controllers/managerController");
const router = express_1.default.Router();
router.get("/:cognitoId", managerController_1.getManager);
router.post("/", managerController_1.createManager);
exports.default = router;
