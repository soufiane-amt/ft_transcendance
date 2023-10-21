import GameSettings from './GameSettings.interface';
import { Player } from './player.interface';

export default interface HostPlayer {
  player: Player;
  game_settings: GameSettings;
}
