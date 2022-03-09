const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
const cloudinary = require("cloudinary").v2;

//Routes
const index = require("./routes/index");
const auth = require("./routes/auth");
const polls = require("./routes/polls");
const votes = require("./routes/votes");
const users = require("./routes/user");
const search = require("./routes/search");
const test = require("./routes/test");
const permissions = require("./routes/permissions");
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(
  process.env.DB_CONNECT || process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("Mongo Connected")
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/api/v1", index);
app.use("/api/v1", auth);
app.use("/api/v1", polls);
app.use("/api/v1", votes);
app.use("/api/v1", users);
app.use("/api/v1", search);
app.use("/api/v1", permissions);
/**if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, '/client/build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}
else{
    app.get('/', (req, res) =>{
        res.send('API running')
    })
}*/

app.listen(PORT, () => console.log("Server Connected at port ", PORT));
