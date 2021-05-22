require("dotenv/config");

const { PORT } = process.env;

const express = require("express");
const path = require("path");
const multer = require('multer')
const ffmpeg = require('ffmpeg')
const { uuidv4: uuid } = require('uuid')

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

  upload(req, res, function (err) {

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

    // Display uploaded image for user validation
    res.send(
      `You have uploaded this video: ${req.file.path}"`
    );
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
