import { Socket } from 'socket.io';
import { Player } from './player.interface';

export default interface ClientSocket extends Socket {
  userId: string;
  player: Player;
}
