import Boundaries from "../interfaces/Boundaries";
import Scene from "../interfaces/Scene";
import Player from "./Player";

export default class Puck {
    centerX: number;
    centerY: number;
    raduis: number;
    speed: number;
    scene: Scene;
    boundaries: Boundaries;
    velocityX: number;
    velocityY: number;

    constructor(speed: string, scene: Scene) {
        this.scene = scene;
        this.centerX = (this.scene.width / 2);
        this.centerY = (this.scene.height / 2);
        this.raduis = 0.009;
        this.speed = 0.02;
        this.boundaries = {} as Boundaries;
        this.boundaries.top = this.centerY - this.raduis;
        this.boundaries.bottom = this.centerY + this.raduis;
        this.boundaries.left = this.centerX - this.raduis;
        this.boundaries.right = this.centerX + this.raduis;
        this.velocityX = this.speed;
        this.velocityY = this.speed;
    }

    move(player) {
        this.centerX += this.velocityX;
        this.centerY += this.velocityY;
        this.updateBoundaries();
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
        }
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
        this.speed = 0.02;
    }
}