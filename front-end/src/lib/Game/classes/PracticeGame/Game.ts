import React from "react";
import Scene from "../../interfaces/Scene";
import MapType from "../../types/MapType";
import Speed from "../../types/Speed";
import Status from "../../types/Status";
import Player from "./Player";
import Puck from "./Puck";
import DeviceType from "../../types/DeviceType";


export default class PracticeGame {
    mapType: MapType;
    container: HTMLDivElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    offcanvas: HTMLCanvasElement
    offctx: CanvasRenderingContext2D;
    User: Player;
    Computer: Player;
    puck: Puck;
    roundsScores: number[];
    currentRound: number;
    status: Status;
    scene: Scene;
    SetComputerScore: React.Dispatch<number>;
    SetUserScore: React.Dispatch<number>;
    SetRound: React.Dispatch<number>;
    computerDistance: number;
    DeviceType: DeviceType;


    constructor(mapType: MapType, speed: string, SetUserScore: React.Dispatch<number>, SetComputerScore: React.Dispatch<number>, SetRound: React.Dispatch<number>) {
        this.scene = {} as Scene;
        this.scene.top = 0;
        this.scene.bottom = 1;
        this.scene.left = 0;
        this.scene.right = 1;
        this.scene.height = 1;
        this.scene.width = 1;
        this.computerDistance = 0.7;
        this.SetComputerScore = SetComputerScore;
        this.SetRound = SetRound;
        this.SetUserScore = SetUserScore;
        this.mapType = mapType;
        this.container = document.getElementById('canvas-container') as HTMLDivElement;
        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.offcanvas = document.createElement('canvas') as HTMLCanvasElement;
        this.offctx = this.offcanvas.getContext('2d') as CanvasRenderingContext2D;
        const elementColor: string = mapType === 'blue' ? '#0D0149' : 'WHITE';
        this.User = new Player(this.ctx, this.scene, 'User', elementColor, 'left');
        this.Computer = new Player(this.ctx, this.scene, 'Computer', elementColor, 'right');
        this.puck = new Puck(this.ctx, this.scene, speed, elementColor, this.mapType);
        this.roundsScores = [7, 5, 3];
        this.currentRound = 0;
        this.status = 'started';
        this.DeviceType = 'Laptop';
        this.setup();
    }

    setup() {
        this.resize();
        this.canvas.addEventListener('mousemove', this.moveUser.bind(this));
    }

    play() {
        this.update();
        this.render();
    }

    render() {
        this.ctx.drawImage(this.offcanvas, 0, 0);
        this.User.draw(this.DeviceType);
        this.Computer.draw(this.DeviceType);
        const player: Player = (this.puck.velocityX > 0) ? this.Computer : this.User;
        this.puck.draw(player, this.DeviceType);
    }

    update() {
        if (this.checkGoal() === true) {
            if (this.puck.velocityX > 0) {
                this.SetUserScore(++this.User.score);
            } else {
                this.SetComputerScore(++this.Computer.score);
            }
            if (this.User.score === this.roundsScores[this.currentRound] || this.Computer.score === this.roundsScores[this.currentRound]) {
                if (this.User.score > this.Computer.score) {
                    this.User.winningRounds++;
                } else {
                    this.Computer.winningRounds++;
                }
                if (this.currentRound === 2) {
                    this.status = 'finished';
                    document.removeEventListener('mousemove', this.moveUser.bind(this));
                } else {
                    this.Computer.speed *= 2;
                    this.computerDistance -= 0.1;
                    this.currentRound++;
                    this.User.score = 0;
                    this.Computer.score = 0;
                    this.SetRound(this.currentRound + 1);
                    this.SetUserScore(this.User.score);
                    this.SetComputerScore(this.Computer.score);   
                }
            }
            this.puck.reset();
        }
        const player: Player = (this.puck.velocityX > 0) ? this.Computer : this.User;
        this.puck.move(player);
        if (this.puck.centerX > this.computerDistance && this.puck.velocityX > 0 && (this.puck.centerY < this.Computer.boundaries.top || this.puck.centerY > this.Computer.boundaries.bottom))
            this.Computer.moveComputer(this.puck);
    }

