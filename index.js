require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.error("Connected to Database"));


app.use(express.json());
app.use(
    cors({origin: "http://localhost:3000"})
);

const userRouter = require("./routes/user");
app.use("/user", userRouter);

app.listen(process.env.PORT, () => console.log("Server Started"));
