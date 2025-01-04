import { UPLOAD_DIR } from "../utils/filePaths";
import path from "path";
import multer from "multer";
import Music from "../models/Music";
import { DiscordUser } from "../types/types";
import { Request, Response } from "express";
import fs from "fs";

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

// Endpoint to create Music record
export const createMusic = async (req: Request, res: Response) => {
  const uploadSingle = upload.single("file");

  uploadSingle(req, res, async (err) => {
    // Error handling for uploading file
    if (err instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    console.log("File field in request:", req.file);
    console.log("Body fields in request:", req.body);

    // Assign body of request to object
    const { title, artist, album, year, downloadable } = req.body;
    const user = req.user as DiscordUser;

    // Delete file if missing required fields
    try {
      if (!title || !artist || !req.file) {
        console.log("Missing required fields");
        if (req.file) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete file:", unlinkErr);
            }
          });
        }
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Generate new name for file and store file path
      const songId = generateSongId();
      const originalName = path.parse(req.file.originalname).name;
      const extension = path.extname(req.file.originalname);
      const newFilename = `${originalName}-${songId}${extension}`;
      const newFilePath = path.join(UPLOAD_DIR, newFilename);

      // Assign order for file
      const highestOrder = await Music.findOne()
        .sort({ order: -1 })
        .select("order");
      const nextOrder = highestOrder ? highestOrder.order + 1 : 1;

      try {
        fs.renameSync(req.file.path, newFilePath);
        // Create Music object
        const newMusic = new Music({
          title,
          artist,
          album,
          year,
          downloadable: downloadable || false,
          songId,
          filePath: path.relative(UPLOAD_DIR, newFilePath),
          order: nextOrder,
          uploadedBy: user.username,
        });
        await newMusic.save();
        res.status(201).json(newMusic);
        // Delete Music file if there is an error
      } catch (error) {
        fs.unlink(newFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Failed to delete file:", unlinkErr);
          }
        });
        res
          .status(500)
          .json({ message: "Failed to save the music record", error });
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to create a music record", error });
    }
  });
};

// Endpoint to get all Music records
export const getAllMusic = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 20; // Default to 20 items per page
    const skip = (page - 1) * limit;

    const allMusic = await Music.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const totalMusic = await Music.countDocuments(); // Get the total count of Music records

    res.status(200).json({
      totalMusic,
      totalPages: Math.ceil(totalMusic / limit),
      currentPage: page,
      music: allMusic,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch music records:", error });
  }
};

// Endpoint to get a single Music record
export const getMusic = async (req: Request, res: Response) => {
  const { songId } = req.params;

  try {
    const music = await Music.findOne({ songId });

    if (!music) {
      res.status(404).json({ message: "Music record not found" });
      return;
    }

    const absoluteFilePath = path.join(UPLOAD_DIR, music.filePath);

    res.status(200).json({
      ...music.toObject(),
      filePath: absoluteFilePath,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch music record:", error });
  }
};

// Endpoint to update Music record
export const updateMusic = async (req: Request, res: Response) => {
  // Get song ID from record which is to be updated
  const { songId } = req.params;
  // Get updated fields for record
  const { title, artist, album, year, downloadable } = req.body;

  const uploadSingle = upload.single("file");

  uploadSingle(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }

    // Find Music record with given ID
    try {
      const music = await Music.findOne({ songId });
      // If record is not found, delete record if file was given, and return
      if (!music) {
        if (req.file) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete file:", unlinkErr);
            }
          });
        }
        return res.status(404).json({ message: "Music record not found" });
      }

      // Update fields of record, or use original values if fields not given
      music.title = title || music.title;
      music.artist = artist || music.artist;
      music.album = album || music.album;
      music.year = year || music.year;
      music.downloadable =
        downloadable !== undefined ? downloadable : music.downloadable;

      // If file is given, create file path
      if (req.file) {
        const originalName = path.parse(req.file.originalname).name;
        const extension = path.extname(req.file.originalname);
        const newFilename = `${originalName}-${songId}${extension}`;
        const newFilePath = path.join(UPLOAD_DIR, newFilename);

        try {
          fs.renameSync(req.file.path, newFilePath);

          // Store old file path in order to delete it
          const oldFilePath = path.join(UPLOAD_DIR, music.filePath);

          // Replace exisitng Music record file path with new one
          music.filePath = path.relative(UPLOAD_DIR, newFilePath);

          fs.unlink(oldFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete old file:", unlinkErr);
            }
          });
        } catch (error) {
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Failed to delete file:", unlinkErr);
            }
          });
          return res
            .status(500)
            .json({ message: "Failed to update file", error });
        }
      }

      await music.save();
      res.json(music);
    } catch (error) {
      res.status(500).json({ message: "Failed to update music record", error });
    }
  });
};

// Endpoint to delete Music record
export const deleteMusic = async (req: Request, res: Response) => {
  // Get song ID from record which is to be deleted
  const { songId } = req.params;

  try {
    const deletedMusic = await Music.findOneAndDelete({ songId });

    // Return if record is not found
    if (!deletedMusic) {
      return res.status(404).json({ message: "Music record not found" });
    }

    const filePath = path.join(UPLOAD_DIR, deletedMusic.filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete file:", err);
      }
    });

    res.json(deletedMusic);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete music record:", error });
  }
};

// Endpoint to update order of Music record
export const updateOrder = async (req: Request, res: Response) => {
  // Get song ID of the record that needs updated order
  const { songId } = req.params;
  // Get new order value
  const { order } = req.body;

  try {
    // Find record and return if not found
    const music = await Music.findOne({ songId });

    if (!music) {
      return res.status(404).json({ message: "Music record not found" });
    }

    music.order = order;
    await music.save();
    res.json({ message: "Order updated successfully", music });
  } catch (error) {
    console.error("Error updating music order:", error);
    res.status(500).json({ message: "Failed to update music order", error });
  }
};
