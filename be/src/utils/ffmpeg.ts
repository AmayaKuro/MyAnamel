import { $ } from "zx";
import slash from "slash";


const convertVideo = async (inputPath: string, outputPath: string, outputSegmentPath: string) => {
    const args = [
        "-i", slash(inputPath),
        "-profile:v", "baseline",
        "-level", "3.0",
        "-start_number", "0",
        "-hls_time", "10",
        "-hls_list_size", "0",
        "-f", "hls",
        "-c:a", "copy",
        "-hls_segment_filename", slash(outputSegmentPath),
        slash(outputPath),
    ]

    const { stdout, stderr } = await $`ffmpeg ${args}`;

    if (stderr) {
        console.error(`Error converting video: ${stderr}`);
    }
}

export default convertVideo;
