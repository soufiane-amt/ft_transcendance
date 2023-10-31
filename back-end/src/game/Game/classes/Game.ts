import { Server, Socket } from "socket.io";
import Player from "./Player";
import Scene from "../interfaces/Scene";
import Status from "../interfaces/Status";
import Puck from "./Puck";

export default class Game {
    scene: Scene;
    roundsScores: number[];
    leftPlayerSocket: Socket;
    rightPlayerSoket: Socket;
    leftPlayer: Player;
    rightPlayer: Player;
    puck: Puck;
    room: string;
    status: Status;
    speed: string;
    round: number;
    server: Server;
    pausedSide: string;
    gameId: string;

    constructor(gameId: string, leftPlayerSokcet: Socket, rightPlayerSocket: Socket, speed: string, server: Server, gameRoom: string) {
        this.roundsScores = [5, 4, 3];
        this.leftPlayerSocket = leftPlayerSokcet;
        this.rightPlayerSoket = rightPlayerSocket;
        this.speed = speed;
        this.room = gameRoom;
        this.status = 'started';
        this.round = 0;
        this.scene = {} as Scene;
        this.scene.top = 0;
        this.scene.bottom = 1;
        this.scene.left = 0;
        this.scene.right = 1;
        this.scene.width = 1;
        this.scene.height = 1;
        this.leftPlayer = new Player('left');
        this.rightPlayer = new Player('right');
        this.puck = new Puck(this.speed, this.scene);
        this.server = server;
        this.gameId = gameId;
        this.setup();
    }

    play() : void {
        this.update();
    }

    update() : void {
        if (this.checkGoal()) {
            if (this.puck.centerX > (this.scene.width / 2)) {
                this.leftPlayer.score++;
                const payload : string = 'left';
                this.server.to(this.room).emit('update_score', payload);
            }
            else {
                this.rightPlayer.score++;
                const payload : string = 'right';
                this.server.to(this.room).emit('update_score', payload);
            }
            this.puck.reset();
            if (this.leftPlayer.score === this.roundsScores[this.round] || this.rightPlayer.score === this.roundsScores[this.round]) {
                if (this.round === 2) {
                    const leftPlayerResult: string = this.leftPlayer.winningRounds > this.rightPlayer.winningRounds ? 'win' : 'lose';
                    this.leftPlayerSocket.emit('game_finished', leftPlayerResult);
                    const rightPlayerResult: string = this.rightPlayer.winningRounds > this.leftPlayer.winningRounds ? 'win' : 'lose';
                    this.rightPlayerSoket.emit('game_finished', rightPlayerResult);
                    this.status = 'finished';
                } else {
                    this.round++;
                    if (this.leftPlayer.score > this.rightPlayer.score) {
                        this.leftPlayer.winningRounds++;
                    } else {
                        this.rightPlayer.winningRounds++;
                    }
                    this.leftPlayer.score = 0;
                    this.rightPlayer.score = 0;
                    this.server.to(this.room).emit('move_next_round');
                }
            }
        }
        const player = (this.puck.velocityX > 0) ? this.rightPlayer : this.leftPlayer;
        this.puck.move(player);
        const payload: any = {
            centerX: this.puck.centerX,
            centerY: this.puck.centerY
        }
        this.server.to(this.room).emit('move_puck', payload);
    }

    checkGoal() {
        return this.puck.centerX - this.puck.raduis <= this.scene.left || this.puck.centerX + this.puck.raduis >= this.scene.right;
    }

    setup(): void {
        this.leftPlayerSocket.join(this.room);
        this.rightPlayerSoket.join(this.room);
        this.leftPlayerSocket.on('stop_game', (side: string) => { this.handlePausingGame(side) });
        this.rightPlayerSoket.on('stop_game', (side: string) => { this.handlePausingGame(side) });
        this.rightPlayerSoket.on('leave_game', () => {
            const payload: string = 'win';
            this.leftPlayerSocket.emit('game_finished', payload);
            this.status = 'finished';
        });
        this.leftPlayerSocket.on('leave_game', () => {
            const payload: string = 'win';
            this.rightPlayerSoket.emit('game_finished', payload);
            this.status = 'finished';
        })
        this.rightPlayerSoket.on('disconnect', () => {
            const payload: string = 'win';
            this.leftPlayerSocket.emit('game_finished', payload);
            this.status = 'finished';
        })
        this.leftPlayerSocket.on('disconnect', () => {
            const payload: string = 'win';
            this.rightPlayerSoket.emit('game_finished', payload);
            this.status = 'finished';
        })
        this.leftPlayerSocket.on('move_paddle', (payload: any) => {
            const pos: number = payload.pos;
            this.leftPlayer.move(pos);
            this.server.to(this.room).emit('move_paddle', payload);
        })
        this.rightPlayerSoket.on('move_paddle', (payload: any) => {
            const pos: number = payload.pos;
            this.rightPlayer.move(pos);
            this.server.to(this.room).emit('move_paddle', payload);
        });
        this.server.to(this.room).emit('game_started');
    }

    handlePausingGame(side: string) : void {
        if (this.status === 'started') {
            this.pausedSide = side;
            this.status = 'paused';
            this.server.to(this.room).emit('game_paused');
        } else if (this.status === 'paused' && this.pausedSide === side){
            this.status = 'started';
            this.server.to(this.room).emit('game_continued');
        }
    }
}