import { Server, Socket } from "socket.io";
import Player from "./Player";
import Scene from "../interfaces/Scene";
import Status from "../interfaces/Status";
import Puck from "./Puck";
import ClientSocket from "src/game/interfaces/clientSocket.interface";
import GameServer from "src/game/interfaces/GameServer.interface";

export default class Game {
    scene: Scene;
    roundsScores: number[];
    leftPlayerSocket: ClientSocket;
    rightPlayerSocket: ClientSocket;
    leftPlayer: Player;
    rightPlayer: Player;
    puck: Puck;
    room: string;
    status: Status;
    speed: string;
    round: number;
    server: GameServer;
    pausedSide: string | undefined;
    gameId: string;
    mapType: string;
    missingUser: string;
    stopedAt: Date | null;

    constructor(gameId: string, leftPlayerSokcet: ClientSocket, rightPlayerSocket: ClientSocket, speed: string, server: GameServer, gameRoom: string, mapType: string) {
        this.roundsScores = [7, 5, 3];
        this.leftPlayerSocket = leftPlayerSokcet;
        this.rightPlayerSocket = rightPlayerSocket;
        this.speed = speed;
        this.room = gameRoom;
        this.status = 'started';
        this.stopedAt = null;
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
        this.puck = new Puck(this.speed, this.scene, mapType);
        this.server = server;
        this.gameId = gameId;
        this.pausedSide = undefined;
        this.mapType = mapType;
        this.missingUser = '';
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
                if (this.leftPlayer.score > this.rightPlayer.score) {
                    this.leftPlayer.winningRounds++;
                } else {
                    this.rightPlayer.winningRounds++;
                }
                if (this.round === 2) {
                    const leftPlayerResult: string = this.leftPlayer.winningRounds > this.rightPlayer.winningRounds ? 'win' : 'lose';
                    this.leftPlayerSocket.emit('game_finished', leftPlayerResult);
                    const rightPlayerResult: string = this.rightPlayer.winningRounds > this.leftPlayer.winningRounds ? 'win' : 'lose';
                    this.rightPlayerSocket.emit('game_finished', rightPlayerResult);
                    this.status = 'finished';
                } else {
                    this.round++;
                    this.leftPlayer.score = 0;
                    this.rightPlayer.score = 0;
                    this.server.to(this.room).emit('move_next_round');
                }
            }
        }
        const player = (this.puck.velocityX > 0) ? this.rightPlayer : this.leftPlayer;
        this.puck.move(player);
        const direction = this.puck.velocityX > 0 ? 1 : -1;
        const payload: any = {
            centerX: this.puck.centerX,
            centerY: this.puck.centerY,
            direction
        }
        const leftPlayerSocketId: string = this.leftPlayerSocket.id;
        const rightPlayerSocketId: string = this.rightPlayerSocket.id;
        this.server.timeout(15000).to(this.room).emit('move_puck', payload, (err, responses) => {
            if (err && this.status !== 'paused') {
                if (responses.length) {
                    if (responses.at(0) === 'right' && leftPlayerSocketId !== this.leftPlayerSocket.id) return ;
                    if (responses.at(0) === 'left' && rightPlayerSocketId !== this.rightPlayerSocket.id) return ;
                    this.leftPlayer.winningRounds = responses.at(0) === 'left' ? 3 : 0;
                    this.rightPlayer.winningRounds = responses.at(0) === 'right' ? 3 : 0;
                    const leftPlayerResult: string = responses.at(0) === 'left' ? 'win' : 'lose';
                    this.leftPlayerSocket.emit('game_finished', leftPlayerResult);
                    const rightPlayerResult: string = responses.at(0) === 'right' ? 'win' : 'lose';
                    this.rightPlayerSocket.emit('game_finished', rightPlayerResult);
                    this.status = 'finished';
                } else if (responses.length === 0) {
                    this.leftPlayer.winningRounds = 0;
                    this.rightPlayer.winningRounds = 0;
                    this.leftPlayerSocket.emit('game_finished', 'null');
                    this.rightPlayerSocket.emit('game_finished', 'null');
                    this.status = 'finished';
                }
            }
        });
    }

    checkGoal() {
        return this.puck.centerX - this.puck.raduis <= this.scene.left || this.puck.centerX + this.puck.raduis >= this.scene.right;
    }

    setup(): void {
        this.leftPlayerSocket.join(this.room);
        this.rightPlayerSocket.join(this.room);
        this.leftPlayerSocket.on('stop_game', (payload: any) => { this.handlePausingGame(payload) });
        this.rightPlayerSocket.on('stop_game', (payload: any) => { this.handlePausingGame(payload) });
        this.rightPlayerSocket.on('disconnect', () => {
            if (this.missingUser !== '') {
                this.missingUser = '';
                this.leftPlayer.winningRounds = 0;
                this.rightPlayer.winningRounds = 0;
                this.status = 'finished';
                return ;
            }
            this.missingUser = 'right';
            this.stopedAt = new Date();
            this.leftPlayerSocket.emit('paused_game');
            this.status = 'paused';
        })
        this.leftPlayerSocket.on('disconnect', () => {
            if (this.missingUser !== '') {
                this.missingUser = '';
                this.leftPlayer.winningRounds = 0;
                this.rightPlayer.winningRounds = 0;
                this.status = 'finished';
                return ;
            }
            this.stopedAt = new Date();
            this.missingUser = 'left';
            this.rightPlayerSocket.emit('paused_game');
            this.status = 'paused';
        })
        this.leftPlayerSocket.on('move_paddle', (payload: any) => {
            if (this.status === 'started') {
                const pos: number = payload.pos;
                this.leftPlayer.move(pos);
                this.server.to(this.room).emit('move_paddle', payload);
            }
        })
        this.rightPlayerSocket.on('move_paddle', (payload: any) => {
            if (this.status === 'started') {
                const pos: number = payload.pos;
                this.rightPlayer.move(pos);
                this.server.to(this.room).emit('move_paddle', payload);
            }
        });
        this.server.to(this.room).emit('game_started');
    }

    handlePausingGame(payload: any) : void {
        if (this.status === 'started') {
            this.pausedSide = payload.side;
            this.status = 'paused';
            this.server.to(this.room).emit('game_paused');
        } else if (this.status === 'paused' && this.pausedSide === payload.side){
            this.status = 'started';
            this.server.to(this.room).emit('game_continued');
        }
    }

    rejoinTheGame(client: ClientSocket, side: string) {
        client.join(this.room);
        client.on('stop_game', (payload: any) => { this.handlePausingGame(payload) });
        client.on('disconnect', () => {
            if (this.missingUser !== '') {
                this.missingUser = '';
                this.leftPlayer.winningRounds = 0;
                this.rightPlayer.winningRounds = 0;
                this.status = 'finished';
                return ;
            }
            this.stopedAt = new Date();
            this.missingUser = side;
            side === 'right' ? this.leftPlayerSocket.emit('paused_game') : this.rightPlayerSocket.emit('paused_game');
            this.status = 'paused';
        })
        client.on('move_paddle', (payload: any) => {
            if (this.status === 'started') {
                const pos: number = payload.pos;
                side === 'right' ? this.rightPlayer.move(pos) : this.leftPlayer.move(pos);
                this.server.to(this.room).emit('move_paddle', payload);
            }
        });
        if (side === 'left') {
            this.leftPlayerSocket = client;
        } else {
            this.rightPlayerSocket = client;
        }
        this.stopedAt = null;
        this.pausedSide = '';
        this.status = 'started';
        side === 'left' ? this.rightPlayerSocket.emit('game_continued') : this.leftPlayerSocket.emit('game_continued');
    }
}