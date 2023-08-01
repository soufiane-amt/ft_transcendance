import { PartialType } from '@nestjs/mapped-types';
import { MessageDto } from './chat.dto';
import { channelDto } from './chat.dto';

export interface UpdateChannelDto extends channelDto {
  user_id: string
  channel_id :string
}