    checkGoal() {
        return this.puck.centerX - this.puck.raduis <= this.scene.left || this.puck.centerX + this.puck.raduis >= this.scene.right;
    }

    resize() : void {
        const width: number = Number(window.getComputedStyle(this.container).getPropertyValue('width').slice(0, -2));
        const height: number = Number(window.getComputedStyle(this.container).getPropertyValue('height').slice(0, -2));
        if (width > 425)
            this.DeviceType = 'Laptop';
        else if (width <= 425)
            this.DeviceType = 'Mobile';
        this.canvas.height = height;
        this.canvas.width = width;
        this.offcanvas.height = this.canvas.height;
        this.offcanvas.width = this.canvas.width;
        this.drawbackground();
        this.render();
    }

    drawbackground() : void {
        switch(this.mapType) {
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
        this.offctx.fillRect(0, 0, this.offcanvas.width, this.offcanvas.height);
        this.offctx.fillStyle = '#0D0149';
        const end: number = this.DeviceType === 'Laptop' ? this.offcanvas.height : this.offcanvas.width;
        for(let i = 0; i <= end;) {
            const width = this.DeviceType === 'Laptop' ? Math.ceil(this.offcanvas.width * 0.004) : Math.ceil(this.offcanvas.width * 0.06);
            const x = this.DeviceType === 'Laptop' ? (this.offcanvas.width / 2) - (width / 2) : i;
            const height = this.DeviceType === 'Laptop' ? Math.ceil(this.offcanvas.height * 0.06) : Math.ceil(this.offcanvas.height * 0.004);
            const y = this.DeviceType === 'Laptop' ? i : (this.offcanvas.height / 2) - (height / 2);
            this.offctx.fillRect(x, y, width, height);
            i += this.DeviceType === 'Laptop' ? (height) + 3 : width + 3;
        }
    }

    drawRedMap() : void {
        this.offctx.fillStyle = '#FF3230';
        this.offctx.fillRect(0, 0, this.offcanvas.width, this.offcanvas.height);
        this.offctx.fillStyle = 'WHITE';
        const width = this.DeviceType === 'Laptop' ? Math.ceil(this.offcanvas.width * 0.003) : this.offcanvas.width;
        const height = this.DeviceType === 'Laptop' ? this.offcanvas.height : Math.ceil(this.offcanvas.height * 0.003);
        const x = this.DeviceType === 'Laptop' ? (this.offcanvas.width / 2) - (width / 2) : 0;
        const y = this.DeviceType === 'Laptop' ? 0 : (this.offcanvas.height / 2) - (height / 2);
        this.offctx.fillRect(x, y, width, height);
        this.offctx.beginPath();
        const centerX = (this.offcanvas.width / 2);
        const centerY = (this.offcanvas.height / 2);
        const raduis = Math.ceil(this.offcanvas.width * 0.08);
        this.offctx.lineWidth = Math.ceil(this.offcanvas.width * 0.002);
        this.offctx.strokeStyle = 'WHITE';
        this.offctx.beginPath();
        this.offctx.arc(centerX, centerY, raduis, 0, Math.PI * 2);
        this.offctx.closePath();
        this.offctx.stroke();
    }

    drawRandomMap() : void {
        this.offctx.fillStyle = '#393970';
        this.offctx.fillRect(0, 0, this.offcanvas.width, this.offcanvas.height);
        this.offctx.fillStyle = 'WHITE';
        const width = this.DeviceType === 'Laptop' ? Math.ceil(this.offcanvas.width * 0.05) : this.offcanvas.width;
        const height = this.DeviceType === 'Laptop' ? this.offcanvas.height : Math.ceil(this.offcanvas.height * 0.05);
        const x = this.DeviceType === 'Laptop' ? (this.offcanvas.width / 2) - (width / 2) : 0;
        const y = this.DeviceType === 'Laptop' ? 0 : (this.offcanvas.height / 2) - (height / 2);
        this.offctx.fillRect(x, y, width, height);
    }

    moveUser(e: any) : void {
        const newPosition: number = this.DeviceType === 'Laptop' ? (e.offsetY / this.canvas.height) : (this.scene.width - (e.offsetX / this.canvas.width));
        this.User.moveUser(newPosition);
    }
}