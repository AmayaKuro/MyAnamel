import React, {
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";

import HLS from "hls.js";

interface HLSPlayerProps extends React.HTMLProps<HTMLVideoElement> {
    manifest: string;
    fowardVideoRef?: React.RefCallback<HTMLVideoElement>;
}

const HLSPlayer: React.FC<HLSPlayerProps> = (
    ({ manifest, fowardVideoRef, ...props }) => {
        const videoRef = useRef<HTMLVideoElement>(null);

        useImperativeHandle(fowardVideoRef, () => videoRef.current!);// Expose internal ref to forwardedRef. (Allows for callback & regular useRef)

        useEffect(() => {
            const src = manifest;
            const { current: video } = videoRef;
            if (!video) return;

            if (video.canPlayType("application/vnd.apple.mpegurl")) { // Safari
                video.src = src;
            } else if (HLS.isSupported()) {
                const hls = new HLS();
                hls.on(HLS.Events.MEDIA_ATTACHED, function () {
                    console.log('video and hls.js are now bound together !');
                });
                hls.on(HLS.Events.MANIFEST_PARSED, function (event, data) {
                    console.log(
                        'manifest loaded, found ' + data.levels.length + ' quality level',
                    );
                });

                hls.loadSource(src);
                hls.attachMedia(video);
            }
        }, [manifest]);

        return (
            <video {...props} ref={videoRef} />
        );
    }
);

HLSPlayer.displayName = "HLSPlayer";

export default HLSPlayer;