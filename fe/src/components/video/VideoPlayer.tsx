"use client";

import dynamic from "next/dynamic";
import Head from "next/head";
import Image from "next/image";
import React, { Suspense, useEffect, useState } from "react";


interface VideoProps {
  manifest: string;
  poster: string;
  posterMobile?: string;
}
// import HLSPlayer from "./HLSPlayer";
  const HLSPlayer = dynamic(() => import("./HLSPlayer"), {
    loading: () => <VideoFallback />,
  });

const VideoPlayer: React.FC<VideoProps> = ({ manifest, poster, posterMobile = poster }) => {
  // TODO:  Use this to set the video poster
  const [video, setVideo] = useState<HTMLVideoElement | null>(null); // use callback state instead of ref due to hydration of SSR stream
  // When manifest changes -> update video -> update poster
  let [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Add device detech 
    // TODO: initial a check if necessary (print this out first)
    const matchMedia = setIsMobile(window.matchMedia("(max-width: 600px)").matches);
    window.addEventListener("resize", () => matchMedia);
  }, []);

  useEffect(() => {
    if (!video) return;

    // On render of video element -> set video poster to avoid flash (can also run transparent gif on video as poster & skip this step)
    video.poster = isMobile ? posterMobile : poster;
  }, [isMobile, video]);

  return (
    <>
      <Head>
        <link rel="preconnect" href={manifest} />
        {/* Preload posters based on device width */}
        <link
          rel="preload"
          href={poster}
          as="image"
          type="image/jpeg"
          media={"(min-width: 601px)"}
        />
        <link
          rel="preload"
          href={posterMobile}
          as="image"
          type="image/jpeg"
          media={"(max-width: 600px)"}
        />
      </Head>

      <div className="" style={{ "minWidth": "500px" }}>
        {/*<Suspense fallback={<VideoFallback poster={isMobile ? posterMobile : poster} />}>*/} {/* Render video fallback with preloaded poster */}
        <HLSPlayer
          className=""
          playsInline
          controls
          manifest={manifest}
          poster={isMobile ? posterMobile : poster}
          fowardVideoRef={setVideo}
          width={500}
          height={300}
        />
        {/* </Suspense> */}
      </div>
    </>
  );
};

export default VideoPlayer;

// Auto switch video url using native CSS (server rendered also) to correct preloaded poster
const VideoFallback = () => {
  return (
    <Image src={"/next.svg"} alt="" width={500} height={300} />
  );
};