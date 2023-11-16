"use client"

import { Socket } from "socket.io-client";
import Player from "./Player";
import DeviceType from "../../types/DeviceType";
import Scene from "../../interfaces/Scene";

export default class Puck {
    centerX: number;
    centerY: number;
    raduis: number;
    color: string;
    direction: number;
    scene: Scene
    ctx: CanvasRenderingContext2D;
    
    constructor(color: string, ctx: CanvasRenderingContext2D, scene: Scene) {
        this.centerX = 0.5;
        this.centerY = 0.5;
        this.raduis = 0.006;
        this.color = color;
        this.ctx = ctx;
        this.direction = 1;
        this.scene = scene;
    }

    draw(player: Player, deviceType: DeviceType) : void {
        const raduis = this.ctx.canvas.height > this.ctx.canvas.width ? Math.ceil(this.raduis * this.ctx.canvas.height) : Math.ceil(this.raduis * this.ctx.canvas.width);
        let centerX = deviceType === 'Laptop' ? Math.ceil(this.centerX * this.ctx.canvas.width) : Math.ceil((this.scene.width - this.centerY) * this.ctx.canvas.width);
        let centerY = deviceType === 'Laptop' ? Math.ceil(this.centerY * this.ctx.canvas.height) : Math.ceil(this.centerX * this.ctx.canvas.height);
        var playerBoundarie: number = 0;
        if (deviceType === 'Laptop') {
            playerBoundarie = player.side === 'left' ? Math.ceil(player.boundaries.right * this.ctx.canvas.width) : Math.ceil(player.boundaries.left * this.ctx.canvas.width);
        } else if (deviceType === 'Mobile') {
            playerBoundarie = player.side === 'left' ? Math.ceil(player.boundaries.right * this.ctx.canvas.height) : Math.ceil(player.boundaries.left * this.ctx.canvas.height);
        }
        if (deviceType === 'Laptop') {
            centerY = centerY + raduis > this.ctx.canvas.height ? this.ctx.canvas.height - raduis : centerY;
            centerY = centerY - raduis < 0 ? raduis : centerY;
        } else if (deviceType === 'Mobile') {
            centerX = centerX + raduis > this.ctx.canvas.width ? this.ctx.canvas.width - raduis : centerX;
            centerX = centerX - raduis < 0 ? raduis : centerX;  
        }
        if (deviceType === 'Laptop') {
            const playerTop: number = Math.ceil(player.boundaries.top * this.ctx.canvas.height);
            const playerBottom: number = playerTop + Math.ceil(player.height * this.ctx.canvas.height);
            if ((centerY + raduis) >= playerTop && (centerY - raduis) <= playerBottom ) {
                centerX = player.side === 'left' && (centerX - raduis < playerBoundarie) ? (playerBoundarie + raduis) : centerX;
                centerX = player.side === 'right' && (centerX + raduis > playerBoundarie) ? (playerBoundarie - raduis) : centerX;
            }
        } else if (deviceType === 'Mobile') {
            const playerLeft: number = Math.ceil(player.boundaries.bottom * this.ctx.canvas.height);
            const playerRight: number = playerLeft + Math.ceil(player.width * this.ctx.canvas.width);
            if ((centerX + raduis) >= playerLeft && (centerX - raduis) <= playerRight ) {
                centerY = player.side === 'left' && (centerY - raduis < playerBoundarie) ? (playerBoundarie + raduis) : centerY;
                centerY = player.side === 'right' && (centerY + raduis > playerBoundarie) ? (playerBoundarie - raduis) : centerY;
            }
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