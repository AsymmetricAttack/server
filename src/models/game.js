export class Game {
    // redTeam = [];
    // blueTeam = [];
    timeremaining = 0; // seconds
    gamestage = 0; // 0... Not started, 1... started, 2 ended
    gamemode = 0;
    map = 2;

    constructor() { }

    toCSV() {
        let output = this.timeremaining + "," + this.gamestage + "," + this.gamemode + "," + this.map;
        return output
    }
}