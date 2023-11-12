import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { Player } from "./models/player.js";
import { pack, packCSV } from "./services/socket.service.js";
import { envConfig } from "./configs/root.config.js";
import { Game } from "./models/game.js";
import { shuffle } from "./services/helper.service.js";

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
let bigs = 0;
let littles = 0; 

const gameState = new Game();

io.on("connection", socket => {
    // init player on server
    playerIds.push(socket.id);
    playerEntities[socket.id] = new Player(socket.id);
    console.log(socket.id + "Connected: " + playerIds.length + " Connections");
    io.emit("new player", JSON.stringify({playerData: pack(playerEntities)}));
    
    // send game state every second
    setTimeout(() => {
        if (gameState.gamestage == 0) {
            gameState.gamestage = 1; // set to started
            gameState.timeremaining = 60 * 3; // 3 min
            gameState.map = Math.floor(Math.random() * 3); // random map
        };
    },15000)
    setInterval(() => {
        // socket.emit("game-state", JSON.stringify({gameData: gameState}));
        socket.emit("game-state", gameState.toCSV());
        gameState.timeremaining -= 1;
    },
    800)

    // Check if enough players.. then set game
    if (gameState.gamestage == 0 && playerIds.length == envConfig.match_players && littles > 0 && bigs >= envConfig.min_bigs) {
        gameState.gamestage = 1; // set to started
        gameState.timeremaining = 60 * 3; // 3 min
        gameState.map = Math.floor(Math.random() * 3); // random map
    }
    // send id
    socket.on("get-id", () => {
        socket.emit("id", JSON.stringify({id: socket.id}));
    })

    // received type
    socket.on("type", (typeString) => {
        if(typeString == "console") {
            console.log("Bigs: " + ++bigs)
        } else {
            console.log("littles: " + ++littles);
        }
        playerEntities[socket.id].device = typeString;
        socket.send(JSON.stringify({singlePlayer: playerEntities[socket.id]}));
        

    })

    // received name
    socket.on("name",(nameString) => {
        playerEntities[socket.id].name = nameString;
        io.emit("state", JSON.stringify({playerData: pack(playerEntities)}));
        io.emit("state", );
    })

    // host ready

    // received action
    socket.on("state", (jsonPlayer) => {
        const player = JSON.parse(jsonPlayer);
        playerEntities = {...playerEntities , [socket.id]: {id: socket.id, ...player} };
        // io.emit("update", JSON.stringify({playerData: pack(playerEntities)}));
        console.log(playerEntities[socket.id]);
        io.emit("update", packCSV(playerEntities).join(" "));
    })

    // projectile
    socket.on("projectile", (jsonProjectile) => {
        const projectile = JSON.parse(jsonProjectile);
        socket.broadcast.emit("launch-projectile", JSON.stringify({projectileData: projectile}));
    })
    
    // disconnection
    socket.on("disconnect", () => {
        console.log (socket.id + " disconnected");
        console.log(playerIds.length + " Connections");
        const indexToDelete = playerIds.indexOf(socket.id)
        playerIds.splice(indexToDelete, 1);
        delete playerEntities[socket.id];
    })
})



server.listen("3000", () => {
    console.log("listening on port 3000");
});

