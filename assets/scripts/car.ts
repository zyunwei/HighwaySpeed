class car {
    positionX: number;
    positionY: number;
    speed: number;
    isAccelerating: boolean;

    constructor(x: number, y: number) {
        this.isAccelerating = false;
        this.speed = 0;
        this.positionX = x;
        this.positionY = y;
    }
}

export default car;