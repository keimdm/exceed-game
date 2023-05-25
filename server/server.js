import express, { urlencoded, json } from "express";
import { join } from "path";
import * as url from "url";
import routes from "./routes/index.js";
import db from "./config/connection.js";
import cors from "cors";
import env from "dotenv";

env.config();

const app = express();
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.SERVER_PORT;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "..", "client", "dist")));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "client", "dist", "index.html"));
})

app.use(routes);

db.once('open', () => {
    console.log("connected to db");
    app.listen(PORT, () => {console.log("Listening at " + PORT)});
});


