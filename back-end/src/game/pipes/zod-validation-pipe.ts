import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ZodObject } from 'zod';
import MatchMakingDto from '../dto/MatchMaking.dto';
import LeaveQueueDto from '../dto/LeaveQueue.dto';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  transform(value: string, metadata: ArgumentMetadata): MatchMakingDto | LeaveQueueDto {
    try {
      let pl: MatchMakingDto | LeaveQueueDto = JSON.parse(value);
      pl = this.schema.parse(pl);
      return pl;
    } catch (error) {
      throw new WsException('Validation failed');
    }
  }
}
