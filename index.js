import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
    return res.json("Hello World!");
})

io.on("connection", socket => {
    console.log("Client connected w/ id: " + socket.id);
    io.emit("server received");
    
    // disconnection
    socket.on("disconnect", () => {
        console.log (socket.id + " disconnected")
    })
})

server.listen("3000", () => {
    console.log("listening on port 3000");
});

