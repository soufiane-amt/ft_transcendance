"use client"
import { Socket } from "socket.io-client";
import Boundaries from "../interfaces/Boundaries";
import Scene from "../interfaces/Scene";
import Role from "../types/Role";

export default class Player {
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
    socket?: Socket;

    constructor(side: string, color: string, ctx: CanvasRenderingContext2D, scene: Scene, role : Role, socket?: Socket) {
        this.width = 0.012;
        this.role = role;
        this.height = 0.12;
        this.y = side === 'left' ? 0 : 1 - this.height;
        this.x = side === 'left' ? 0.01 : 0.99 - this.width;
        this.color = color;
        this.scene = scene;
        this.ctx = ctx;
        this.boundaries = {} as Boundaries;
        this.boundaries.left = this.x;
        this.boundaries.right = this.x + this.width;
        this.boundaries.top = this.y;
        this.boundaries.bottom = this.y + this.height;
        this.side = side;
        if (role === 'User')
            this.socket = socket;
    }

    move(newPosition: number) : void {
        let pos: number = newPosition - (this.height / 2);
        pos = pos + this.height > this.scene.bottom ? this.scene.bottom - this.height : pos;
        pos = pos < 0 ? 0 : pos;
        const payload: any = {
            side: this.side,
            pos
        }
        this.socket?.emit('move_paddle', payload);
    }

    upadatepos(newPosition: number) : void {
        this.boundaries.top = newPosition;
        this.boundaries.bottom = this.boundaries.top + this.height;
    }

    draw() : void {
        const x: number = this.boundaries.left * this.ctx.canvas.width;
        const y: number = this.boundaries.top * this.ctx.canvas.height;
        const width: number = Math.ceil(this.width * this.ctx.canvas.width);
        const height: number = Math.ceil(this.height * this.ctx.canvas.height);
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(x, y, width, height);
    }
}