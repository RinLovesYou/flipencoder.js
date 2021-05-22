require("dotenv/config");

const { PORT } = process.env;

const express = require("express");
const path = require("path");
const multer = require('multer')
const ffmpeg = require('ffmpeg')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "tmp/");
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
  let upload = multer({
    storage: storage,
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

    // Display uploaded image for user validation
    res.send(
      `You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`
    );
  });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
