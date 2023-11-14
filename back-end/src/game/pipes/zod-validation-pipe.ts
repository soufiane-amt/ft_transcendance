import { ArgumentMetadata, HttpCode, HttpStatus, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ZodObject } from 'zod';
import MatchMakingDto from '../dto/MatchMaking.dto';
import LeaveQueueDto from '../dto/LeaveQueue.dto';
import GameInvitationDto from '../dto/GameInvitation.dto';
import GameInvitationResponseDto from '../dto/GameInvitationResponse.dto';
import JoinGameDto from '../dto/JoinGame.dto';
import RequestInvitationGameDto from '../dto/RequestInvitationGame.dto';
import JoiningLeavingGameResponseDto from '../dto/JoiningLeavingGameResponse.dto';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: any, metadata: ArgumentMetadata): MatchMakingDto | LeaveQueueDto | GameInvitationDto
    | GameInvitationResponseDto | JoinGameDto | RequestInvitationGameDto | JoiningLeavingGameResponseDto
    {
    try {
      const pl: JoiningLeavingGameResponseDto | MatchMakingDto | LeaveQueueDto | GameInvitationDto | GameInvitationResponseDto | JoinGameDto | RequestInvitationGameDto = this.schema.parse(value);
      return pl;
    } catch (error) {
      throw new WsException({ message: 'Validation failed', status: HttpStatus.BAD_REQUEST });
    }
  }
}
