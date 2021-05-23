const os = require("os");
const path = require("path");
const fs = require("fs");
const { execFile } = require("child_process");

class FFmpeg {
  constructor() {
    const [ffmpeg, ffprob] = this.getExecutables();
    this.ffmpeg = ffmpeg;
    this.ffprob = ffprob;
  }

  getExecutables() {
    const platform = os.platform();
    const isSupported = fs
      .readdirSync(path.join(__dirname, "../../dependencies/"))
      .some((v) => v === platform);
    if (!isSupported)
      throw new Error(
        `${platform} is unsupported, please add ffmpeg and ffprobe dependencies for your platform`
      );
    const dependencies = fs
      .readdirSync(path.join(__dirname, `../../dependencies/${platform}`))
      .map((d) => path.join(__dirname, `../../dependencies/${platform}/${d}`));
    return dependencies;
  }

  async stripFramesFromClip(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      execFile(
        this.ffmpeg,
        [
          "-i",
          inputPath,
          "-filter:v",
          "fps=30",
          path.join(outputPath, "frame_%d.png"),
        ],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }
}

const ffmpeg = new FFmpeg();

console.log(ffmpeg);

module.exports = ffmpeg;
