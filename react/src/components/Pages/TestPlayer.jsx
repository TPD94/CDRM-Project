import React, { useState, useRef } from "react";
import shaka from "shaka-player"; // Import the Shaka Player library

function TestPlayer() {
  const [mpdUrl, setMpdUrl] = useState("");
  const [kid, setKid] = useState("");
  const [key, setKey] = useState("");
  const videoRef = useRef(null); // Ref to the video element

  const handleSubmit = () => {
    if (mpdUrl && kid && key) {
      // Split the KIDs and Keys by new lines
      const kidsArray = kid.split("\n").map((k) => k.trim());
      const keysArray = key.split("\n").map((k) => k.trim());

      if (kidsArray.length !== keysArray.length) {
        console.error("The number of KIDs and Keys must be the same.");
        return;
      }

      // Initialize Shaka Player only when the submit button is pressed
      const player = new shaka.Player(videoRef.current);
      
      // Widevine DRM configuration with the provided KIDs and Keys
      const config = {
        drm: {
          clearKeys: {},
        },
      };

      // Map KIDs to Keys
      kidsArray.forEach((kid, index) => {
        config.drm.clearKeys[kid] = keysArray[index];
      });

      console.log("Configuring player with the following DRM config:", config);

      player.configure(config);

      const manifestUri = mpdUrl; // Get the MPD URL from state

      player.load(manifestUri)
        .then(() => {
          console.log("Shaka Player loaded successfully.");
          // Start playback once the stream is loaded successfully
          videoRef.current.play();
        })
        .catch((error) => {
          console.error("Error loading the stream:", error);
        });
    }
  };

  return (
    <div className="min-w-full w-full min-h-full h-full bg-zinc-900 shadow-lg shadow-black flex flex-row overflow-y-auto pt-5 pl-5 pr-5 items-center justify-around">
      <div className="min-8/10 w-8/10 min-h-8/10 h-8/10 flex flex-row overflow-y-auto items-center justify-around border shadow-lg shadow-red-700 rounded-2xl">
        <div className="w-7/10 h-7/10 border border-black rounded-2xl p-5 bg-[rgba(0,0,0,0.2)] shadow-lg shadow-black">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            // Removed autoPlay so it doesn't start until submit is pressed
          />
        </div>
        <div className="w-2/10 h-7/10 flex flex-col border border-black rounded-2xl p-5 bg-[rgba(0,0,0,0.2)] shadow-lg shadow-black focus-within:w-3/10 transition-all duration-300 ease-in-out">
          <form className="h-full flex flex-col gap-2">
            <input
              type="text"
              placeholder="MPD URL"
              id="player_mpd"
              name="player_mpd"
              value={mpdUrl}
              onChange={(e) => setMpdUrl(e.target.value)}
              className="text-white bg-[rgba(0,0,0,0.2)] focus:outline-none rounded focus:shadow-sm focus:shadow-red-700/50 transition-all duration-300 ease-in-out p-2"
            />
            <textarea
              placeholder="KIDs, separated by new lines"
              id="player_kid"
              name="player_kid"
              value={kid}
              onChange={(e) => setKid(e.target.value)}
              className="text-white bg-[rgba(0,0,0,0.2)] focus:outline-none rounded h-1/4 focus:h-1/3 overflow-y-auto focus:shadow-sm focus:shadow-red-700/50 transition-all duration-300 ease-in-out p-2 resize-none"
            />
            <textarea
              placeholder="Keys, separated by new lines"
              id="player_key"
              name="player_key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="text-white bg-[rgba(0,0,0,0.2)] focus:outline-none rounded h-1/4 focus:h-1/3 focus:shadow-sm focus:shadow-red-700/50 transition-all duration-300 ease-in-out p-2 resize-none"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-auto bg-white text-black rounded p-2 hover:bg-slate-200 transition-colors duration-300 ease-in-out w-full cursor-pointer active:transform active:scale-95 overflow-x-hidden overflow-y-hidden"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TestPlayer;
