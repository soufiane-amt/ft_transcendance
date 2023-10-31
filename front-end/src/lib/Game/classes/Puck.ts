"use client"

import { Socket } from "socket.io-client";

export default class Puck {
    centerX: number;
    centerY: number;
    raduis: number;
    color: string;
    ctx: CanvasRenderingContext2D;
    
    constructor(color: string, ctx: CanvasRenderingContext2D) {
        this.centerX = 0.5;
        this.centerY = 0.5;
        this.raduis = 0.009;
        this.color = color;
        this.ctx = ctx;
    }

    draw() : void {
        const raduis = this.ctx.canvas.height > this.ctx.canvas.width ? Math.ceil(this.raduis * this.ctx.canvas.height) : Math.ceil(this.raduis * this.ctx.canvas.width);
        const centerX = Math.ceil(this.centerX * this.ctx.canvas.width);
        const centerY = Math.ceil(this.centerY * this.ctx.canvas.height);
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, raduis, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    move(payload: any) : void {
        const centerX: number = payload.centerX;
        const centerY: number = payload.centerY;
        this.centerX = centerX;
        this.centerY = centerY;
    }
}