import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "20kb" }));

app.use(
    express.urlencoded({
        extended: true,
        limit: "20kb",
    })
);

app.use(express.static("public"));


app.use(cookieParser());
import voiceRouter from "./routes/voice.routes.js";
import commentRouter from "./routes/comment.routes.js";
import followRouter from "./routes/follow.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import userRouter from "./routes/user.routes.js";

app.use("/api/v1/voices", voiceRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/users", userRouter);

export { app };