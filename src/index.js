import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { Player } from "./models/player.js";
import { pack } from "./services/socket.service.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
    return res.sendFile(new URL('./index.html', import.meta.url).pathname);
})

// players: {socketId: Player()}
const playerIds = [];
let playerEntities = {};

io.on("connection", socket => {
    // init player on server
    playerIds.push(socket.id);
    playerEntities[socket.id] = new Player();
    console.log(socket.id + "Connected: " + playerIds.length + " Connections");
    io.emit("new player", JSON.stringify({playerData: pack(playerEntities)}));

    // send id
    socket.on("get-id", () => {
        console.log("client looking for id");
        socket.emit("id", JSON.stringify({id: socket.id}));
    })

    // received type
    socket.on("type", (typeString) => {
        console.log(socket.id + " set device type as: " + typeString);
        console.log("Setting Device type!!!!!", playerEntities[socket.id]);
        playerEntities[socket.id].device = typeString;
        socket.send(JSON.stringify({singlePlayer: playerEntities[socket.id]}));
    })

    // received name
    socket.on("name",(nameString) => {
        console.log(socket.id + " set name as: " + nameString);
        playerEntities[socket.id].name = nameString;
        io.emit("state", JSON.stringify({playerData: pack(playerEntities)}));
    })

    // received action
    socket.on("state", (jsonPlayer) => {
        const player = JSON.parse(jsonPlayer);
        console.log("state", player);
        console.log("entities: ", playerEntities);
        playerEntities = {...playerEntities , [socket.id]: player };
        io.emit("update", JSON.stringify({playerData: pack(playerEntities)}));
    })

    // projectile
    socket.on("projectile", (jsonProjectile) => {
        const projectile = JSON.parse(jsonProjectile);
        console.log("rocket launched!");
        socket.broadcast.emit("launch-projectile", JSON.stringify({projectileData: projectile}));
    })
    
    // disconnection
    socket.on("disconnect", () => {
        console.log (socket.id + " disconnected")
        const indexToDelete = playerIds.indexOf(socket.id)
        playerIds.splice(indexToDelete, 1);
        delete playerEntities[socket.id];
    })
})

server.listen("3000", () => {
    console.log("listening on port 3000");
});

