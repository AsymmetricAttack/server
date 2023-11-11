export class Player {
    id = "";
    device = ""; // Desktop, Handheld, Console, Unknown
    positionx = 0.01;
    positiony = 0.01;
    positionz = 0.01;
    rotationx = 0.01;
    rotationy = 0.01;
    rotationz = 0.01;
    health = 0.01;
    score = 0.01;
    team = "";
    username = "";
    
    constructor(id = "xxx", device = "Unknown", health = 100, score = 0, team = "pending", username = "noName" ) { }
}