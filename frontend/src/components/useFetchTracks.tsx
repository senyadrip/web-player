import React, { useEffect, useState } from "react";

interface Track {
  _id: string;
  title: string;
  artist: string;
  filePath: string;
  songId: string;
  downloadable: boolean;
  downloadCount: number;
  likes: any[]; // or a more specific type if known
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  totalMusic: number;
  totalPages: number;
  currentPage: number;
  music: Track[];
}

export const useFetchTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("http://localhost:5100/api/music");
        if (!response.ok) {
          throw new Error("Response was NOT ok.");
        }
        const data: ApiResponse = await response.json();
        console.log("Fetched data:", data);
        if (data && Array.isArray(data.music)) {
          setTracks(data.music);
        } else {
          throw new Error(
            "Expected an array of tracks but received something else."
          );
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);
  return { tracks, setTracks, loading, error };
};

export default useFetchTracks;