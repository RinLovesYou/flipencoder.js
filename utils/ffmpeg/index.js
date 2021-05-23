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

  async extractFrames(inputPath, outputPath) {
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

  async compressFrames(framesPath) {
    framesPath = path.join(framesPath, "frame_%d.png");
    return new Promise((resolve, reject) => {
      execFile(
        this.ffmpeg,
        ["-i", framesPath, "-vf", "scale=256:192", framesPath],
        (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        }
      );
    });
  }

  async extractAudio(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      execFile(
        this.ffmpeg,
        [
          "-i",
          inputPath,
          "-ac",
          "1",
          "-ar",
          "8192",
          path.join(outputPath, "audio.wav"),
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

module.exports = ffmpeg;
