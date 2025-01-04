import { UPLOAD_DIR } from "../utils/filePaths";
import path from "path";
import multer from "multer";

// Generate a song ID consisting of date element and random element
const generateSongId = () => {
  const datePart = new Date().toISOString().replace(/[-:.]/g, "");
  const randomPart = Math.floor(Math.random() * 1e6)
    .toString()
    .padStart(6, "0");
  return `${datePart}-${randomPart}`;
};

// Configures storage for file uploads with Multer
const storage = multer.diskStorage({
  // Specifies the directory where files will be uploaded
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  // Creates a temporary file name
  filename: (req, file, cb) => {
    const tempFilename = `${Date.now()}-${file.originalname}`;
    cb(null, tempFilename);
  },
});

// Configures Multer to handle file uploads
const upload = multer({
  storage: storage,
  // Filter to only accpet MP3 files
  fileFilter: function (req, file, cb) {
    const filetypes = /mp3/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    console.log(`Original name: ${file.originalname}`);
    console.log(`MIME type: ${mimetype}`);
    console.log(`Extension: ${extname}`);

    if (extname === ".mp3" && mimetype === "audio/mpeg") {
      cb(null, true);
    } else {
      cb(new Error("Currently, only MP3 files are working."));
    }
  },
});
