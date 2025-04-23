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
const router = Router();



router.get("/", getAllMusic);
router.post("/", createMusic);
router.get("/metadata/:filePath", readMetadata);
router.put("/metadata/:filePath", updateMetadata);
router.put("/:songId", updateMusic);
router.delete("/:songId", deleteMusic);
router.get("/:songId", getMusic);
router.put("/order/:songId", updateOrder);

export default router;


