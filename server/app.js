//server.js

require('dotenv').config();
const express = require("express");
// const bodyParser = require("body-parser");
const cors = require('cors');
require('./db/db');
const path = require("path")
const app = express();
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

require("./models/user");
require("./models/post");
require("./models/file");
require("./models/otp");

app.use(express.json());
app.use(cors());
// app.use(express.static(path.join(__dirname, '..', 'build')));

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/file"));

// app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}))
// app.use(bodyParser.urlencoded({extended:true}))

if(process.env.NODE_ENV === 'production') {
  app.use(express.static("client/build"))

  app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}


// if (process.env.NODE_ENV == "production") {
//   //for heroku deployment
//   app.use(express.static("client/build"));
//   const path = require("path");
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }
// ,
//     "heroku-postbuild":"NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});
