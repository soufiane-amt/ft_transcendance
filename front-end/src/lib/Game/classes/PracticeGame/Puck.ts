import Boundaries from "../../interfaces/Boundaries";
import Scene from "../../interfaces/Scene";
import MapType from "../../types/MapType";
import Player from "./Player";

export default class Puck {
    ctx: CanvasRenderingContext2D;
    speed: number;
    mapType: MapType;
    centerX: number;
    centerY: number;
    raduis: number;
    velocityX: number;
    velocityY: number;
    scene: Scene;
    color: string;
    boundaries: Boundaries;

    constructor(ctx : CanvasRenderingContext2D, scene: Scene, speed: string, color: string, mapType: MapType) {
        this.ctx = ctx;
        this.scene = scene;
        this.speed = 0.004;
        this.mapType = mapType;
        if (speed === 'fast') {
            this.speed = 0.01;
        } else if (speed === 'normal') {
            this.speed = 0.005;
        }
        this.color = color;
        this.centerX = 0.5;
        this.centerY =  0.5;
        this.raduis = 0.006;
        this.velocityX = this.speed;
        this.velocityY = this.speed;
        this.boundaries = {} as Boundaries;
        this.boundaries.top = this.centerY - this.raduis;
        this.boundaries.bottom = this.centerY + this.raduis;
        this.boundaries.left = this.centerX - this.raduis;
        this.boundaries.right = this.centerX + this.raduis;
    }

    move(player: Player) : void {
        this.centerX += this.velocityX;
        this.centerY += this.velocityY;
        this.updateBoundaries();
        if (this.mapType === 'random') {
            const start: number = (this.scene.width / 2) - (0.05 / 2);
            const end: number = (this.scene.width / 2) + (0.05 / 2);
            this.centerY = this.boundaries.left >= start && this.boundaries.right <= end ? this.scene.height * Math.random() : this.centerY;
            this.centerY = this.centerY + this.raduis >= this.scene.height ? this.scene.height - this.raduis : this.centerY;
            this.centerY = this.centerY - this.raduis < 0 ? this.raduis : this.centerY;
        }
        if (this.hitTopOrBottom() === true) {
            const sceneVCenter = this.scene.height / 2;
            this.centerY = this.centerY > sceneVCenter ? this.scene.bottom - this.raduis : this.raduis;
            this.velocityY *= -1;
        }
        if (this.checkCollision(player) === true) {
            this.centerX = player.side === 'left' ? player.boundaries.right + this.raduis : player.boundaries.left - this.raduis;
            let collidePoint = this.centerY - (player.boundaries.top + (player.height / 2));
            collidePoint = collidePoint / (player.height / 2);
            collidePoint = Math.max(-1, collidePoint);
            collidePoint = Math.min(1, collidePoint);
            const direction = this.velocityX > 0 ? -1 : 1;
            const angle = collidePoint * (Math.PI / 4);
            this.velocityX = direction * this.speed * Math.cos(angle);
            this.velocityY = this.speed * Math.sin(angle);
            this.centerY += this.velocityY;
            this.velocityX = direction * this.speed;
        }
    }

    draw(player: Player) : void {
        const raduis = this.ctx.canvas.height > this.ctx.canvas.width ? Math.ceil(this.raduis * this.ctx.canvas.height) : Math.ceil(this.raduis * this.ctx.canvas.width);
        let centerX = Math.ceil(this.centerX * this.ctx.canvas.width);
        let centerY = Math.ceil(this.centerY * this.ctx.canvas.height);
        const playerBoundarie: number = player.side === 'left' ? Math.ceil(player.boundaries.right * this.ctx.canvas.width) : Math.ceil(player.boundaries.left * this.ctx.canvas.width);
        centerY = centerY + raduis > this.ctx.canvas.height ? this.ctx.canvas.height - raduis : centerY;
        centerY = centerY - raduis < 0 ? raduis : centerY;
        const playerTop: number = Math.ceil(player.boundaries.top * this.ctx.canvas.height);
        const playerBottom: number = playerTop + Math.ceil(player.height * this.ctx.canvas.height);
        if ((centerY + raduis) >= playerTop && (centerY - raduis) <= playerBottom ) {
            centerX = player.side === 'left' && (centerX - raduis < playerBoundarie) ? (playerBoundarie + raduis) : centerX;
            centerX = player.side === 'right' && (centerX + raduis > playerBoundarie) ? (playerBoundarie - raduis) : centerX;
        }
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, raduis, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    checkCollision(player: Player) {
            const boundedV: boolean = this.boundaries.bottom >= player.boundaries.top
                    && this.boundaries.top <= player.boundaries.bottom;
            if (boundedV) {
                if (player.side == 'left')
                    return this.boundaries.left < player.boundaries.right;
                else
                    return this.boundaries.right > player.boundaries.left;
            }
            return false;
        }
        
    hitTopOrBottom(): boolean {
            return this.centerY - this.raduis <= 0 || this.centerY + this.raduis >= this.scene.bottom;
        }
    
    updateBoundaries() {
            this.boundaries.top = this.centerY - this.raduis;
            this.boundaries.bottom = this.centerY + this.raduis;
            this.boundaries.left = this.centerX - this.raduis;
            this.boundaries.right = this.centerX + this.raduis;
        }
    
    reset() {
            this.centerX = 0.5;
            this.centerY = 0.5;
        }
}