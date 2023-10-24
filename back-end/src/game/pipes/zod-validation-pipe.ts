import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ZodObject } from 'zod';
import MatchMakingDto from '../dto/MatchMaking.dto';
import LeaveQueueDto from '../dto/LeaveQueue.dto';
import GameInvitationDto from '../dto/GameInvitation.dto';
import GameInvitationResponseDto from '../dto/GameInvitationResponse.dto';
import JoinGameDto from '../dto/JoinGame.dto';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: any, metadata: ArgumentMetadata): MatchMakingDto | LeaveQueueDto {
    try {
      const pl: MatchMakingDto | LeaveQueueDto | GameInvitationDto | GameInvitationResponseDto | JoinGameDto = this.schema.parse(value);
      return pl;
    } catch (error) {
      throw new WsException('Validation failed');
    }
  }
}
