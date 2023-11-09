"use client"

import { Socket } from "socket.io-client";
import Player from "./Player";

export default class Puck {
    centerX: number;
    centerY: number;
    raduis: number;
    color: string;
    direction: number;
    ctx: CanvasRenderingContext2D;
    
    constructor(color: string, ctx: CanvasRenderingContext2D) {
        this.centerX = 0.5;
        this.centerY = 0.5;
        this.raduis = 0.006;
        this.color = color;
        this.ctx = ctx;
        this.direction = 1;
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

    move(payload: any) : void {
        const centerX: number = payload.centerX;
        const centerY: number = payload.centerY;
        const direction: number = payload.direction;
        this.centerX = centerX;
        this.centerY = centerY;
    }
}