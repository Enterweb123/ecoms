const bodyParser = require("body-parser");
const express    = require("express");
const dotenv     = require("dotenv").config();
const dbConnect  = require("./config/dbConnect");
// display terminal - request timeing
const morgan = require("morgan");

      dbConnect();
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app        = express();
const PORT       = 4000;
const Routers    = require("./routes/index");
const cookieParser = require("cookie-parser");

// get form data confing
app.use(morgan());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie parser
app.use(cookieParser());

app.get("/", (req,res)=>{
  res.send("server home")
});

app.use("/api", Routers);

// error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});