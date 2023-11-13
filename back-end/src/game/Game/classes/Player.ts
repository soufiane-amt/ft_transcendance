import Boundaries from "../interfaces/Boundaries";
import Scene from "../interfaces/Scene";

export default class Player {
    x: number;
    y: number;
    height: number;
    width: number;
    boundaries : Boundaries;
    score: number;
    winningRounds: number;
    side: string;

    constructor(side: string) {
        this.width = 0.012;
        this.height = 0.12;
        this.x = side === 'left' ? 0.01 : 0.99 - this.width;
        this.y = side === 'left' ? 0 : 1 - this.height;
        this.boundaries = {} as Boundaries;
        this.boundaries.top = this.y;
        this.boundaries.bottom = this.y + this.height;
        this.boundaries.left = this.x;
        this.boundaries.right = this.x + this.width;
        this.score = 0;
        this.winningRounds = 0;
        this.side = side;
    }

    move(newPos: number) {
        this.boundaries.top = newPos;
        this.boundaries.bottom = this.boundaries.top + this.height;
    }

    addScore(): void {
        this.score++;
    }

    addRound(): void {
        this.winningRounds++;
    }
}