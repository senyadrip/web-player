import mongoose, { Schema, Document, Types } from "mongoose";

export interface IMusic extends Document {
    title: string;
    artist: string;
    album: string;
    year: number;
    filePath: string;
    songId: string;
    downloadable: boolean;
    downloadCount: number;
    uploadDate: Date;
    uploadedBy: string;
    order: number;
  }

  const MusicSchema: Schema = new Schema(
    {
      title: { type: String, required: true },
      artist: { type: String, required: true },
      album: { type: String, required: false },
      year: { type: Number, required: false },
      filePath: { type: String, required: true },
      songId: { type: String, required: true },
      downloadable: { type: Boolean, required: true },
      downloadCount: { type: Number, required: true, default: 0 },
      uploadedBy: { type: String, required: true },
      order: { type: Number, required: true, default: 0 }
    },
    {
      timestamps: true,
    }
  );
  
  const Music = mongoose.model<IMusic>("Music", MusicSchema);
  export default Music;