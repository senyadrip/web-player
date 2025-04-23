import React from "react";
import slangcover from "../assets/w2l_art.svg";

interface TrackProps {
  title: string;
  artist: string;
}

const Track: React.FC<TrackProps> = ({ title, artist }) => {

  return (

    <div>
      <div className="flex items-center py-4 bg-transparent">
        <div className="flex items-center">
          <img src={slangcover} className="w-12 mr-4 rounded-sm"></img>
          <div>
            <h2 className="text-zinc-50 text-xl font-medium flex items-center">
              {title}
              <span className="text-zinc-300 text-xs ml-4">2:56</span>
              <br />
            </h2>
            <h3 className="text-zinc-100 text-lg font-normal">{artist}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;