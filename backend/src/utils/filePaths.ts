import path from "path";
import fs from "fs";

// Define path to upload directory
const UPLOAD_DIR = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "frontend",
  "public",
  "uploads"
);

export { UPLOAD_DIR };