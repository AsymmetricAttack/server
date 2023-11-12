export class Player {
    id = "";
    device = "Unknown"; // Desktop, Handheld, Console, Unknown
    positionx = 0.01;
    positiony = 0.01;
    positionz = 0.01;
    rotationx = 0.01;
    rotationy = 0.01;
    rotationz = 0.01;
    health = 100;
    score = 0.01;
    team = "pending";
    username = "noName";
    
    constructor(id) {
        this.id = id;
    }
}