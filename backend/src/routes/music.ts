import { Router } from "express";
import {
  createMusic,
  getAllMusic,
  getMusic,
  updateMusic,
  deleteMusic,
  updateOrder,
} from "../controllers/musicController";
import {
  readMetadata,
  updateMetadata,
} from "../controllers/metadataController";
import { isAdmin } from "../config/passport";
import Music from "../models/Music";
import path from "path";
import { UPLOAD_DIR } from "../utils/filePaths";
import { Request, Response, NextFunction } from "express";

const router = Router();



router.get("/", getAllMusic);
router.post("/", createMusic);
router.get("/metadata/:filePath", readMetadata);
router.put("/metadata/:filePath", updateMetadata);
router.put("/:songId", isAdmin, updateMusic);
router.delete("/:songId", isAdmin, deleteMusic);
router.get("/:songId", getMusic);
router.put("/order/:songId", updateOrder);

export default router;


