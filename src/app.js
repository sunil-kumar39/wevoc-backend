import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import voiceRouter from "./routes/voice.routes.js";
import commentRouter from "./routes/comment.routes.js";
import followRouter from "./routes/follow.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import userRouter from "./routes/user.routes.js";
import historyRouter from "./routes/history.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import searchRouter from "./routes/search.routes.js";
import notificationRouter from "./routes/notification.routes.js";

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

app.use("/api/v1/voices", voiceRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/follows", followRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/history", historyRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/notifications", notificationRouter);

export { app };