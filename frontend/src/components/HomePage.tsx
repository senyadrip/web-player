import React from "react";
// import Authenticator from "./Authenticator";
import TrackTable from "./TrackTable";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/src/styles.scss";
import song from "../assets/games_snippet.mp3";
import useIsMobile from "./useIsMobile";
import useFetchTracks from "./useFetchTracks";

const HomePage = () => {

  const isMobile = useIsMobile();

  return (
    <div>
      <div className="relative flex items-center mb-12 mt-8">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-semibold text-5xl">
          Music Player
        </h1>
      </div>
      <TrackTable />
    </div>
  );
};

export default HomePage;