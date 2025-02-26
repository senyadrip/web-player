import NodeID3 from "node-id3";
import { Request, Response } from "express";
import path from "path";
import { UPLOAD_DIR } from "../utils/filePaths";

export const readMetadata = (req: Request, res: Response) => {
    const filePath = path.join(UPLOAD_DIR, req.params.filePath);
  
    try {
      const options = {
        // include: ["TSIZ", "TIT2", "TPE1"]    // only read the specified tags (default: all)
      }
      const tags = NodeID3.read(filePath, options);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to read metadata:", error });
    }
  };

  export const updateMetadata = (req: Request, res: Response) => {
    const filePath = path.join(UPLOAD_DIR, req.params.filePath);
    const tags = req.body;
  
    try {
      const success = NodeID3.update(tags, filePath);
      if (success) {
        res.json({ message: tags });
      } else {
        res.status(400).json({ message: "Failed to update metadata" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update metadata:", error });
    }
  };