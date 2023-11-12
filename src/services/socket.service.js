function pack(entityArray) {
    return Object.keys(entityArray).map(key => {
        return {id: key, ...entityArray[key]};
    })
}
function packCSV(entityArray) {
    return Object.values(entityArray).map(player => {
        let playerValuesArray = Object.values(player);
        // output  = player.id + "," + player.device + "," + player.positionx + "," + player.positiony + "," + player.positionz + "," + player.rotationx + "," + player.rotationy + "," + player.rotationz + "," +
        // player.health + "," + player.score + "," + player.team + "," + player.username;
        return playerValuesArray.join(",");
    })

}
export { pack, packCSV };

//     device = ""; // Desktop, Handheld, Console, Unknown
//     positionx = 0.01;
//     positiony = 0.01;
//     positionz = 0.01;
//     rotationx = 0.01;
//     rotationy = 0.01;
//     rotationz = 0.01;
//     health = 0.01;
//     score = 0.01;
//     team = "";
//     username = "";