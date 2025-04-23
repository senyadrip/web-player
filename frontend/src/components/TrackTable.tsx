import React, { createRef, useEffect, useRef, useState } from "react";
import TrackCategoryRow from "./TrackCategoryRow";
import TrackRow from "./TrackRow";
import useFetchTracks from "./useFetchTracks";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/src/styles.scss";
import useIsMobile from "./useIsMobile";

const UPLOAD_DIR = "/uploads/";

const TrackTable = () => {
  type TrackState = {
    index: number;
    isPlaying: boolean;
  };

  const [currentTrack, setTrackIndex] = useState<TrackState>({
    index: 0,
    isPlaying: false,
  });

  const isMobile = useIsMobile();

  const { tracks, setTracks, loading, error } = useFetchTracks();

  const [draggedTrackIndex, setDraggedTrackIndex] = useState<number | null>(
    null
  );

  const audioPlayerRef = useRef<AudioPlayer | null>(null);

  const trackFilepaths = tracks.map((track) => ({
    src: UPLOAD_DIR + track.filePath,
  }));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handleClickNext = () => {
    setTrackIndex((prevTrack) => ({
      ...prevTrack,
      index:
        prevTrack.index < trackFilepaths.length - 1 ? prevTrack.index + 1 : 0,
      isPlaying: true,
    }));
  };

  const handleEnd = () => {
    setTrackIndex((prevTrack) => ({
      ...prevTrack,
      index:
        prevTrack.index < trackFilepaths.length - 1 ? prevTrack.index + 1 : 0,
      isPlaying: true,
    }));
  };

  const handleClickPrevious = () => {
    setTrackIndex((prevTrack) => ({
      ...prevTrack,
      index: prevTrack.index > 0 ? prevTrack.index - 1 : 0,
      isPlaying: true,
    }));
  };

  const handleTrackClicked = (trackClicked: number) => {
    if (trackClicked === currentTrack.index && currentTrack.isPlaying) {
      audioPlayerRef.current?.audio.current?.pause();
      setTrackIndex((prevTrack) => ({
        ...prevTrack,
        isPlaying: false,
      }));
    } else if (trackClicked === currentTrack.index && !currentTrack.isPlaying) {
      audioPlayerRef.current?.audio.current?.play();
      setTrackIndex((prevTrack) => ({
        ...prevTrack,
        isPlaying: true,
      }));
    } else {
      setTrackIndex({
        index: trackClicked,
        isPlaying: true,
      });
    }
  };

  const handlePause = () => {
    setTrackIndex((prevTrack) => ({
      ...prevTrack,
      isPlaying: false,
    }));
  };

  const handlePlay = () => {
    setTrackIndex((prevTrack) => ({
      ...prevTrack,
      isPlaying: true,
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedTrackIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedTrackIndex === null || draggedTrackIndex === dropIndex) return;
    const updatedTracks = [...tracks];
    const [removedTrack] = updatedTracks.splice(draggedTrackIndex, 1);
    updatedTracks.splice(dropIndex, 0, removedTrack);
    setTracks(updatedTracks);
    setDraggedTrackIndex(null);
  };

  return (
    <>
      {tracks.length > 0 ? (
        <>
          <TrackCategoryRow></TrackCategoryRow>
          <div className="flex-row">
            {tracks.map((track, index) => (
              <TrackRow
                key={track.songId}
                track={track}
                style={index % 2 === 0 ? "bg-zinc-800" : ""}
                onTrackClicked={handleTrackClicked}
                index={index}
                isPlaying={
                  true
                    ? currentTrack.index === index && currentTrack.isPlaying
                    : false
                }
                isPaused={
                  false
                    ? currentTrack.index === index && currentTrack.isPlaying
                    : true
                }
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              />
            ))}
          </div>
          <div
            className={`${
              isMobile
                ? "flex justify-center fixed w-full bottom-0 mb-4"
                : "flex justify-center fixed w-full bottom-0 px-[240px] mb-4"
            }`}
          >
            <AudioPlayer
              src={trackFilepaths[currentTrack.index].src}
              showSkipControls
              onClickNext={handleClickNext}
              onClickPrevious={handleClickPrevious}
              onEnded={handleEnd}
              onError={() => {
                console.log("play error");
              }}
              ref={audioPlayerRef}
              onPause={handlePause}
              onPlay={handlePlay}
            />
          </div>
        </>
      ) : (
        <h1>No Tracks</h1>
      )}
    </>
  );
};

export default TrackTable;