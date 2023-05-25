import env from "dotenv";
import jwt from "jsonwebtoken";

env.config();

const SECRET = process.env.SECRET;
const expiration = "48h";

function signToken({ _id }) {
    const payload = { _id };
    return jwt.sign({ data: payload }, SECRET, { expiresIn: expiration });
};

function auth(req, res, next) {
    const token = req.header("Authorization").replace("Bearer ", "") || "";

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const verified = jwt.verify(token, SECRET, { maxAge: expiration });
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Token is not valid" });
    }
};

export { signToken, auth };