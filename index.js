import http from "http";

import connectDB from "./db/index.js";
import { app } from "./app.js";

import {
    initializeSocket,
} from "./sockets/socket.js";


// =====================================================
// HTTP SERVER
// =====================================================

const httpServer =
    http.createServer(app);


// =====================================================
// SOCKET.IO
// =====================================================

const io =
    initializeSocket(
        httpServer
    );


// Make io available inside controllers
app.set(
    "io",
    io
);


// =====================================================
// DATABASE + SERVER
// =====================================================

connectDB()
    .then(() => {

        const PORT =
            process.env.PORT || 8000;

        httpServer.listen(
            PORT,
            () => {

                console.log(
                    `🚀 Server is running on port ${PORT}`
                );

                console.log(
                    `🔌 Socket.IO is running on port ${PORT}`
                );
            }
        );

    })
    .catch(
        (err) => {

            console.log(
                "MongoDB Connection Failed",
                err
            );

        }
    );