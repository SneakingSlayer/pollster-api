const router = require("express").Router();
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary").v2;
router.post("/test", async (req, res) => {
  const data = {
    image: req.body.image,
  };

  const upload = await cloudinary.uploader.upload(data.image);

  res.status(200).json(upload);
});

module.exports = router;
