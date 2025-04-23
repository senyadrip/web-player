import React, { useState, useEffect, useRef } from "react";
import Track from "./Track";
import useIsMobile from "./useIsMobile";

interface Track {
  _id: string;
  title: string;
  artist: string;
  filePath: string;
  songId: string;
  downloadable: boolean;
  downloadCount: number;
  likes: any[];
  createdAt: string;
  updatedAt: string;
}

interface TrackRowProps {
  track: Track;
  style: string;
  onTrackClicked: (trackIndex: number) => void;
  index: number;
  isPlaying: boolean;
  isPaused: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: () => void;
}

const TrackRow: React.FC<TrackRowProps> = ({
  track,
  style,
  onTrackClicked,
  index,
  isPlaying,
  isPaused,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const [isHover, setIsHover] = useState(false);

  const isMobile = useIsMobile();

  const indexToTrackTable = () => {
    onTrackClicked(index);
  };

  const handleClick = () => {
    indexToTrackTable();
  };

  return (
    <div>
      {isMobile ? (
        <div className="flex px-8" draggable>
          <Track title={track.title} artist={track.artist}></Track>
        </div>
      ) : (
        <div
          className={`${
            isPlaying
              ? "flex relative justify-center w-full bg-zinc-800 transition-colors duration-50"
              : "flex relative justify-center w-full hover:bg-zinc-800 transition-colors duration-50"
          }`}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          draggable
          onDragStart={() => onDragStart(index)}
          onDragOver={(e) => onDragOver(e, index)}
          onDrop={onDrop}
        >
          <svg
            onClick={handleClick}
            className={`${
              isHover || isPlaying
                ? "opacity-100 w-6 mt-[28px] fill-zinc-100 absolute left-[15%] transition-opacity duration-50"
                : "flex opacity-0 w-6 fill-zinc-100 absolute left-[15%]"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              d={`${
                isPlaying
                  ? "M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"
                  : "M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
              }`}
            />
          </svg>
          <div className="flex w-1/5">
            <Track title={track.title} artist={track.artist}></Track>
          </div>
          <div className="flex w-1/5 justify-center">
            <h1 className="text-white text-md py-[32px]">{track.createdAt}</h1>
          </div>
          <div className="flex w-1/5 justify-end">
            <h1 className="text-white text-md py-[32px]">{track.createdAt}</h1>
          </div>
          <svg
            className={`${
              isHover
                ? "flex opacity-100 w-[6px] fill-zinc-100 absolute left-[85%] mt-[32px] transition-opacity duration-50"
                : "flex opacity-0 w-6 fill-zinc-100 absolute left-[15%]"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 512"
          >
            <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default TrackRow;