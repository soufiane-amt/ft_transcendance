import Boundaries from "../../interfaces/Boundaries";
import Scene from "../../interfaces/Scene";
import Role from "../../types/Role";
import Puck from "./Puck";

export default class Player {
    score: number;
    winningRounds: number;
    x : number;
    y: number;
    height: number;
    width: number;
    side: string;
    color: string;
    boundaries: Boundaries;
    ctx: CanvasRenderingContext2D;
    scene: Scene;
    role: Role;
    speed: number;

    constructor(ctx: CanvasRenderingContext2D, scene: Scene, role: Role, color: string, side: string) {
        this.score = 0;
        this.side = side;
        this.scene = scene;
        this.role = role;
        this.color = color;
        this.ctx = ctx;
        this.width = 0.012;
        this.height = 0.12;
        this.x = this.side === 'left' ? 0.01 : 0.99 - this.width;
        this.y = this.side === 'left' ? 0 : 1 - this.height;
        this.speed = this.role === 'Computer' ? 0.01 : 0;
        this.boundaries = {} as Boundaries;
        this.boundaries.top = this.y;
        this.boundaries.bottom = this.y + this.height;
        this.boundaries.left = this.x;
        this.boundaries.right = this.x + this.width;
        this.winningRounds = 0;
    }

    draw() : void {
        const x: number = this.boundaries.left * this.ctx.canvas.width;
        const y: number = this.boundaries.top * this.ctx.canvas.height;
        const width: number = Math.ceil(this.width * this.ctx.canvas.width);
        const height: number = Math.ceil(this.height * this.ctx.canvas.height);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(x, y, width, height);
    }

    moveComputer(puck: Puck) : void {
        if (this.boundaries.top + (this.height / 2) >= puck.centerY) {
            this.boundaries.top -= this.speed;
        } else if (this.boundaries.top + (this.height / 2) < puck.centerY) {
            this.boundaries.top += this.speed;
        }
        this.boundaries.top = this.boundaries.top <= 0 ? 0 : this.boundaries.top;
        this.boundaries.top = this.boundaries.top + this.height >= this.scene.height ? this.scene.height - this.height : this.boundaries.top;
        this.boundaries.bottom = this.boundaries.top + this.height;
    }

    moveUser(newPos: number) : void {
        this.y = newPos - (this.height / 2);
        this.y = this.y <= this.scene.top ? this.scene.top : this.y;
        this.y = this.y + this.height >= this.scene.height ? this.scene.height - this.height : this.y;
        this.boundaries.top = this.y;
        this.boundaries.bottom = this.y + this.height;
    }
}