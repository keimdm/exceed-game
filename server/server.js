import express, { urlencoded, json } from "express";
import { join } from "path";
import * as url from "url";
import routes from "./routes/index.js";
import db from "./config/connection.js";
import cors from "cors";

const app = express();
const PORT = 3001;
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "..", "client", "dist")));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "client", "dist", "index.html"));
})

app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {console.log("Listening at " + PORT)});
});


