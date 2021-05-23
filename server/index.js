require("dotenv/config");

const { PORT } = process.env;

const express = require("express");
const path = require("path");
const multer = require('multer')
const fs = require('fs')
const { promisify } = require('util')
const { v4: uuid } = require('uuid')

const mkdir = promisify(fs.mkdir)

const ffmpeg = require('../utils/ffmpeg')
const outputDirectory = path.join(__dirname, '../tmp/outputs')


const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/inputs");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.post("/api/upload", async (req, res, next) => {
  console.log('Received video file to upload')
  const upload = multer({
    storage: uploadStorage,
  }).single("video");

  upload(req, res, async (err) => {

    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.file) {
      return res.send("Please select a video to upload");
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }
    console.log(`Successfully uploaded video into storage: ${req.file.path}"`);

    console.log(`Beginning splitting frames from video: ${req.file.path}"`);


    const filePath = path.join(__dirname, '../' ,req.file.path)
    const id = uuid()
    const outputPath = path.join(outputDirectory, id);
    const framesOutputPath = path.join(outputPath, "frames");
    const audioOutputPath = path.join(outputPath, "audio");
    await mkdir(outputPath)
    await mkdir(framesOutputPath);
    await mkdir(audioOutputPath);

    const ffmpegSplitResponse = await ffmpeg.stripFramesFromClip(filePath, framesOutputPath)




    // Display uploaded image for user validation
    res.send(
      `You have uploaded this video: ${req.file.path}"`
    );
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
