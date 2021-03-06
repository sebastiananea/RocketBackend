require("dotenv").config();
const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const routes = require("./routes/index");
const { appConfig } = require("./Config/default");

//RocketAppFranco
//${DB_PASSWORD}

const app = express();
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(
    `mongodb+srv://apiAdmin:${appConfig.dbPass}@rocketapp.rnqqh.mongodb.net/Rocket?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);
app.use(
  cors({
    origin: [
      "https://rocketprojectarg.netlify.app",
      "http://localhost:3000",
      "http://gmail.com",
    ],
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(cookieparser());
app.use("/", routes);

app.listen(process.env.PORT || appConfig.port, () => {
  console.log(`Conected to ${appConfig.port}`);
});
