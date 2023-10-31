"use client"

import { Socket } from "socket.io-client";
import Scene from "../interfaces/Scene";
import Player from "./Player";
import Puck from "./Puck";
import MapType from "../types/MapType";
import newSocket from "@/components/GlobalComponents/Socket/socket";

export default class Game {
    User: Player;
    Opponent: Player;
    puck: Puck;
    container : HTMLDivElement;
    canvas: HTMLCanvasElement;
    offscreenCanvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    offctx: CanvasRenderingContext2D;
    scene: Scene;
    mapType: MapType;
    socket: Socket;

    constructor(side: string, socket: Socket, mapType: MapType) {
        this.container = document.getElementById('canvas-container') as HTMLDivElement;
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D; 
        this.offscreenCanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.offctx = this.offscreenCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.scene = {} as Scene;
        this.socket = socket;
        const elementsColor: string = mapType === 'blue' ? '#0D0149' : 'WHITE';
        this.User = new Player(side, elementsColor, this.ctx, this.scene, 'User', socket);
        const opponentSide: string = side === 'left' ? 'right' : 'left';
        this.Opponent = new Player(opponentSide, elementsColor, this.ctx, this.scene, 'Opponent');
        this.puck = new Puck(elementsColor, this.ctx);
        this.mapType = mapType;
        this.scene.top = 0;
        this.scene.bottom = 1;
        this.scene.left = 0;
        this.scene.right = 1;
        this.setup(mapType);
    }

    render() : void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        this.Opponent.draw();
        this.User.draw();
        this.puck.draw();
    }

    drawbackground(mapType: MapType) : void {
        switch(mapType) {
            case 'blue' :
                this.drawBlueMap();
                break;
            case 'red':
                this.drawRedMap();
                break ;
            case 'random' :
                this.drawRandomMap();
                break;
        }
    }

    drawBlueMap() : void {
        this.offctx.fillStyle = '#B2A4FA';
        this.offctx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offctx.fillStyle = '#0D0149';
        for(let i = 0; i <= this.offscreenCanvas.height;) {
            const width = Math.ceil(this.offscreenCanvas.width * 0.004);
            const x = (this.offscreenCanvas.width / 2) - (width / 2);
            const y = i;
            const height = Math.ceil(this.offscreenCanvas.height * 0.06);
            this.offctx.fillRect(x, y, width, height);
            i += (height) + 3;
        }
    }

    drawRedMap() : void {
        this.offctx.fillStyle = '#FF3230';
        this.offctx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offctx.fillStyle = 'WHITE';
        const width = Math.ceil(this.offscreenCanvas.width * 0.003);
        const x = (this.offscreenCanvas.width / 2) - (width / 2);
        const y = 0;
        const height = this.offscreenCanvas.height;
        this.offctx.fillRect(x, y, width, height);
        this.offctx.beginPath();
        const centerX = (this.offscreenCanvas.width / 2);
        const centerY = (this.offscreenCanvas.height / 2);
        const raduis = Math.ceil(this.offscreenCanvas.width * 0.08);
        this.offctx.lineWidth = Math.ceil(this.offscreenCanvas.width * 0.002);
        this.offctx.strokeStyle = 'WHITE';
        this.offctx.beginPath();
        this.offctx.arc(centerX, centerY, raduis, 0, Math.PI * 2);
        this.offctx.closePath();
        this.offctx.stroke();
    }

    drawRandomMap() : void {
        this.offctx.fillStyle = '#393970';
        this.offctx.fillRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.offctx.fillStyle = 'WHITE';
        const width = Math.ceil(this.offscreenCanvas.width * 0.05);
        const x = (this.offscreenCanvas.width / 2) - (width / 2);
        const y = 0;
        const height = this.offscreenCanvas.height;
        this.offctx.fillRect(x, y, width, height);
    }

    resize() : void {
        const width: number = Number(window.getComputedStyle(this.container).getPropertyValue('width').slice(0, -2));
        const height: number = Number(window.getComputedStyle(this.container).getPropertyValue('height').slice(0, -2));
        this.canvas.height = height;
        this.canvas.width = width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCanvas.width = this.canvas.width;
        this.drawbackground(this.mapType);
        this.render();
    }

    setup(mapType: MapType) :  void {
        this.resize();
        this.socket.on('move_paddle', (payload: any) => {
            const player: Player = payload.side === this.User.side ? this.User : this.Opponent;
            const newPos: number = payload.pos;
            player.upadatepos(newPos);
        })
        window.addEventListener('keypress', (e) => {
            if (e.key === ' ') {
                const payload: any = {
                    side: this.User.side,
                }
                this.socket.emit('stop_game', payload);
            }          
        })
        this.socket.on('move_ball', (payload: any) => {
            this.puck.move(payload);
        })
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            const newPosition: number = (e.offsetY / this.canvas.height);
            this.User.move(newPosition);
        })
    }
}